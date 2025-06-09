# =====================
# Official urls.py
# =====================


from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import *

# Create router and register viewsets
router = DefaultRouter()
router.register(r'official_registration', OfficialRegistrationViewSet, basename='official_registration')
router.register(r'provost-body', ProvostBodyViewSet, basename='provost-body')
router.register(r'official-person', OfficialPersonViewSet, basename='official-person')
router.register(r'dining-canteen-shop', DiningShopCanteenViewSet, basename='dining-canteen-shop')

# Define URL patterns
urlpatterns = [
    path('', include(router.urls)),  # REST framework routes
]



# http://127.0.0.1:8000/official/officialregistration/
# http://127.0.0.1:8000/official/dining_shop_canteen/
# http://127.0.0.1:8000/official/officialperson/
# http://127.0.0.1:8000/admin/official/provostbody/

