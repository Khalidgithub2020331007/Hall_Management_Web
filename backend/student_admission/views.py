# =============================
# student_admission/views.py
# =============================

from django.shortcuts import render
from .models import *
from .serializers import *
from rest_framework import viewsets, status
from django_filters.rest_framework import DjangoFilterBackend


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
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['registration_number']
    lookup_field = 'applicant__registration_number'  # 👈 Add this


# =====================
# Application ViewSet
# # =====================
class ApplicationViewSet(viewsets.ModelViewSet):
    queryset = Application.objects.all()
    serializer_class = ApplicationSerializer
