# =============================
# student_admission/urls.py
# =============================

from django.urls import path, include
from rest_framework.routers import DefaultRouter

from .views import *
# Initialize the router for automatic route handling
router = DefaultRouter()
router.register('application', ApplicationViewSet, basename='application')
router.register('student', StudentViewSet, basename='student')
router.register('admission', AdmissionViewSet, basename='admission')

urlpatterns = [
    path('', include(router.urls)),   
]

# http://127.0.0.1:8000/student_admission/admission/
# http://127.0.0.1:8000/student_admission/application/
# http://127.0.0.1:8000/student_admission/