from django.apps import AppConfig
import nltk



class ResumeAnalyzerConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "resume_analyzer"

    def ready(self):
        # Download NLTK data
        nltk.download('stopwords')
        nltk.download('punkt')