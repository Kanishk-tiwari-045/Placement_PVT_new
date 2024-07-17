from rest_framework import serializers
from django.contrib.contenttypes.models import ContentType
from .models import Attachment, ATTACHMENT_TYPE

class AttachmentCreateSerializer(serializers.ModelSerializer):
    content_type = serializers.CharField(write_only=True)

    class Meta:
        model = Attachment
        fields = ("content_type", "object_id", "attachment_file", "attachment_type")

    def validate(self, data):
        content_type = data.get("content_type")
        object_id = data.get("object_id")
        
        if not (content_type and object_id):
            raise serializers.ValidationError("Both content_type and object_id are required.")

        try:
            if content_type.isdigit():
                content_type_obj = ContentType.objects.get(id=int(content_type))
            else:
                content_type_obj = ContentType.objects.get(model=content_type.lower())
            
            model_class = content_type_obj.model_class()
            model_class.objects.get(pk=object_id)

            data['content_type'] = content_type_obj
        except ContentType.DoesNotExist:
            raise serializers.ValidationError("Invalid content_type provided.")
        except model_class.DoesNotExist:
            raise serializers.ValidationError("Object with given ID does not exist.")

        return data

    def create(self, validated_data):
        content_type = validated_data.pop("content_type")
        return Attachment.objects.create(
            content_type=content_type,
            **validated_data,
        )


    