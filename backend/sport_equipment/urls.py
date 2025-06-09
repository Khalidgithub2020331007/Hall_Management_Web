from django.urls import path, include
from rest_framework.routers import DefaultRouter

from .views import *

# Initialize the router for automatic route handling
router = DefaultRouter()
router.register('sports_equipment', SportsEquipmentViewSet, basename='sports_equipment')



# Define URL patterns
urlpatterns = [
    path('', include(router.urls)),    # Include all router-generated routes
]  # End of urlpatterns


# http://127.0.0.1:8000/sport_equipment/sportsequipment/
