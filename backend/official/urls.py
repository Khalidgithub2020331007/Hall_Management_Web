# =====================
# Official urls.py
# =====================


from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import AddOfficeViewSet, ProvostBodyViewSet, OfficialPersonViewSet

# Create router and register viewsets
router = DefaultRouter()
router.register(r'add-office', AddOfficeViewSet, basename='add-office')
router.register(r'provost-body', ProvostBodyViewSet, basename='provost-body')
router.register(r'official-person', OfficialPersonViewSet, basename='official-person')

# Define URL patterns
urlpatterns = [
    path('', include(router.urls)),  # REST framework routes
]
