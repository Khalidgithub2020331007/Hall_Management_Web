# lostandfound/urls.py

from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import LostAndFoundViewSet

router = DefaultRouter()
router.register(r'lost-and-found', LostAndFoundViewSet, basename='lost-and-found')

urlpatterns = [
    path('', include(router.urls)),
]
