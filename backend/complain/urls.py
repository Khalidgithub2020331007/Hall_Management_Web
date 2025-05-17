from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ComplainViewSet

router = DefaultRouter()
router.register('complain', ComplainViewSet, basename='complain')

urlpatterns = [
    path('', include(router.urls)),
]
