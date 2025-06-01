from django.urls import path
from .views import (
    HallOutletListCreateView, HallOutletDetailView,
    AddItemListCreateView, AddItemDetailView,
    FeedbackListCreateView, FeedbackDetailView
)

urlpatterns = [
    path('hall-outlets/', HallOutletListCreateView.as_view(), name='hall-outlet-list-create'),
    path('hall-outlets/<int:pk>/', HallOutletDetailView.as_view(), name='hall-outlet-detail'),

    path('items/', AddItemListCreateView.as_view(), name='item-list-create'),
    path('items/<int:pk>/', AddItemDetailView.as_view(), name='item-detail'),

    path('feedbacks/', FeedbackListCreateView.as_view(), name='feedback-list-create'),
    path('feedbacks/<int:pk>/', FeedbackDetailView.as_view(), name='feedback-detail'),
]
