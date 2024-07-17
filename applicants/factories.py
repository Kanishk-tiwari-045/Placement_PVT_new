import factory
import factory.fuzzy
from factory import Faker

from django.contrib.contenttypes.models import ContentType

from .models import *
from marketing.factories import AttachmentFactory, UserFactory


class ApplicantProfileFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = ApplicantProfile

    applicant = factory.SubFactory(UserFactory)
    highest_qualification = Faker('sentence', nb_words=3)
    stream = Faker('word')
    year = Faker('random_element', elements=["2021", "2022", "2023"])
    education_status = Faker('random_element', elements=["Finished", "Pursuing"])
    passing_year = Faker('random_int', min=2000, max=2025)
    cgpa = Faker('pydecimal', left_digits=1, right_digits=2, positive=True)
    address = Faker('address')
    city = Faker('city')
    state = Faker('state')
    pincode = Faker('postcode')
    
    @factory.post_generation
    def skills(self, create, extracted, **kwargs):
        if not create:
            # Skip if not creating
            return
        if extracted:
            # Add provided skills
            for skill in extracted:
                self.skills.add(skill)

    # Define a factory trait to add attachments
    @factory.post_generation
    def create_attachments(self, create, extracted, **kwargs):
        if not create:
            return
        if extracted:
            for _ in range(extracted):
                AttachmentFactory(content_object=self)


user = UserFactory.create()
ApplicantProfile = ApplicantProfileFactory.create(applicant=user)
