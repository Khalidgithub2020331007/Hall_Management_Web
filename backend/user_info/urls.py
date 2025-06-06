# =====================
# user_info/urls.py
# =====================

from django.urls import path, include
from rest_framework.routers import DefaultRouter

from .views import *
router = DefaultRouter()

router.register('user-info', UserInformationViewSet, basename='userinformation')

# Define URL patterns
urlpatterns = [
    path('', include(router.urls)),  
]
