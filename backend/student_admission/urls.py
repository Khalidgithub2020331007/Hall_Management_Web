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
