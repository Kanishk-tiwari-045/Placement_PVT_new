from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.responses import JSONResponse
import os
import google.generativeai as genai
from dotenv import load_dotenv
import base64
import pdf2image
import io

load_dotenv()
app = FastAPI()

# Configure the Maker Suit Google API from https://makersuite.google.com/app/apikey
genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))

def get_gemini_response(input_text, resume_pdf_content, job_description_pdf_content, prompt):
    try:
        model = genai.GenerativeModel('gemini-1.0-pro-latest')
        response = model.generate_content([input_text, resume_pdf_content[0], job_description_pdf_content[0], prompt])
        return response.text
    except Exception as e:
        return str(e)

def pdf_setup(file_content):
    try:
        images = pdf2image.convert_from_bytes(file_content)

        pdf_parts = []
        for i, image in enumerate(images):
            img_byte_array = io.BytesIO()
            image.save(img_byte_array, format='JPEG')
            img_byte_array = img_byte_array.getvalue()

            pdf_parts.append({
                "index": i,
                "mime_type": "image/jpeg",
                "data": base64.b64encode(img_byte_array).decode()  
            })
        return pdf_parts
    except Exception as e:
        return f"Error processing PDF file: {e}"

def analyze_resume_and_job_description(resume_content, job_description_content, job_description_filename, prompt):
    try:
        resume_pdf_content = pdf_setup(resume_content)
        job_description_pdf_content = pdf_setup(job_description_content)

        if not resume_pdf_content or not job_description_pdf_content:
            return "Error processing resume or job description PDF."

        response = get_gemini_response(prompt, resume_pdf_content, job_description_pdf_content, prompt)
        return response 
    except Exception as e:
        return str(e)

@app.post('/analyze-resume-and-job-description')
async def analyze_resume_and_job_description_api(
    resume: UploadFile = File(...),
    job_description: UploadFile = File(...)
):
    if not resume or not job_description:
        raise HTTPException(status_code=400, detail="Please provide both resume and job_description files.")

    FIXED_PROMPT = "analyze me these resumes with this job descriptions and tell me how much percentage my resume match with job description where they lack according to my job description and what can i improve in my resume."

    resume_content = await resume.read()
    job_description_content = await job_description.read()

    response = analyze_resume_and_job_description(resume_content, job_description_content, job_description.filename, FIXED_PROMPT)
    return JSONResponse(content={'response': response})

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)