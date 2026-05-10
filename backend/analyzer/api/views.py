from django.shortcuts import render
import fitz
from rest_framework.response import Response
from rest_framework.decorators import api_view
from .gemini_service import analyze_resume
import json
# Create your views here.
@api_view(['POST'])
def analyze_resume_api(request):
    resume_file = request.FILES.get("resume")
    job_description = request.data.get("job_description")

    if not resume_file:
        return Response({"error": "No resume provided"}, status=400)

    # ✅ Read based on file type
    if resume_file.name.endswith(".pdf"):
        
        doc = fitz.open(stream=resume_file.read(), filetype="pdf")
        resume_text = "\n".join(page.get_text() for page in doc)
    else:
        resume_text = resume_file.read().decode("utf-8")  # .txt files

    result = analyze_resume(resume_text, job_description)

    try:
        result = result.strip()
        if result.startswith("```json"):
            result = result[7:]
        if result.endswith("```"):
            result = result[:-3]
        parsed = json.loads(result.strip())
    except:
        parsed = {"raw": result}

    return Response(parsed)
