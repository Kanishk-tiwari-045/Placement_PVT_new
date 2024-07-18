from rest_framework import serializers
from .models import ApplicantProfile, Skill, Attachment, Application, Applicant
from accounts.serializers import UserGetSerializer

class ApplicantCreatSerializer(serializers.ModelSerializer):
    class Meta:
        model = Applicant
        fields = "__all__"

class SkillSerializer(serializers.ModelSerializer):
    class Meta:
        model = Skill
        fields = "__all__"

    def create(self, validated_data):
        skill_name = validated_data["name"]
        existing_skill = Skill.objects.filter(name=skill_name).first()
        if not existing_skill:
            return Skill.objects.create(**validated_data)
        else:
            return existing_skill

class SkillManytoManySerializer(serializers.PrimaryKeyRelatedField):
    def to_internal_value(self, data):
        try:
            # Check if the skill already exists
            skill = Skill.objects.get(pk=data)
        except Skill.DoesNotExist:
            # If it doesn't exist, create it
            skill = Skill.objects.create(name=data)
        return skill


# class QualificationSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = Qualification
#         fields = "all"


class ApplicantProfileCreateSerializer(serializers.ModelSerializer):
    resume = serializers.FileField(required=False)
    certificates = serializers.ListField(child=serializers.FileField(), required=False)  # Allow multiple files

    class Meta:
        model = ApplicantProfile
        fields = "__all__"

    def create(self, validated_data):
        skills_data = validated_data.pop('skills', [])
        resume = self.context['request'].FILES.get('resume', None)
        certificates = self.context['request'].FILES.getlist('certificates')  # Handle multiple files

        profile = ApplicantProfile.objects.create(**validated_data)
        profile.skills.set(skills_data)

        if resume:
            profile.resume = resume
        if certificates:
            for certificate in certificates:
                profile.certificates.add(certificate)

        profile.save()

        return profile


class ApplicantProfileGetSerializer(serializers.ModelSerializer):
    applicant = UserGetSerializer(read_only=True)

    class Meta:
        model = ApplicantProfile
        fields = "__all__"
        depth = 1

class ApplicationCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Application
        fields = "__all__"
        read_only_fields = ("id",)  # Optionally set fields that should not be updated

    def update(self, instance, validated_data):
        instance.status = validated_data.get('status', instance.status)
        instance.save()
        return instance
    
class ApplicationGetSerializer(serializers.ModelSerializer):
    class Meta:
        model = Application
        fields = "__all__"
        depth = 1