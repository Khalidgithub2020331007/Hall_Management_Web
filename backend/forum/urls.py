# =================
# forum urls.py
# =================


from django.urls import path
from .views import ForumListCreateView

urlpatterns = [
    path('new_forum_post/', ForumListCreateView.as_view(), name='forum-list-create'),
]




# http://127.0.0.1:8000/forum/new_forum_post/

