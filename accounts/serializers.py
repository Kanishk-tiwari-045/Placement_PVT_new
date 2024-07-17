# from rest_framework import serializers
# from rest_framework.authtoken.models import Token

# from django.core.exceptions import ValidationError
# from django.contrib.auth.password_validation import validate_password

# from .models import CustomUser


# class UserLoginSerializer(serializers.ModelSerializer):
#     token = serializers.SerializerMethodField()
#     last_login = serializers.DateTimeField(read_only=True)
#     last_modified = serializers.DateTimeField(read_only=True)

#     class Meta:
#         model = CustomUser
#         fields = ("token", "id", "name", "email", "last_login", "last_modified")
#         extra_kwargs = {"password": {"write_only": True}}

#     @staticmethod
#     def get_token(user):
#         token, created = Token.objects.get_or_create(user=user)
#         return token.key

#     @staticmethod
#     def get_team(self):
#         return self.team


# class UserGetSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = CustomUser
#         exclude = ["password"]


# class UserSignupSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = CustomUser
#         fields = ["email", "name", "phone_number", "password"]
#         extra_kwargs = {"password": {"write_only": True}}

#     def validate_password(self, data):
#         try:
#             validate_password(data)
#         except ValidationError as e:
#             raise serializers.ValidationError({"password": list(e.messages)})
#         return data

#     def create(self, validated_data):
#         validated_data["username"] = validated_data["email"]  # Use email as username
#         user = CustomUser.objects.create_user(
#             email=validated_data["email"],
#             password=validated_data["password"],
#             name=validated_data.get("name", ""),
#             phone_number=validated_data.get("phone_number", ""),
#             username=validated_data["email"],  # Ensure username is set
#         )
#         return user


from rest_framework import serializers
from django.core.exceptions import ValidationError
from rest_framework.authtoken.models import Token
from django.contrib.auth.password_validation import validate_password
from .models import CustomUser

class UserLoginSerializer(serializers.ModelSerializer):
    token = serializers.SerializerMethodField()
    last_login = serializers.DateTimeField(read_only=True)
    last_modified = serializers.DateTimeField(read_only=True)

    class Meta:
        model = CustomUser
        fields = ("token", "id", "name", "email", "last_login", "last_modified")
        extra_kwargs = {"password": {"write_only": True}}

    @staticmethod
    def get_token(user):
        token, created = Token.objects.get_or_create(user=user)
        return token.key

    @staticmethod
    def get_team(self):
        return self.team

class UserGetSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        exclude = ["password"]

class UserSignupSerializer(serializers.ModelSerializer):
    isOrg = serializers.BooleanField(default=False)

    class Meta:
        model = CustomUser
        fields = ["email", "name", "phone_number", "password", "isOrg"]
        extra_kwargs = {"password": {"write_only": True}}

    def validate_password(self, data):
        try:
            validate_password(data)
        except ValidationError as e:
            raise serializers.ValidationError({"password": list(e.messages)})
        return data

    def create(self, validated_data):
        validated_data["username"] = validated_data["email"]  # Use email as username
        user = CustomUser.objects.create_user(
            email=validated_data["email"],
            password=validated_data["password"],
            name=validated_data.get("name", ""),
            phone_number=validated_data.get("phone_number", ""),
            username=validated_data["email"],  # Ensure username is set
            isOrg=validated_data.get("isOrg", False)  # Set isOrg based on the checkbox
        )
        return user