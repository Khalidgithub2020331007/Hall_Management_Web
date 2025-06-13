from django.urls import path
from .views import NoticesListCreateAPIView, NoticeBoardRetrieveUpdateDestroyAPIView

urlpatterns = [
    path('notices/', NoticesListCreateAPIView.as_view(), name='notice-list-create'),
    path('notices/<int:pk>/', NoticeBoardRetrieveUpdateDestroyAPIView.as_view(), name='notice-detail'),
]

