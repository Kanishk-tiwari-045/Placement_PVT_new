# import requests
# import urllib.parse

# from rest_framework import status
# from rest_framework.views import APIView
# from rest_framework.response import Response
# from rest_framework.authtoken.models import Token

# from django.conf import settings
# from django.utils import timezone
# from django.http import JsonResponse, HttpResponseRedirect
# from django.contrib.auth import authenticate, get_user_model

# from utils.mail import signup_confirmation_email
# from utils.google_auth import get_google_user_info
# from .serializers import UserLoginSerializer, UserSignupSerializer
# from .models import CustomUser, CustomGoogleTokenComposite as CGToken

# # Create your views here.


# User = get_user_model()


# def google_callback(request, *args, **kwargs):
#     # print(request.headers)
#     print(request)
#     print(request.GET.get("code"))
#     token_url = "https://oauth2.googleapis.com/token"
#     code = request.GET.get("code")
#     client_id = settings.GOOGLE_CLIENT_ID
#     client_secret = settings.GOOGLE_CLIENT_SECRET
#     redirect_uri = "http://localhost:8000/admin/google/callback"
#     data = {
#         "code": code,
#         "client_id": client_id,
#         "client_secret": client_secret,
#         "redirect_uri": redirect_uri,
#         "grant_type": "authorization_code",
#     }
#     response = requests.post(token_url, data=data)

#     token_response_data = response.json()
#     print(token_response_data)

#     if "access_token" in token_response_data:
#         access_token = token_response_data["access_token"]
#         user_info = get_google_user_info(access_token)

#         email = user_info.get("email")
#         if not email:
#             return JsonResponse(
#                 {"error": "Failed to retrieve email from Google"}, status=400
#             )

#         user, created = User.objects.get_or_create(email=email)
#         if created:
#             user.username = user_info.get("email")
#             user.set_unusable_password()
#             user.name = user_info.get("name")
#             user.save()

#         token, _ = Token.objects.get_or_create(user=user)

#         if token:
#             cg_token, _ = CGToken.objects.get_or_create(user=user, token=token)
#             if cg_token:
#                 cg_token.access_token = access_token
#                 try:
#                     cg_token.refresh_token = token_response_data["refresh_token"]
#                 except:
#                     pass

#                 cg_token.token = token
#                 cg_token.save()
        
#             user = User.objects.get(email=email)
#             serial_user = UserLoginSerializer(user)
#             response_data = serial_user.data
#             return JsonResponse(response_data, status=status.HTTP_200_OK)

#         return JsonResponse({"error": "Failed to fetch user"}, status=400)
#     else:
#         return JsonResponse({"error": "Failed to retrieve access token"}, status=400)


# class GoogleLogin(APIView):
#     def get(self, request, *args, **kwargs):
#         google_auth_endpoint = "https://accounts.google.com/o/oauth2/auth"
#         redirect_uri = "http://localhost:8000/admin/google/callback"
#         client_id = settings.GOOGLE_CLIENT_ID
#         SCOPES = "https://www.googleapis.com/auth/drive.metadata.readonly https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email"
#         # state = "random_string_for_csrf_protection"

#         params = {
#             "response_type": "code",
#             "client_id": client_id,
#             "redirect_uri": redirect_uri,
#             "scope": SCOPES,
#             # "state": state,
#             "access_type": "offline",
#             "prompt": "consent",
#         }
        
#         url = f"{google_auth_endpoint}?{urllib.parse.urlencode(params)}"
#         return HttpResponseRedirect(url)

# class LoginAPIView(APIView):
#     def post(self, request):
#         email = request.data.get("email")

#         if not email:
#             return Response(
#                 {"error": "email required"}, status=status.HTTP_400_BAD_REQUEST
#             )

#         usr = CustomUser.objects.filter(email=email).first()
#         if not usr:
#             return Response(
#                 {"error": "No user with following email"},
#                 status=status.HTTP_400_BAD_REQUEST,
#             )

#         try:
#             user = authenticate(
#                 email=usr.email, password=request.data.get("password").strip()
#             )
#             if user:
#                 user.last_login = timezone.now()
#                 user.save()

#                 # Serialize user data
#                 serializer = UserLoginSerializer(user)
#                 response_data = serializer.data
#                 return Response(response_data, status=status.HTTP_200_OK)
#             else:
#                 return Response(
#                     {"error": "Invalid credentials"},
#                     status=status.HTTP_401_UNAUTHORIZED,
#                 )
#         except Exception as e:
#             return Response({"error": e}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


# class SignupAPIView(APIView):
#     def post(self, request):
#         print(request.data)
#         serializer = UserSignupSerializer(data=request.data)
#         if serializer.is_valid():
#             try:
#                 user = serializer.save()
#                 signup_confirmation_email(user.username, user.email)
#                 return Response(
#                     {"message": "User created successfully"},
#                     status=status.HTTP_201_CREATED,
#                 )
#             except Exception as e:
#                 return Response({"error": f"{e}"}, status=status.HTTP_400_BAD_REQUEST)
#         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


import requests
import urllib.parse

from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.authtoken.models import Token

from django.conf import settings
from django.utils import timezone
from django.http import JsonResponse, HttpResponseRedirect
from django.contrib.auth import authenticate, get_user_model

from utils.mail import signup_confirmation_email
from utils.google_auth import get_google_user_info
from .serializers import UserLoginSerializer, UserSignupSerializer
from .models import CustomUser, CustomGoogleTokenComposite as CGToken

# Create your views here.


User = get_user_model()


def google_callback(request, *args, **kwargs):
    # print(request.headers)
    print(request)
    print(request.GET.get("code"))
    token_url = "https://oauth2.googleapis.com/token"
    code = request.GET.get("code")
    client_id = settings.GOOGLE_CLIENT_ID
    client_secret = settings.GOOGLE_CLIENT_SECRET
    redirect_uri = "http://localhost:8000/admin/google/callback"
    data = {
        "code": code,
        "client_id": client_id,
        "client_secret": client_secret,
        "redirect_uri": redirect_uri,
        "grant_type": "authorization_code",
    }
    response = requests.post(token_url, data=data)

    token_response_data = response.json()
    print(token_response_data)

    if "access_token" in token_response_data:
        access_token = token_response_data["access_token"]
        user_info = get_google_user_info(access_token)

        email = user_info.get("email")
        if not email:
            return JsonResponse(
                {"error": "Failed to retrieve email from Google"}, status=400
            )

        user, created = User.objects.get_or_create(email=email)
        if created:
            user.username = user_info.get("email")
            user.set_unusable_password()
            user.name = user_info.get("name")
            user.save()

        token, _ = Token.objects.get_or_create(user=user)

        if token:
            cg_token, _ = CGToken.objects.get_or_create(user=user, token=token)
            if cg_token:
                cg_token.access_token = access_token
                try:
                    cg_token.refresh_token = token_response_data["refresh_token"]
                except:
                    pass

                cg_token.token = token
                cg_token.save()
        
            user = User.objects.get(email=email)
            serial_user = UserLoginSerializer(user)
            response_data = serial_user.data
            return JsonResponse(response_data, status=status.HTTP_200_OK)

        return JsonResponse({"error": "Failed to fetch user"}, status=400)
    else:
        return JsonResponse({"error": "Failed to retrieve access token"}, status=400)


class GoogleLogin(APIView):
    def get(self, request, *args, **kwargs):
        google_auth_endpoint = "https://accounts.google.com/o/oauth2/auth"
        redirect_uri = "http://localhost:8000/admin/google/callback"
        client_id = settings.GOOGLE_CLIENT_ID
        SCOPES = "https://www.googleapis.com/auth/drive.metadata.readonly https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email"
        # state = "random_string_for_csrf_protection"

        params = {
            "response_type": "code",
            "client_id": client_id,
            "redirect_uri": redirect_uri,
            "scope": SCOPES,
            # "state": state,
            "access_type": "offline",
            "prompt": "consent",
        }
        
        url = f"{google_auth_endpoint}?{urllib.parse.urlencode(params)}"
        return HttpResponseRedirect(url)

class LoginAPIView(APIView):
    def post(self, request):
        email = request.data.get("email")

        if not email:
            return Response(
                {"error": "Email required"}, status=status.HTTP_400_BAD_REQUEST
            )

        usr = CustomUser.objects.filter(email=email).first()
        if not usr:
            return Response(
                {"error": "No user with the provided email"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            user = authenticate(
                email=usr.email, password=request.data.get("password").strip()
            )
            if user:
                user.last_login = timezone.now()
                user.save()

                # Serialize user data
                serializer = UserLoginSerializer(user)
                response_data = serializer.data
                response_data['isOrg'] = user.isOrg  # Include isOrg field in response
                return Response(response_data, status=status.HTTP_200_OK)
            else:
                return Response(
                    {"error": "Invalid credentials"},
                    status=status.HTTP_401_UNAUTHORIZED,
                )
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class SignupAPIView(APIView):
    def post(self, request):
        print(request.data)
        serializer = UserSignupSerializer(data=request.data)
        if serializer.is_valid():
            try:
                user = serializer.save()
                signup_confirmation_email(user.username, user.email)
                return Response(
                    {"message": "User created successfully"},
                    status=status.HTTP_201_CREATED,
                )
            except Exception as e:
                return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)