from rest_framework import serializers

class FileUploadSerializer(serializers.Serializer):
    resume = serializers.FileField()
    job_description = serializers.FileField()
