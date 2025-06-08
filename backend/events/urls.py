# =================
# events urls.py
# =================

from django.urls import path
from .views import EventListCreateView

urlpatterns = [
    path('create_events/', EventListCreateView.as_view(), name='event-list-create'),
]
