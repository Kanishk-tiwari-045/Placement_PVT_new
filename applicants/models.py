from datetime import datetime

from django.db import models
from django.utils import timezone
from django.contrib.contenttypes.fields import GenericRelation

from marketing.models import Job
from attachments.models import Attachment
from accounts.models import CustomUser
from marketing.models import Organisation

# Create your models here.

STATUS_CHOICES = (
    ("applied", "Applied"),
    ("shortlisted", "Shortlisted"),
    ("rejected", "Rejected"),
)

YEAR_CHOICES = (
    ("First", "First"),
    ("Second", "Second"),
    ("Third", "Third"),
    ("Fourth", "Fourth"),
)


class Skill(models.Model):
    name = models.CharField(max_length=100)

    def _str_(self):
        return self.name


class Applicant(models.Model):
    name = models.CharField(max_length=20, default="Guest")
    email = models.EmailField(unique=True)
    phone_number = models.CharField(max_length=15)

    def _str_(self):
        return self.name


class ApplicantProfile(models.Model):
    applicant = models.OneToOneField(
        CustomUser, on_delete=models.CASCADE, related_name="profile"
    )
    highest_qualification = models.CharField(max_length=100)
    stream = models.CharField(max_length=100)
    year = models.CharField(max_length=10, choices=YEAR_CHOICES)
    education_status_choices = (
        ("Finished", "Finished"),
        ("Pursuing", "Pursuing"),
    )
    education_status = models.CharField(max_length=10, choices=education_status_choices)
    passing_year = models.IntegerField(null=True, blank=True)
    cgpa = models.DecimalField(max_digits=4, decimal_places=2)
    skills = models.ManyToManyField("Skill", related_name="students")
    address = models.TextField(default="NA")
    city = models.CharField(max_length=100, default="NA")
    state = models.CharField(max_length=100, default="NA")
    pincode = models.CharField(max_length=6, default="NA")
    attachments = GenericRelation(Attachment)

    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(auto_now=True)

    @property
    def resume(self):
        # Fetch the resume attachment
        return self.attachments.filter(attachment_type="resume").first()

    @property
    def certificates(self):
        # Fetch the certificates attachments
        return self.attachments.filter(attachment_type="certificates")

    def _str_(self):
        return self.applicant.name


class Application(models.Model):
    applicant = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    applicant_profile = models.ForeignKey(ApplicantProfile, on_delete=models.CASCADE)
    job = models.ForeignKey(Job, on_delete=models.CASCADE)
    application_date = models.DateTimeField(auto_now_add=True)
    stage = models.IntegerField(default=1)
    answers_to_ques = models.JSONField(blank=True, null=True)
    status = models.CharField(max_length=12, choices=STATUS_CHOICES, default="applied")

    def _str_(self):
        return self.student.name