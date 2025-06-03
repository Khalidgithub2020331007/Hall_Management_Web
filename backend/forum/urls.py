# =================
# forum urls.py
# =================


from django.urls import path
from .views import ForumListCreateView

urlpatterns = [
    path('new_forum_post/', ForumListCreateView.as_view(), name='forum-list-create'),
]
