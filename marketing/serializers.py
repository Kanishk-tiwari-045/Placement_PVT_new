from rest_framework import serializers
from .models import Organisation, Job

class OrganisationCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Organisation
        fields = '__all__'
        read_only_fields = ('id','email_verified')

class OrganisationGetSerializer(serializers.ModelSerializer):
    class Meta:
        model = Organisation
        fields = '__all__'

class JobCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Job
        fields=("title",
                "description",
                "work_location",
                "location",
                "job_type",
                "eligibility_criteria",
                "deadline",
                "stipend_salary",
                "company",
                "status",
                "openings",
                "custom_ques",
                "perks_benefits",
                )

class JobGetSerializer(serializers.ModelSerializer):
    class Meta:
        model = Job
        fields = '__all__'