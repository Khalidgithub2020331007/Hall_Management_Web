from django.urls import path
from .views import ForumListCreateView

urlpatterns = [
    path('forum/', ForumListCreateView.as_view(), name='forum-list-create'),
]
