from django.urls import path, include
from rest_framework.routers import DefaultRouter

from .views import (
    HallViewSet, RoomViewSet, ApplicationViewSet, StudentViewSet,
    UserInformationViewSet, AdmissionViewSet,
    AddOfficeViewSet, home
)

# Initialize the router for automatic route handling
router = DefaultRouter()
router.register('hall', HallViewSet, basename='hall')
router.register('room', RoomViewSet, basename='room')
router.register('application', ApplicationViewSet, basename='application')
router.register('student', StudentViewSet, basename='student')
router.register('user-info', UserInformationViewSet, basename='userinformation')
router.register('admission', AdmissionViewSet, basename='admission')
router.register('add-office', AddOfficeViewSet, basename='add-office')

# Define URL patterns
urlpatterns = [
    path('home/', home, name='home'),  # Basic home route
    path('', include(router.urls)),    # Include all router-generated routes
]  # End of urlpatterns
