# tests.py

from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from .models import CustomUser


class SignupAPITestCase(APITestCase):
    def test_signup_success(self):
        """
        Test signup API with valid data
        """
        url = reverse("signup")  # Assuming your signup URL name is 'signup'
        data = {
            "email": "test@example.com",
            "name": "Test User",
            "phone_number": "1234567890",
            "password": "testpassword",
        }
        response = self.client.post(url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(CustomUser.objects.count(), 1)
        self.assertEqual(CustomUser.objects.get().email, "test@example.com")

    def test_signup_invalid_data(self):
        """
        Test signup API with invalid data
        """
        url = reverse("signup")
        # Missing required fields
        data = {}
        response = self.client.post(url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(CustomUser.objects.count(), 0)

        # Duplicate email
        CustomUser.objects.create_user(
            email="test@example.com", password="testpassword"
        )
        data = {
            "email": "test@example.com",
            "name": "Test User",
            "phone_number": "1234567890",
            "password": "testpassword",
        }
        response = self.client.post(url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(CustomUser.objects.count(), 1)
