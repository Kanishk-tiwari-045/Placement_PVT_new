from django.urls import path
from django.urls import include


from applicants.views import (
    ApplicantView as Applicant,
    ApplicationView as Application,
    ApplicantProfileView as ApplicantProfile,
)
from accounts.views import LoginAPIView, SignupAPIView
from attachments.views import Attachment
from marketing.views import OrganisationView as Org, JobView as Job, VerifyOTPView
from applicants import views

from applicants import views
from resume_analyzer.views import FileUploadView


urlpatterns = [
    path("auth/login/", LoginAPIView.as_view(), name="login"),
    path("auth/signup/", SignupAPIView.as_view(), name="signup"),
    path("applicant/", Applicant.as_view(), name="create-applicant"),
    path(
        "applicantprofile/", ApplicantProfile.as_view(), name="create-applicant-profile"
    ),
    path("application/", Application.as_view(), name="create-app"),
    path('applicantprofile/<int:pk>/', ApplicantProfile.as_view(), name='applicant-profile-detail'),
    path("attachment/", Attachment.as_view(), name="create-attachment"),
    path("org/create/", Org.as_view(), name="create-organisation"),
    path("verify-otp/", VerifyOTPView.as_view(), name="verify-otp"),
    path("job/", Job.as_view(), name="create-job"),
    # path('skills/', views.SkillListCreateAPIView.as_view(), name='skill-list-create'),
    # path('applicant-skills/<int:pk>/', views.ApplicantSkillsAPIView.as_view(), name='applicant-skills-update'),
    path('skills/', views.SkillList.as_view(), name='skill-list'),
    path('analyze/', FileUploadView.as_view(), name='file-upload'),
]
