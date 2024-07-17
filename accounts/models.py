# from rest_framework.authtoken.models import Token

# from django.db import models
# from django.utils.translation import gettext as _
# from django.contrib.auth.models import AbstractUser

# from .managers import CustomUserManager

# # Create your models here.
# class CustomUser(AbstractUser):
#     email = models.EmailField(_("Email Address"), unique=True)
#     name = models.CharField(_("Full Name"), max_length=20, default="Guest")
#     phone_number = models.CharField(_("Contact Number"), max_length=15)

#     username = models.CharField(max_length=150, blank=True, null=True, unique=True)

#     USERNAME_FIELD = "email"
#     REQUIRED_FIELDS = ("username",)

#     objects = CustomUserManager()

#     def __str__(self):
#         return self.email


# class CustomGoogleTokenComposite(models.Model):
#     user = models.OneToOneField(
#         CustomUser, on_delete=models.CASCADE, related_name="google_token"
#     )
#     access_token = models.CharField(max_length=255)
#     created_at = models.DateTimeField(auto_now_add=True)
#     token = models.OneToOneField(
#         Token, on_delete=models.CASCADE, related_name="google_token"
#     )
#     refresh_token = models.CharField(max_length=255, null=True, blank=True)

from rest_framework.authtoken.models import Token

from django.db import models
from django.utils.translation import gettext as _
from django.contrib.auth.models import AbstractUser

from .managers import CustomUserManager

# Create your models here.
class CustomUser(AbstractUser):
    email = models.EmailField(_("Email Address"), unique=True)
    name = models.CharField(_("Full Name"), max_length=20, default="Guest")
    phone_number = models.CharField(_("Contact Number"), max_length=15)
    username = models.CharField(max_length=150, blank=True, null=True, unique=True)
    isOrg = models.BooleanField(default=False)  # New field

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ("username",)

    objects = CustomUserManager()

    def _str_(self):
        return self.email

class CustomGoogleTokenComposite(models.Model):
    user = models.OneToOneField(
        CustomUser, on_delete=models.CASCADE, related_name="google_token"
    )
    access_token = models.CharField(max_length=255)
    created_at = models.DateTimeField(auto_now_add=True)
    token = models.OneToOneField(
        Token, on_delete=models.CASCADE, related_name="google_token"
    )
    refresh_token = models.CharField(max_length=255, null=True, blank=True) 