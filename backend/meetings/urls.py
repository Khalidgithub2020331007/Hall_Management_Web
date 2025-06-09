from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CreateMeetingViewSet, AddTopicViewSet

router = DefaultRouter()
router.register('meetings', CreateMeetingViewSet)
router.register('topics', AddTopicViewSet)

urlpatterns = [
    path('', include(router.urls)),
]



# http://127.0.0.1:8000/meetings/addtopic/
# http://127.0.0.1:8000/meetings/createmeeting/
