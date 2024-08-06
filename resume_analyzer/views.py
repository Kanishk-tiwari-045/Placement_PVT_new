# # from django.shortcuts import render

# # Create your views here.
# import os
# import fitz  # PyMuPDF
# from rest_framework.views import APIView
# from rest_framework.response import Response
# from rest_framework.parsers import MultiPartParser, FormParser
# from rest_framework import status
# from .serializers import FileUploadSerializer
# from sentence_transformers import SentenceTransformer
# from sklearn.metrics.pairwise import cosine_similarity
# import numpy as np
# import nltk
# from nltk.corpus import stopwords
# from sklearn.feature_extraction.text import TfidfVectorizer

# # Download NLTK data
# nltk.download('stopwords')
# nltk.download('punkt')

# # Load the pre-trained SBERT model
# model = SentenceTransformer('paraphrase-MiniLM-L6-v2')

# def extract_text_from_pdf(pdf_path):
#     doc = fitz.open(pdf_path)
#     text = ""
#     for page_num in range(len(doc)):
#         page = doc.load_page(page_num)
#         text += page.get_text()
#     return text

# def extract_keywords(text, top_n=10):
#     stop_words = set(stopwords.words('english'))
#     stop_words = list(stop_words)  # Convert set to list
#     vectorizer = TfidfVectorizer(stop_words=stop_words)
#     X = vectorizer.fit_transform([text])
#     tfidf_scores = dict(zip(vectorizer.get_feature_names_out(), X.toarray()[0]))
#     sorted_keywords = sorted(tfidf_scores.items(), key=lambda x: x[1], reverse=True)
#     return [keyword for keyword, score in sorted_keywords[:top_n]]

# def identify_gaps(resume_keywords, job_description_keywords):
#     missing_keywords = [keyword for keyword in job_description_keywords if keyword not in resume_keywords]
#     return missing_keywords

# class FileUploadView(APIView):
#     parser_classes = (MultiPartParser, FormParser)

#     def post(self, request, *args, **kwargs):
#         serializer = FileUploadSerializer(data=request.data)
#         if serializer.is_valid():
#             resume_file = serializer.validated_data['resume']
#             job_description_file = serializer.validated_data['job_description']

#             # Save uploaded files temporarily
#             resume_path = 'temp_resume.pdf'
#             job_description_path = 'temp_job_description.pdf'
#             with open(resume_path, 'wb+') as destination:
#                 for chunk in resume_file.chunks():
#                     destination.write(chunk)
#             with open(job_description_path, 'wb+') as destination:
#                 for chunk in job_description_file.chunks():
#                     destination.write(chunk)

#             # Extract text from PDFs
#             resume_text = extract_text_from_pdf(resume_path)
#             job_description_text = extract_text_from_pdf(job_description_path)

#             # Clean up temp files
#             os.remove(resume_path)
#             os.remove(job_description_path)

#             # Encode the texts
#             resume_embedding = model.encode(resume_text)
#             job_description_embedding = model.encode(job_description_text)

#             # Reshape embeddings to 2D array for sklearn
#             resume_embedding = np.array(resume_embedding).reshape(1, -1)
#             job_description_embedding = np.array(job_description_embedding).reshape(1, -1)

#             # Compute the cosine similarity
#             similarity_score = cosine_similarity(resume_embedding, job_description_embedding)

#             # Extract keywords
#             resume_keywords = extract_keywords(resume_text)
#             job_description_keywords = extract_keywords(job_description_text)

#             # Identify missing keywords
#             missing_keywords = identify_gaps(resume_keywords, job_description_keywords)

#             response_data = {
#                 'similarity_score': similarity_score[0][0],
#                 'resume_keywords': resume_keywords,
#                 'job_description_keywords': job_description_keywords,
#                 'missing_keywords': missing_keywords
#             }

#             return Response(response_data, status=status.HTTP_200_OK)
#         else:
#             return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# import os
# import fitz  # PyMuPDF
# from rest_framework.views import APIView
# from rest_framework.response import Response
# from rest_framework.parsers import MultiPartParser, FormParser
# from rest_framework import status
# from .serializers import FileUploadSerializer
# from sentence_transformers import SentenceTransformer
# from sklearn.metrics.pairwise import cosine_similarity
# import numpy as np
# from nltk.corpus import stopwords
# from sklearn.feature_extraction.text import TfidfVectorizer
# import language_tool_python

# # Load the pre-trained SBERT model
# model = SentenceTransformer('paraphrase-MiniLM-L6-v2')

# # Initialize the grammar checking tool
# tool = language_tool_python.LanguageTool('en-US')

# def extract_text_from_pdf(pdf_path):
#     doc = fitz.open(pdf_path)
#     text = ""
#     for page_num in range(len(doc)):
#         page = doc.load_page(page_num)
#         text += page.get_text()
#     return text

# def extract_keywords(text, top_n=10):
#     stop_words = set(stopwords.words('english'))
#     stop_words = list(stop_words)  # Convert set to list
#     vectorizer = TfidfVectorizer(stop_words=stop_words)
#     X = vectorizer.fit_transform([text])
#     tfidf_scores = dict(zip(vectorizer.get_feature_names_out(), X.toarray()[0]))
#     sorted_keywords = sorted(tfidf_scores.items(), key=lambda x: x[1], reverse=True)
#     return [keyword for keyword, score in sorted_keywords[:top_n]]

# def identify_gaps(resume_keywords, job_description_keywords):
#     missing_keywords = [keyword for keyword in job_description_keywords if keyword not in resume_keywords]
#     return missing_keywords

# def check_grammar(text):
#     matches = tool.check(text)
#     corrections = []
#     for match in matches:
#         corrections.append({
#             'text': match.context,
#             'suggestions': match.replacements,
#             'error': match.message
#         })
#     return corrections

# def analyze_strengths_weaknesses(resume_text, job_description_text):
#     # Placeholder: Add any specific logic to identify strengths and weaknesses
#     # Here we assume strengths as common keywords and weaknesses as missing keywords
#     resume_keywords = extract_keywords(resume_text)
#     job_description_keywords = extract_keywords(job_description_text)
#     common_keywords = [kw for kw in resume_keywords if kw in job_description_keywords]
#     missing_keywords = identify_gaps(resume_keywords, job_description_keywords)
#     return common_keywords, missing_keywords

# class FileUploadView(APIView):
#     parser_classes = (MultiPartParser, FormParser)

#     def post(self, request, *args, **kwargs):
#         serializer = FileUploadSerializer(data=request.data)
#         if serializer.is_valid():
#             resume_file = serializer.validated_data['resume']
#             job_description_file = serializer.validated_data['job_description']

#             # Save uploaded files temporarily
#             resume_path = 'temp_resume.pdf'
#             job_description_path = 'temp_job_description.pdf'
#             with open(resume_path, 'wb+') as destination:
#                 for chunk in resume_file.chunks():
#                     destination.write(chunk)
#             with open(job_description_path, 'wb+') as destination:
#                 for chunk in job_description_file.chunks():
#                     destination.write(chunk)

#             # Extract text from PDFs
#             resume_text = extract_text_from_pdf(resume_path)
#             job_description_text = extract_text_from_pdf(job_description_path)

#             # Clean up temp files
#             os.remove(resume_path)
#             os.remove(job_description_path)

#             # Encode the texts
#             resume_embedding = model.encode(resume_text)
#             job_description_embedding = model.encode(job_description_text)

#             # Reshape embeddings to 2D array for sklearn
#             resume_embedding = np.array(resume_embedding).reshape(1, -1)
#             job_description_embedding = np.array(job_description_embedding).reshape(1, -1)

#             # Compute the cosine similarity
#             similarity_score = cosine_similarity(resume_embedding, job_description_embedding)

#             # Extract keywords
#             resume_keywords = extract_keywords(resume_text)
#             job_description_keywords = extract_keywords(job_description_text)

#             # Identify missing keywords
#             missing_keywords = identify_gaps(resume_keywords, job_description_keywords)

#             # Check grammar
#             grammar_issues = check_grammar(resume_text)

#             # Analyze strengths and weaknesses
#             strengths, weaknesses = analyze_strengths_weaknesses(resume_text, job_description_text)

#             # Suggest improvements
#             improvements = {
#                 'missing_keywords': missing_keywords,
#                 'grammar_issues': grammar_issues,
#             }

#             response_data = {
#                 'similarity_score': similarity_score[0][0],
#                 'resume_keywords': resume_keywords,
#                 'job_description_keywords': job_description_keywords,
#                 'missing_keywords': missing_keywords,
#                 'grammar_issues': grammar_issues,
#                 'strengths': strengths,
#                 'weaknesses': weaknesses,
#                 'improvements': improvements
#             }

#             return Response(response_data, status=status.HTTP_200_OK)
#         else:
#             return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


import os
import fitz  # PyMuPDF
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework import status
from .serializers import FileUploadSerializer
from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np
from nltk.corpus import stopwords
from sklearn.feature_extraction.text import TfidfVectorizer
import language_tool_python

# Load the pre-trained SBERT model
model = SentenceTransformer('paraphrase-MiniLM-L6-v2')

# Initialize the grammar checking tool
tool = language_tool_python.LanguageTool('en-US')

def extract_text_from_pdf(pdf_path):
    doc = fitz.open(pdf_path)
    text = ""
    for page_num in range(len(doc)):
        page = doc.load_page(page_num)
        text += page.get_text()
    return text

def extract_keywords(text, top_n=10):
    stop_words = set(stopwords.words('english'))
    stop_words = list(stop_words)  # Convert set to list
    vectorizer = TfidfVectorizer(stop_words=stop_words)
    X = vectorizer.fit_transform([text])
    tfidf_scores = dict(zip(vectorizer.get_feature_names_out(), X.toarray()[0]))
    sorted_keywords = sorted(tfidf_scores.items(), key=lambda x: x[1], reverse=True)
    return [keyword for keyword, score in sorted_keywords[:top_n]]

def identify_gaps(resume_keywords, job_description_keywords):
    missing_keywords = [keyword for keyword in job_description_keywords if keyword not in resume_keywords]
    return missing_keywords

def check_grammar(text):
    matches = tool.check(text)
    relevant_matches = []
    seen_errors = set()
    
    for match in matches:
        # Check if error message has been seen before
        if match.message not in seen_errors:
            relevant_matches.append({
                'text': match.context,
                'suggestions': match.replacements,
                'error': match.message
            })
            seen_errors.add(match.message)
            
    # Filter only the most relevant issues
    if len(relevant_matches) > 10:
        relevant_matches = relevant_matches[:10]
    
    return relevant_matches

def analyze_strengths_weaknesses(resume_text, job_description_text):
    # Placeholder: Add any specific logic to identify strengths and weaknesses
    # Here we assume strengths as common keywords and weaknesses as missing keywords
    resume_keywords = extract_keywords(resume_text)
    job_description_keywords = extract_keywords(job_description_text)
    common_keywords = [kw for kw in resume_keywords if kw in job_description_keywords]
    missing_keywords = identify_gaps(resume_keywords, job_description_keywords)
    return common_keywords, missing_keywords

class FileUploadView(APIView):
    parser_classes = (MultiPartParser, FormParser)

    def post(self, request, *args, **kwargs):
        serializer = FileUploadSerializer(data=request.data)
        if serializer.is_valid():
            resume_file = serializer.validated_data['resume']
            job_description_file = serializer.validated_data['job_description']

            # Save uploaded files temporarily
            resume_path = 'temp_resume.pdf'
            job_description_path = 'temp_job_description.pdf'
            with open(resume_path, 'wb+') as destination:
                for chunk in resume_file.chunks():
                    destination.write(chunk)
            with open(job_description_path, 'wb+') as destination:
                for chunk in job_description_file.chunks():
                    destination.write(chunk)

            # Extract text from PDFs
            resume_text = extract_text_from_pdf(resume_path)
            job_description_text = extract_text_from_pdf(job_description_path)

            # Clean up temp files
            os.remove(resume_path)
            os.remove(job_description_path)

            # Encode the texts
            resume_embedding = model.encode(resume_text)
            job_description_embedding = model.encode(job_description_text)

            # Reshape embeddings to 2D array for sklearn
            resume_embedding = np.array(resume_embedding).reshape(1, -1)
            job_description_embedding = np.array(job_description_embedding).reshape(1, -1)

            # Compute the cosine similarity
            similarity_score = cosine_similarity(resume_embedding, job_description_embedding)

            # Extract keywords
            resume_keywords = extract_keywords(resume_text)
            job_description_keywords = extract_keywords(job_description_text)

            # Identify missing keywords
            missing_keywords = identify_gaps(resume_keywords, job_description_keywords)

            # Check grammar
            grammar_issues = check_grammar(resume_text)

            # Analyze strengths and weaknesses
            strengths, weaknesses = analyze_strengths_weaknesses(resume_text, job_description_text)

            # Suggest improvements
            # improvements = {
            #     'missing_keywords': missing_keywords,
            #     'grammar_issues': grammar_issues,
            # }

            response_data = {
                'similarity_score': similarity_score[0][0],
                'resume_keywords': resume_keywords,
                'job_description_keywords': job_description_keywords,
                'missing_keywords': missing_keywords,
                'grammar_issues': grammar_issues,
                'strengths': strengths,
                'weaknesses': weaknesses,
                # 'improvements': improvements
            }

            return Response(response_data, status=status.HTTP_200_OK)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
