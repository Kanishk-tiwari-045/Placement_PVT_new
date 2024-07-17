# from rest_framework import status
# from rest_framework.views import APIView
# from rest_framework.response import Response
# from rest_framework.permissions import IsAuthenticated
# from rest_framework.authentication import TokenAuthentication
# import pdb
# from .models import *
# from .serializers import *

# from rest_framework import generics

# class ApplicantView(APIView):
#     authentication_classes = (TokenAuthentication,)
#     permission_classes = [IsAuthenticated]

#     serializer_class = ApplicantCreatSerializer
#     querysets = Applicant.objects.all()

#     def post(self, request):
#         data = request.data
#         serial_data = self.serializer_class(data=data)
#         if serial_data.is_valid():
#             serial_data.save()
#             return Response({"data": serial_data.data}, status=status.HTTP_201_CREATED)

#         return Response({"message": "invalid data"}, status=status.HTTP_400_BAD_REQUEST)

#     def get(self, request):
#         data_count = self.querysets.count()
#         params = request.query_params.dict()
#         if params.get("id"):
#             querysets = self.querysets.filter(id=params.get("id"))
#             applicants = ApplicantCreatSerializer(querysets, many=True)
#             return Response(
#                 {"data": applicants.data, "total_count": data_count},
#                 status=status.HTTP_200_OK,
#             )
#         if params.get("name"):
#             querysets = self.querysets.filter(name__contains=params.get("name"))
#             applicants = ApplicantCreatSerializer(querysets, many=True)
#             return Response(
#                 {"data": applicants.data, "total_count": data_count},
#                 status=status.HTTP_200_OK,
#             )

#         # aagr ye application ka manager h ya admin/ superuser h tb hi bass ye niche wala code chalega
#         applicants = ApplicantCreatSerializer(self.querysets, many=True)
#         return Response(
#             {"data": applicants.data, "total_count": data_count},
#             status=status.HTTP_200_OK,
#         )

#     def patch(self, request):
#         data = request.data
#         id = request.query_params.get("id")
#         applicant = Applicant.objects.get(id=id)
#         serial_data = self.serializer_class(applicant, data=data, partial=True)
#         if serial_data.is_valid():
#             serial_data.save()
#             return Response({"data": serial_data.data}, status=status.HTTP_201_CREATED)

#         return Response({"message": "invalid data"}, status=status.HTTP_400_BAD_REQUEST)

# class ApplicantProfileView(APIView):
#     authentication_classes = (TokenAuthentication,)
#     permission_classes = [IsAuthenticated]

#     def post(self, request):
#         serializer = ApplicantProfileCreateSerializer(data=request.data, context={'request': request})
#         if serializer.is_valid():
#             serializer.save(applicant=request.user)
#             return Response({"data": serializer.data}, status=status.HTTP_201_CREATED)
#         return Response({"message": "Invalid data", "errors": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

#     def put(self, request):
#         data = request.data
#         applicant_id = request.query_params.get("applicantId")
#         try:
#             applicant_profile = ApplicantProfile.objects.get(applicant=applicant_id)
#         except ApplicantProfile.DoesNotExist:
#             return Response({"message": "Applicant profile not found"}, status=status.HTTP_404_NOT_FOUND)

#         for key, value in data.items():
#             if key not in ['resume', 'certificates', 'skills'] and hasattr(applicant_profile, key):
#                 setattr(applicant_profile, key, value)

#         if 'resume' in request.FILES:
#             applicant_profile.resume = request.FILES['resume']
#         if 'certificates' in request.FILES:
#             applicant_profile.certificates = request.FILES.getlist('certificates')  # Handle multiple files

#         if 'skills' in data:
#             skills_data = data['skills']
#             skill_ids = [int(skill_id) for skill_id in skills_data]  # Convert skill IDs to integers
#             applicant_profile.skills.set(skill_ids)

#         try:
#             applicant_profile.save()
#             serializer = ApplicantProfileGetSerializer(applicant_profile)
#             return Response({"data": serializer.data}, status=status.HTTP_200_OK)
#         except Exception as e:
#             return Response({"message": str(e)}, status=status.HTTP_400_BAD_REQUEST)

#     def get(self, request):
#         params = request.query_params.dict()
#         if 'id' in params:
#             querysets = ApplicantProfile.objects.filter(id=params['id'])
#         elif 'name' in params:
#             querysets = ApplicantProfile.objects.filter(applicant__name__icontains=params['name'])
#         else:
#             querysets = ApplicantProfile.objects.all()

#         data_count = querysets.count()
#         serializer = ApplicantProfileGetSerializer(querysets, many=True)
#         return Response({"data": serializer.data, "total_count": data_count}, status=status.HTTP_200_OK)


# class ApplicationView(APIView):
#     authentication_classes = (TokenAuthentication,)
#     permission_classes = [IsAuthenticated]

#     serializer_class = ApplicationCreateSerializer
#     querysets = Application.objects.all()

#     #############Application post api##################
#     def post(self, request):
#         data = request.data
#         dup_application = self.querysets.filter(
#             applicant=data.get("applicant"),
#             applicant_profile=data.get("applicant_profile"),
#             job=data.get("job"),
#         )
#         if dup_application:
#             return Response(
#                 {"message": "Application already exists"},
#                 status=status.HTTP_400_BAD_REQUEST,
#             )

#         serial_data = self.serializer_class(data=data)
#         if serial_data.is_valid():
#             serial_data.save()
#             return Response({"data": serial_data.data}, status=status.HTTP_201_CREATED)
#         else:
#             print(serial_data.errors)

#         return Response({"message": "invalid data"}, status=status.HTTP_400_BAD_REQUEST)

#     ########### application get api##############
#     def get(self, request):
#         data_count = self.querysets.count()
#         applicant = request.query_params.get("applicant", None)
#         applicant_profile = request.query_params.get("applicant_profile", None)
#         if applicant:
#             querysets = self.querysets.filter(applicant=applicant)
#             application = ApplicationCreateSerializer(querysets, many=True)
#             return Response(
#                 {"data": application.data, "total_count": data_count},
#                 status=status.HTTP_200_OK,
#             )

#         if applicant_profile:
#             querysets = self.querysets.filter(applicant_profile=applicant_profile)
#             application = ApplicationCreateSerializer(querysets, many=True)
#             return Response(
#                 {"data": application.data, "total_count": data_count},
#                 status=status.HTTP_200_OK,
#             )
#         application = ApplicationCreateSerializer(self.querysets, many=True)
#         return Response(
#             {"data": application.data, "total_count": data_count},
#             status=status.HTTP_200_OK,
#         )
    

# class SkillList(generics.ListCreateAPIView):
#     queryset = Skill.objects.all()
#     serializer_class = SkillSerializer


from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
# from rest_framework.permissions import IsAuthenticated
# from rest_framework.authentication import TokenAuthentication
from rest_framework import generics
from .models import Skill
from django.core.mail import send_mail
from .serializers import SkillSerializer

from .models import *
from .serializers import *

from utils.mail import application_successful
class ApplicantView(APIView):
    # authentication_classes = (TokenAuthentication,)
    # permission_classes = [IsAuthenticated]

    serializer_class = ApplicantCreatSerializer
    querysets = Applicant.objects.all()

    def post(self, request):
        data = request.data
        serial_data = self.serializer_class(data=data)
        if serial_data.is_valid():
            serial_data.save()
            return Response({"data": serial_data.data}, status=status.HTTP_201_CREATED)

        return Response({"message": "invalid data"}, status=status.HTTP_400_BAD_REQUEST)

    def get(self, request):
        data_count = self.querysets.count()
        params = request.query_params.dict()
        if params.get("id"):
            querysets = self.querysets.filter(id=params.get("id"))
            applicants = ApplicantCreatSerializer(querysets, many=True)
            return Response(
                {"data": applicants.data, "total_count": data_count},
                status=status.HTTP_200_OK,
            )
        if params.get("name"):
            querysets = self.querysets.filter(name__contains=params.get("name"))
            applicants = ApplicantCreatSerializer(querysets, many=True)
            return Response(
                {"data": applicants.data, "total_count": data_count},
                status=status.HTTP_200_OK,
            )

        # aagr ye application ka manager h ya admin/ superuser h tb hi bass ye niche wala code chalega
        applicants = ApplicantCreatSerializer(self.querysets, many=True)
        return Response(
            {"data": applicants.data, "total_count": data_count},
            status=status.HTTP_200_OK,
        )

    def patch(self, request):
        data = request.data
        id = request.query_params.get("id")
        applicant = Applicant.objects.get(id=id)
        serial_data = self.serializer_class(applicant, data=data, partial=True)
        if serial_data.is_valid():
            serial_data.save()
            return Response({"data": serial_data.data}, status=status.HTTP_201_CREATED)

        return Response({"message": "invalid data"}, status=status.HTTP_400_BAD_REQUEST)

class ApplicantProfileView(APIView):
    # authentication_classes = (TokenAuthentication,)
    # permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = ApplicantProfileCreateSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            serializer.save()
            return Response({"data": serializer.data}, status=status.HTTP_201_CREATED)
        return Response({"message": "Invalid data", "errors": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request):
        data = request.data
        applicant_id = request.query_params.get("applicantId")
        try:
            applicant_profile = ApplicantProfile.objects.get(applicant=applicant_id)
        except ApplicantProfile.DoesNotExist:
            return Response({"message": "Applicant profile not found"}, status=status.HTTP_404_NOT_FOUND)

        for key, value in data.items():
            if key not in ['resume', 'certificates', 'skills'] and hasattr(applicant_profile, key):
                setattr(applicant_profile, key, value)

        if 'resume' in request.FILES:
            applicant_profile.resume = request.FILES['resume']
        if 'certificates' in request.FILES:
            applicant_profile.certificates = request.FILES.getlist('certificates')  # Handle multiple files

        if 'skills' in data:
            skills_data = data['skills']
            skill_ids = [int(skill_id) for skill_id in skills_data]  # Convert skill IDs to integers
            applicant_profile.skills.set(skill_ids)

        try:
            applicant_profile.save()
            serializer = ApplicantProfileGetSerializer(applicant_profile)
            return Response({"data": serializer.data}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"message": str(e)}, status=status.HTTP_400_BAD_REQUEST)

    def get(self, request):
        params = request.query_params.dict()
        
        if 'id' in params:
            querysets = ApplicantProfile.objects.filter(id=params['id'])
        elif 'name' in params:
            querysets = ApplicantProfile.objects.filter(applicant_name__icontains=params['name'])
        elif 'applicant' in params:
            applicant_id = params['applicant']
            try:
                applicant_profile = ApplicantProfile.objects.get(applicant_id=applicant_id)
                serializer = ApplicantProfileGetSerializer(applicant_profile)
                return Response({"data": serializer.data}, status=status.HTTP_200_OK)
            except ApplicantProfile.DoesNotExist:
                return Response(
                    {"message": "Applicant profile not found"},
                    status=status.HTTP_404_NOT_FOUND,
                )
        else:
            querysets = ApplicantProfile.objects.all()

        data_count = querysets.count()
        serializer = ApplicantProfileGetSerializer(querysets, many=True)
        return Response({"data": serializer.data, "total_count": data_count}, status=status.HTTP_200_OK)


class ApplicationView(APIView):
    # authentication_classes = (TokenAuthentication,)
    # permission_classes = [IsAuthenticated]

    serializer_class = ApplicationCreateSerializer
    querysets = Application.objects.all()

    #############Application post api##################
    def post(self, request):
        data = request.data
        dup_application = self.querysets.filter(
            applicant=data.get("applicant"),
            applicant_profile=data.get("applicant_profile"),
            job=data.get("job"),
        )
        if dup_application:
            return Response(
                {"message": "Application already exists"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        serial_data = self.serializer_class(data=data)
        if serial_data.is_valid():
            # serial_data.save()
            instance=serial_data.save()
            application_successful(instance)
            return Response({"data": serial_data.data}, status=status.HTTP_201_CREATED)
        else:
            print(serial_data.errors)

        return Response({"message": "invalid data"}, status=status.HTTP_400_BAD_REQUEST)

    ########### application get api##############
    def get(self, request):
        data_count = self.querysets.count()
        applicant = request.query_params.get("applicant", None)
        applicant_profile = request.query_params.get("applicant_profile", None)
        job = request.query_params.get("job", None)  # Updated to 'job'

        if applicant:
            querysets = self.querysets.filter(applicant=applicant)
            applications = ApplicationCreateSerializer(querysets, many=True)
            return Response(
                {"data": applications.data, "total_count": data_count},
                status=status.HTTP_200_OK,
            )

        if applicant_profile:
            querysets = self.querysets.filter(applicant_profile=applicant_profile)
            applications = ApplicationCreateSerializer(querysets, many=True)
            return Response(
                {"data": applications.data, "total_count": data_count},
                status=status.HTTP_200_OK,
            )

        if job:
            querysets = self.querysets.filter(job=job)  # Filtering by 'job'
            applications = ApplicationCreateSerializer(querysets, many=True)
            return Response(
                {"data": applications.data, "total_count": data_count},
                status=status.HTTP_200_OK,
            )
        
        if applicant and job:
            querysets = self.querysets.filter(applicant=applicant, job=job)
            applications = ApplicationCreateSerializer(querysets, many=True)
            return Response(
                {"data": applications.data, "total_count": data_count},
                status=status.HTTP_200_OK,
            )

        # Default case: Return all applications
        applications = ApplicationCreateSerializer(self.querysets, many=True)
        return Response(
            {"data": applications.data, "total_count": data_count},
            status=status.HTTP_200_OK,
        )
    
    def patch(self, request, application_id):
        try:
            application = self.querysets.get(id=application_id)
            application.stage = request.data.get('stage', application.stage)
            application.status = request.data.get('status', application.status)
            application.save()

            # Send email if the status is 'Shortlisted'
            if application.status == 'Shortlisted':
                applicant_email = application.applicant.email
                send_mail(
                    'Application Shortlisted',
                    'Congratulations! Your application has been shortlisted.',
                    'kanishktiwari11a@gmail.com',
                    [applicant_email],
                    fail_silently=False,
                )

            return Response(status=status.HTTP_200_OK)
        except Application.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)


class SkillList(generics.ListCreateAPIView):
    queryset = Skill.objects.all()
    serializer_class = SkillSerializer
