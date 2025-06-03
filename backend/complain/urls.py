# =================
# Complain urls.py
# =================

from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import Make_ComplaintsViewSet, SystemGoalViewSet

router = DefaultRouter()
router.register(r'make_complaints', Make_ComplaintsViewSet, basename='make_complaints')
router.register(r'system_goal', SystemGoalViewSet, basename='system_goal')

urlpatterns = [
    path('', include(router.urls)),
]
