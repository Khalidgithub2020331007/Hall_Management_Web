from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CreateMeetingViewSet, AddTopicViewSet

router = DefaultRouter()
router.register('meetings', CreateMeetingViewSet)
router.register('topics', AddTopicViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
