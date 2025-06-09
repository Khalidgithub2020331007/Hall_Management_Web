from django.urls import path
from .views import NoticeBoardListCreateAPIView, NoticeBoardRetrieveUpdateDestroyAPIView

urlpatterns = [
    path('notices/', NoticeBoardListCreateAPIView.as_view(), name='notice-list-create'),
    path('notices/<int:pk>/', NoticeBoardRetrieveUpdateDestroyAPIView.as_view(), name='notice-detail'),
]






# http://127.0.0.1:8000/notice_board/noticeboard/

