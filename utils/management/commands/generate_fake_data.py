from django.core.management.base import BaseCommand
from marketing.factories import (
    UserFactory,
    OrganisationFactory,
    JobFactory,
    AttachmentFactory,
)
from applicants.factories import ApplicantProfileFactory


class Command(BaseCommand):
    help = "Generates fake data for testing"

    def add_arguments(self, parser):
        parser.add_argument(
            "count", type=int, help="Number of fake data records to create"
        )

    def handle(self, *args, **options):
        count = options["count"]

        for _ in range(count):
            user = UserFactory.create()
            ApplicantProfile = ApplicantProfileFactory.create(applicant=user)
            organisation = OrganisationFactory.create(created_by=user)
            job = JobFactory.create(company=organisation)

            for _ in range(3):
                attachment = AttachmentFactory.create(content_object=job)

        self.stdout.write(
            self.style.SUCCESS(f"Successfully created {count} fake data records")
        )
