from django.urls import path
from . import views

urlpatterns = [
  path('analyzer/', views.analyze_resume_api, name='analyze-resume'),   
]