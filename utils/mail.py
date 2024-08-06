import os
from django.conf import settings
from django.utils.html import strip_tags

from django.template import Context
from django.template.loader import get_template
from django.template.loader import render_to_string

from django.core.mail import send_mail
from django.core.mail import EmailMultiAlternatives


def organization_registration_email(organization_name, recipient_email):
    subject = 'Organization Registration'
    template_name = 'utils/organization_registered_email.html'
    context = {
        'organization_name': organization_name,
    }
    send_email(subject, template_name, context, [recipient_email])


def job_posted_email(job_data, recipient_email):
    subject = 'New Job Posted'
    template_name = 'utils/job_posted_email.html'
    context = {
        'job_title': job_data.get('title'),
        # 'company_name': job_data.get('company', {}).get('name'),
        'work_location': job_data.get('work_location'),
        'job_type': job_data.get('job_type'),
        'eligibility_criteria': job_data.get('eligibility_criteria'),
        'deadline': job_data.get('deadline'),
        'openings': job_data.get('openings')
    }
    send_email(subject, template_name, context, [recipient_email])

def application_successful(application_instance):
    subject = 'Job Application Successful'
    applicant = application_instance.applicant
    job = application_instance.job

    context = {
        'applicant_name': applicant.name,
        'job_title': job.title,
        'job_description': job.description,
        'work_location':job.work_location,
        'location':job.location,
        'benefits':job.perks_benefits 
    }

    template_name = 'utils/apply_job.html'
    send_email(subject, template_name, context, [applicant.email])

    

def signup_confirmation_email(username, recipient_email):
    subject = 'Signup Confirmation'
    template_name = 'utils/signup_confirmation_email.html'
    context = {
        'username': username,
    }
    send_email(subject, template_name, context, [recipient_email])
    

def send_email(subject, template_name, context, recipient_list):
    html_message = render_to_string(template_name, context)
    plain_message = strip_tags(html_message)
    from_email = os.environ.get('EMAIL_HOST_USER')

    email = EmailMultiAlternatives(subject, plain_message, from_email, recipient_list)
    email.attach_alternative(html_message, "text/html")
    email.send()