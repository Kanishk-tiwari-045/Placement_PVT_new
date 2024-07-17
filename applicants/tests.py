# # applicants/tests.py

# from django.urls import reverse
# from rest_framework import status
# from rest_framework.test import APIClient

# from applicants.models import Applicant
# from applicants.serializers import ApplicantCreatSerializer
# import pytest
# from pytest import fixture


# @pytest.fixture
# def api_client():
#     print("////////////")
#     print(APIClient)
#     return APIClient()


# @pytest.mark.django_db
# def test_create_user(api_client):
#     url = reverse("signup")
#     data = {
#         "email": "user2181random@examl.com",
#         "name": "Johny Do",
#         "phone_number": "123-456-7891",
#         "password": "Secure@password",
#     }
#     print("step 1")
#     response = api_client.post(url, data=data, format="json")

#     assert response.status_code == status.HTTP_201_CREATED
#     print("yha tak")
#     serializer = ApplicantCreatSerializer(data=response.data)
#     assert serializer.is_valid()
#     serializer.save()


# # @pytest.mark.django_db
# @pytest.mark.usefixtures
# def test_invalid_applicant_data(api_client):
#     url = reverse("create-applicant")
#     data = {"name": "John Doe"}
#     response = api_client.post(url, data=data, format="json")

#     assert response.status_code == status.HTTP_400_BAD_REQUEST
