from django.urls import path
from .views import EventListCreateView

urlpatterns = [
    path('events/', EventListCreateView.as_view(), name='event-list-create'),
]
