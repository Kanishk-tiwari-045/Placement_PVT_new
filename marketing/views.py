# import random
# import smtplib
# import datetime
# from django.conf import settings
# from django.utils import timezone
# from django.core import serializers
# from django.db import IntegrityError
# from django.shortcuts import render, redirect
# from rest_framework.views import APIView
# from rest_framework import status, generics
# from rest_framework.response import Response
# from .models import Organisation, Job
# from .serializers import OrganisationCreateSerializer, OrganisationGetSerializer, JobCreateSerializer, JobGetSerializer
# from .models import *
# from .serializers import *
# from rest_framework.authentication import TokenAuthentication
# from rest_framework.permissions import IsAuthenticated
# from utils.mail import organization_registration_email, job_posted_email
# from utils.pagination import SpecificPagination
# from django.contrib.auth import get_user_model


# def send_otp_email(to_email, otp):
#     subject = 'Your OTP Code'
#     message_body = f'Your OTP code is {otp}'
#     try:
#         server = smtplib.SMTP(settings.EMAIL_HOST, settings.EMAIL_PORT)
#         server.starttls()
#         server.login(settings.EMAIL_HOST_USER, settings.EMAIL_HOST_PASSWORD)
#         message = f'Subject: {subject}\n\n{message_body}'
#         server.sendmail(settings.EMAIL_HOST_USER, to_email, message)
#         server.quit()
#         return True
#     except IntegrityError:
#         raise serializers.ValidationError({"created_by": ["An organization with this creator already exists."]})

# class OrganisationView(generics.ListCreateAPIView):
#     queryset = Organisation.objects.all()
#     serializer_class = OrganisationCreateSerializer

#     def perform_create(self, serializer):
#         organisation = serializer.save()
#         otp = ''.join(random.choices('0123456789', k=6))
#         otp_created_at = timezone.now()
#         self.request.session['organization_id'] = organisation.id
#         self.request.session['otp'] = otp
#         self.request.session['otp_created_at'] = otp_created_at.isoformat()
#         self.request.session['token'] = self.request.auth.key  # Ensure the token is set in the session
#         send_otp_email(organisation.created_by.email, otp)
#         print(f"Session Data Set: organization_id={organisation.id}, otp={otp}, otp_created_at={otp_created_at.isoformat()}, token={self.request.auth.key}")
#         return otp

#     def post(self, request, *args, **kwargs):
#         data = request.data.copy()

#         if Organisation.objects.filter(email=data.get('userEmail')).exists():  # Change to 'userEmail'
#             return Response({"email": ["Organization with this email already exists."]}, status=status.HTTP_400_BAD_REQUEST)

#         required_fields = ['name', 'contact_details', 'industry_type', 'location', 'userEmail']  # Change to 'userEmail'
#         missing_fields = [field for field in required_fields if not data.get(field)]
#         if missing_fields:
#             return Response({field: ["This field is required."] for field in missing_fields}, status=status.HTTP_400_BAD_REQUEST)

#         try:
#             user = get_user_model().objects.get(email=data['userEmail'])  # Change to 'userEmail'
#         except get_user_model().DoesNotExist:
#             return Response({"error": "User with this email does not exist."}, status=status.HTTP_400_BAD_REQUEST)
        
#         data['created_by'] = user.id

#         serializer = self.get_serializer(data=data)
#         if serializer.is_valid():
#             otp = self.perform_create(serializer)
#             return Response({
#                 'message': 'Organization created successfully. Please verify your email.',
#                 'organisation_id': serializer.data['id'],  # Ensure the ID is in the response
#                 'otp': otp,  # Include the OTP in the response
#                 'otp_created_at': self.request.session['otp_created_at'],  # Include OTP creation time
#                 'token': self.request.auth.key,  # Include the token
#             }, status=status.HTTP_201_CREATED)

#         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# class VerifyOTPView(APIView):
#     authentication_classes = [TokenAuthentication]
#     permission_classes = [IsAuthenticated]

#     def post(self, request, *args, **kwargs):
#         userEmail = request.data.get('userEmail')
#         otp = request.data.get('otp')
#         organization_id = request.data.get('organization_id')
#         stored_otp = request.data.get('stored_otp')
#         otp_created_at = request.data.get('otp_created_at')
#         token = request.auth.key
        
#         print(f"userEmail: {userEmail}, otp: {otp}, token: {token}, organization_id: {organization_id}, stored_otp: {stored_otp}, otp_created_at: {otp_created_at}")

#         if not (userEmail and otp and organization_id and stored_otp and otp_created_at and token):
#             return Response({'message': 'Missing or invalid parameters'}, status=status.HTTP_400_BAD_REQUEST)
#         else:
#             try:
#                 organization = Organisation.objects.get(id=organization_id)

#                 organization_registration_email(organization.name, organization.created_by.email)
#                 if otp == stored_otp:
#                     # Check if OTP is within valid time (10 minutes)
#                     if otp_created_at:
#                         otp_created_at = datetime.datetime.fromisoformat(otp_created_at)
#                         if (timezone.now() - otp_created_at) < datetime.timedelta(minutes=10):
#                             organization.email_verified = True
#                             organization.save()
#                             # Set success message in session
#                             request.session['verification_success'] = 'Email verified successfully'
#                             return redirect('create-organisation')
#                         else:
#                             return Response({'message': 'OTP expired'}, status=status.HTTP_400_BAD_REQUEST)
#                     else:
#                         return Response({'message': 'OTP creation time not found'}, status=status.HTTP_400_BAD_REQUEST)
#                 else:
#                     return Response({'message': 'Invalid OTP'}, status=status.HTTP_400_BAD_REQUEST)
                
#             except Organisation.DoesNotExist:
#                 return Response({"message": "Invalid data, Organization not found"}, status=status.HTTP_400_BAD_REQUEST)
# class JobView(APIView):
#     serializer_class = JobCreateSerializer
#     querysets = Job.objects.all()
#     pagination_class = SpecificPagination()


#     def post(self, request):
#         data = request.data
#         serial_data = self.serializer_class(data=data)
#         if serial_data.is_valid():
#             instance=serial_data.save()
#             #  job post mail
#             instance_data = JobGetSerializer(instance).data
#             if instance.company and instance.company.created_by:
#                 job_posted_email(instance_data, instance.company.created_by.email)
#             return Response({"data": serial_data.data}, status=status.HTTP_201_CREATED)

#         return Response({"message": "invalid data"}, status=status.HTTP_400_BAD_REQUEST)

#     def get(self, request):
#         data_count = self.querysets.count()
#         params = request.query_params.dict()
#         querysets = self.querysets


#         if params.get("id"):
#             querysets = self.querysets.filter(id=params.get("id"))
            

#         if params.get("title"):
#             querysets = self.querysets.filter(title__icontains=params.get("title"))
            
        
#         if params.get("company"):
#             querysets = self.querysets.filter(company=params.get("company"))
            

#         if params.get("work_location"):
#             querysets = self.querysets.filter(work_location=params.get("work_location"))
            

#         if params.get("location"):
#             querysets = self.querysets.filter(location=params.get("location"))

#         paginated_response = self.pagination_class.pagination_models(request, querysets, params, JobGetSerializer)
#         if paginated_response is not None:
#             return paginated_response

#         jobs = JobGetSerializer(querysets, many=True).data
#         return Response(
#             {"data": jobs, "total_count": querysets.count()}, status=status.HTTP_200_OK
#         )


import random
import smtplib
import datetime
from django.conf import settings
from django.utils import timezone
from django.core import serializers
from django.db import IntegrityError
from django.db.models import F
from django.shortcuts import render, redirect
from rest_framework.views import APIView
from rest_framework import status, generics
from rest_framework.response import Response
from .models import Organisation, Job
from .serializers import OrganisationCreateSerializer, OrganisationGetSerializer, JobCreateSerializer, JobGetSerializer
from .models import *
from .serializers import *
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from utils.mail import organization_registration_email, job_posted_email
from utils.pagination import SpecificPagination
from django.contrib.auth import get_user_model


def send_otp_email(to_email, otp):
    subject = 'Your OTP Code'
    message_body = f'Your OTP code is {otp}'
    try:
        server = smtplib.SMTP(settings.EMAIL_HOST, settings.EMAIL_PORT)
        server.starttls()
        server.login(settings.EMAIL_HOST_USER, settings.EMAIL_HOST_PASSWORD)
        message = f'Subject: {subject}\n\n{message_body}'
        server.sendmail(settings.EMAIL_HOST_USER, to_email, message)
        server.quit()
        return True
    except IntegrityError:
        raise serializers.ValidationError({"created_by": ["An organization with this creator already exists."]})

class OrganisationView(generics.ListCreateAPIView):
    queryset = Organisation.objects.all()
    serializer_class = OrganisationCreateSerializer

    def perform_create(self, serializer):
        organisation = serializer.save()
        otp = ''.join(random.choices('0123456789', k=6))
        otp_created_at = timezone.now()
        self.request.session['organization_id'] = organisation.id
        self.request.session['otp'] = otp
        self.request.session['otp_created_at'] = otp_created_at.isoformat()
        self.request.session['token'] = self.request.auth.key  # Ensure the token is set in the session
        send_otp_email(organisation.created_by.email, otp)
        print(f"Session Data Set: organization_id={organisation.id}, otp={otp}, otp_created_at={otp_created_at.isoformat()}, token={self.request.auth.key}")
        return otp

    def get_serializer_class(self):
        if self.request.method == 'GET':
            return OrganisationGetSerializer
        return self.serializer_class

    def get_queryset(self):
        user_id = self.request.query_params.get('created_by')
        if user_id:
            return Organisation.objects.filter(created_by=user_id)
        return super().get_queryset()

    def post(self, request, *args, **kwargs):
        data = request.data.copy()

        if Organisation.objects.filter(email=data.get('userEmail')).exists():  # Change to 'userEmail'
            return Response({"email": ["Organization with this email already exists."]}, status=status.HTTP_400_BAD_REQUEST)

        required_fields = ['name', 'contact_details', 'industry_type', 'location', 'userEmail']  # Change to 'userEmail'
        missing_fields = [field for field in required_fields if not data.get(field)]
        if missing_fields:
            return Response({field: ["This field is required."] for field in missing_fields}, status=status.HTTP_400_BAD_REQUEST)

        try:
            user = get_user_model().objects.get(email=data['userEmail'])  # Change to 'userEmail'
        except get_user_model().DoesNotExist:
            return Response({"error": "User with this email does not exist."}, status=status.HTTP_400_BAD_REQUEST)
        
        data['created_by'] = user.id

        serializer = self.get_serializer(data=data)
        if serializer.is_valid():
            otp = self.perform_create(serializer)
            return Response({
                'message': 'Organization created successfully. Please verify your email.',
                'organisation_id': serializer.data['id'],  # Ensure the ID is in the response
                'otp': otp,  # Include the OTP in the response
                'otp_created_at': self.request.session['otp_created_at'],  # Include OTP creation time
                'token': self.request.auth.key,  # Include the token
            }, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class VerifyOTPView(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        userEmail = request.data.get('userEmail')
        otp = request.data.get('otp')
        organization_id = request.data.get('organization_id')
        stored_otp = request.data.get('stored_otp')
        otp_created_at = request.data.get('otp_created_at')
        token = request.auth.key
        
        print(f"userEmail: {userEmail}, otp: {otp}, token: {token}, organization_id: {organization_id}, stored_otp: {stored_otp}, otp_created_at: {otp_created_at}")

        if not (userEmail and otp and organization_id and stored_otp and otp_created_at and token):
            return Response({'message': 'Missing or invalid parameters'}, status=status.HTTP_400_BAD_REQUEST)
        else:
            try:
                organization = Organisation.objects.get(id=organization_id)

                organization_registration_email(organization.name, organization.created_by.email)
                if otp == stored_otp:
                    # Check if OTP is within valid time (10 minutes)
                    if otp_created_at:
                        otp_created_at = datetime.datetime.fromisoformat(otp_created_at)
                        if (timezone.now() - otp_created_at) < datetime.timedelta(minutes=10):
                            organization.email_verified = True
                            organization.save()
                            # Set success message in session
                            request.session['verification_success'] = 'Email verified successfully'
                            return redirect('create-organisation')
                        else:
                            return Response({'message': 'OTP expired'}, status=status.HTTP_400_BAD_REQUEST)
                    else:
                        return Response({'message': 'OTP creation time not found'}, status=status.HTTP_400_BAD_REQUEST)
                else:
                    return Response({'message': 'Invalid OTP'}, status=status.HTTP_400_BAD_REQUEST)
                
            except Organisation.DoesNotExist:
                return Response({"message": "Invalid data, Organization not found"}, status=status.HTTP_400_BAD_REQUEST)
            
class JobView(APIView):
    serializer_class = JobCreateSerializer
    querysets = Job.objects.all().order_by(F('id').desc())
    pagination_class = SpecificPagination()


    def post(self, request):
        data = request.data
        serial_data = self.serializer_class(data=data)
        if serial_data.is_valid():
            instance=serial_data.save()
            #  job post mail
            instance_data = JobGetSerializer(instance).data
            if instance.company and instance.company.created_by:
                job_posted_email(instance_data, instance.company.created_by.email)
            return Response({"data": serial_data.data}, status=status.HTTP_201_CREATED)

        return Response({"message": "invalid data"}, status=status.HTTP_400_BAD_REQUEST)

    def get(self, request):
        data_count = self.querysets.count()
        params = request.query_params.dict()
        querysets = self.querysets


        if params.get("id"):
            querysets = self.querysets.filter(id=params.get("id"))
            

        if params.get("title"):
            querysets = self.querysets.filter(title__icontains=params.get("title"))
            
        
        if params.get("company"):
            querysets = self.querysets.filter(company=params.get("company"))
            

        if params.get("work_location"):
            querysets = self.querysets.filter(work_location=params.get("work_location"))
            

        if params.get("location"):
            querysets = self.querysets.filter(location=params.get("location"))

        paginated_response = self.pagination_class.pagination_models(request, querysets, params, JobGetSerializer)
        if paginated_response is not None:
            return paginated_response

        jobs = JobGetSerializer(querysets, many=True).data
        return Response(
            {"data": jobs, "total_count": querysets.count()}, status=status.HTTP_200_OK
        )