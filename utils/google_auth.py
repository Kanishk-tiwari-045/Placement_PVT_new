import os.path
import requests

# import google.oauth2.credentials
# import google_auth_oauthlib.flow
# from google.auth.transport.requests import Request
# from google.oauth2.credentials import Credentials
# from google_auth_oauthlib.flow import InstalledAppFlow
# from googleapiclient.discovery import build
# from googleapiclient.errors import HttpError


SCOPES = [
    "https://www.googleapis.com/auth/drive.metadata.readonly",
    "https://www.googleapis.com/auth/userinfo.profile",
    "https://www.googleapis.com/auth/userinfo.email",
    "openid",
]

def get_google_user_info(access_token):
    user_info_url = "https://www.googleapis.com/oauth2/v1/userinfo"
    params = {"access_token": access_token}
    response = requests.get(user_info_url, params=params)
    return response.json()