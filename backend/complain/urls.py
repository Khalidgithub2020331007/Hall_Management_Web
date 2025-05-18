from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ComplainViewSet,SystemGoalViewSet

router = DefaultRouter()
router.register('complain', ComplainViewSet, basename='complain')
router.register('systemgoal', SystemGoalViewSet, basename='systemgoal')

urlpatterns = [
    path('', include(router.urls)),
]
