# =============================
# student_admission/views.py
# =============================

from django.shortcuts import render
from .models import *
from .serializers import *
from rest_framework import viewsets, status


# =====================
# Student ViewSet
# =====================
class StudentViewSet(viewsets.ModelViewSet):
    queryset = Student.objects.all()
    serializer_class = StudentSerializer




# =====================
# Admission ViewSet
# =====================
class AdmissionViewSet(viewsets.ModelViewSet):
    queryset = Admission.objects.all()
    serializer_class = AdmissionSerializer


# =====================
# Application ViewSet
# # =====================
class ApplicationViewSet(viewsets.ModelViewSet):
    queryset = Application.objects.all()
    serializer_class = ApplicationSerializer
