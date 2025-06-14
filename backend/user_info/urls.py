# =====================
# user_info/urls.py
# =====================

from django.urls import path, include
from rest_framework.routers import DefaultRouter

from .views import *

router = DefaultRouter()
router.register('userinformation', UserInformationViewSet, basename='userinformation')  # ❌ Removed trailing slash

urlpatterns = [
    path('', include(router.urls)),  
]

# http://127.0.0.1:8000/user_info/userinformation/
