# =============================
# student_admission/views.py
# =============================

from django.shortcuts import render
from .models import *
from .serializers import *
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response

# =====================
# Student ViewSet
# =====================
class StudentViewSet(viewsets.ModelViewSet):
    queryset = Student.objects.all()
    serializer_class = StudentSerializer
    
    @action(detail=False, methods=['get'], url_path='get-registration-by-email')
    def get_registration_by_email(self, request):
        email = request.query_params.get('email')
        if not email:
            return Response({'error': 'Email is required'}, status=400)
        
        try:
            student = Student.objects.get(email=email)
            return Response({'registration_number': student.registration_number})
        except Student.DoesNotExist:
            return Response({'error': 'Student not found'}, status=404)
        except Student.MultipleObjectsReturned:
            return Response({'error': 'Multiple students found with this email'}, status=400)




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
