# =================
# events urls.py
# =================

from django.urls import path
from .views import EventListCreateView

urlpatterns = [
    path('create_events/', EventListCreateView.as_view(), name='event-list-create'),
]



# http://127.0.0.1:8000/events/create_event/

