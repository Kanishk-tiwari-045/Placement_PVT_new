import factory
from factory.django import DjangoModelFactory
from factory import fuzzy  # Correct import for fuzzy

from django.contrib.contenttypes.models import ContentType
from attachments.models import Attachment
from accounts.models import CustomUser

ATTACHMENT_TYPE = (
    ("resume", "Resume"),
    ("misc", "Miscellaneous"),
    ("academic", "Academic Docs"),
    ("photo_id", "Miscellaneous"),
    ("certificates", "Certificates"),
)

class UserFactory(DjangoModelFactory):
    class Meta:
        model = CustomUser

    username = factory.Faker("user_name")
    name = factory.Faker("name")
    email = factory.Faker("email")  # Use correct Faker format
    password = factory.PostGenerationMethodCall("set_password", "password123")

class OrganisationFactory(DjangoModelFactory):
    class Meta:
        model = 'marketing.Organisation'  # Adjust to your app_label.ModelName

    name = factory.Faker("company")
    website = factory.Faker("url")
    contact_details = factory.Faker("phone_number")
    industry_type = factory.Faker("company_suffix")
    location = factory.Faker("city")
    created_by = factory.SubFactory(UserFactory)
    email = factory.Faker("email")  # Use correct Faker format
    founded_date = factory.Faker("date")
    number_of_employees = factory.Faker("random_int", min=1, max=500)
    annual_revenue = factory.Faker("pydecimal", left_digits=10, right_digits=2, positive=True)

class AttachmentFactory(DjangoModelFactory):
    class Meta:
        model = Attachment

    content_type = factory.LazyAttribute(lambda o: ContentType.objects.get_for_model(o.content_object))
    object_id = factory.SelfAttribute("content_object.pk")
    attachment_file = factory.django.FileField(filename="sampledatapdf.pdf")
    attachment_type = fuzzy.FuzzyChoice([choice[0] for choice in ATTACHMENT_TYPE])

class JobFactory(DjangoModelFactory):
    class Meta:
        model = 'marketing.Job'  # Adjust to your app_label.ModelName

    title = factory.Faker("job")
    description = factory.Faker("text")
    work_location = factory.Faker("random_element", elements=["onsite", "remote"])
    location = factory.Faker("city")
    job_type = factory.Faker("random_element", elements=["full_time", "part_time"])
    eligibility_criteria = factory.Faker("paragraph")
    deadline = factory.Faker("future_datetime", end_date="+30d")
    stipend_salary = factory.Faker("random_element", elements=[None, "1000", "2000", "3000"])
    company = factory.SubFactory(OrganisationFactory)
    status = factory.Faker("random_element", elements=["open", "closed"])
    openings = factory.Faker("random_int", min=1, max=10)
    perks_benefits = factory.Faker("paragraph")

    @factory.post_generation
    def create_attachments(self, create, extracted, **kwargs):
        if not create:
            return
        if extracted:
            for _ in range(extracted):
                AttachmentFactory(content_object=self)
