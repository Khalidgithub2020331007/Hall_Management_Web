# ========================
# Halls and Rooms urls.py
# =====================

from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import *

router = DefaultRouter()
router.register('hall', HallViewSet, basename='hall')
router.register('room', RoomViewSet, basename='room')


urlpatterns = [
    path('', include(router.urls)),   
]  



# http://127.0.0.1:8000/halls_and_rooms/hall/
# http://127.0.0.1:8000/halls_and_rooms/room/
