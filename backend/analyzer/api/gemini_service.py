import google.generativeai as genai
from django.conf import settings

genai.configure(api_key=settings.GEMINI_API_KEY)
model=genai.GenerativeModel('gemini-2.5-flash')

print("API KEY:", settings.GEMINI_API_KEY)

def analyze_resume(resume_text,job_description):
    prompt = f"""
    You are a professional resume reviewer.

    Analyze this resume according to the job description and return JSON:

    {{
      "score": number,
      "strengths": [],
      "weaknesses": [],
      "suggestions": [],
      "ats_tips": []
    }}

    Resume:
    {resume_text}
    Job Description:
    {job_description}
    """
     
    response = model.generate_content(prompt)
    return response.text