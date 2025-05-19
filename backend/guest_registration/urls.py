from django.urls import path, include
from rest_framework.routers import DefaultRouter

from .views import *

# Initialize the router for automatic route handling
router = DefaultRouter()
router.register('guest_registration', GuestRegistrationViewSet, basename='guest_registration')



# Define URL patterns
urlpatterns = [
    path('', include(router.urls)),    # Include all router-generated routes
]  # End of urlpatterns
