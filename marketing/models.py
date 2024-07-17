from django.db import models
from django.contrib.contenttypes.fields import GenericRelation
from accounts.models import CustomUser
from attachments.models import Attachment

STATUS_CHOICES = [
    ("open", "Open"),
    ("closed", "Closed"),
]

LOCATION_TYPE = (
    ("remote", "Remote"),
    ("onsite", "Onsite"),
    ("hybrid", "Hybrid"),
)

JOB_TYPE = (
    ("part_time", "Part Time"),
    ("full_time", "Full Time"),
    ("internship", "Internship"),
)

class Organisation(models.Model):
    name = models.CharField(max_length=100)
    website = models.URLField(blank=True, null=True)
    logo = models.ImageField(upload_to="company_logos/", null=True, blank=True)
    contact_details = models.CharField(max_length=100, unique=True)
    industry_type = models.CharField(max_length=100)
    location = models.CharField(max_length=100)
    created_by = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    email = models.EmailField(unique=True, null=True)
    email_verified = models.BooleanField(default=False)
    founded_date = models.DateField(blank=True, null=True)
    number_of_employees = models.IntegerField(blank=True, null=True)
    annual_revenue = models.DecimalField(max_digits=15, decimal_places=2, blank=True, null=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=['created_by'], name='unique_created_by')
        ]
        
    def __str__(self):
        return self.name

class Job(models.Model):
    title = models.CharField(max_length=100)
    description = models.TextField()
    work_location = models.CharField(
        max_length=10, choices=LOCATION_TYPE, default="onsite"
    )
    location = models.CharField(max_length=100, default="jaipur")
    job_type = models.CharField(max_length=10, choices=JOB_TYPE, default="full_time")
    eligibility_criteria = models.TextField()
    deadline = models.DateTimeField()
    stipend_salary = models.CharField(max_length=100, blank=True, null=True)
    company = models.ForeignKey(Organisation, on_delete=models.CASCADE)
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default="open")
    openings = models.PositiveIntegerField(default=1)
    custom_ques = models.JSONField(blank=True, null=True)
    perks_benefits = models.TextField(blank=True, null=True)
    attachment_o = GenericRelation(Attachment)

    @property
    def attachment_o(self):
        return self.attachment_o.all()


    def __str__(self):
        return self.title
