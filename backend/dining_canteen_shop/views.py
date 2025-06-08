from rest_framework import generics
from .models import HallOutlet, AddItem, Feedback
from .serializers import HallOutletSerializer, AddItemSerializer, FeedbackSerializer
from rest_framework.permissions import IsAuthenticatedOrReadOnly


# ------------------------------
# HallOutlet Views
# ------------------------------

class HallOutletListCreateView(generics.ListCreateAPIView):
    queryset = HallOutlet.objects.all()
    serializer_class = HallOutletSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]


class HallOutletDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = HallOutlet.objects.all()
    serializer_class = HallOutletSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]


# ------------------------------
# AddItem Views
# ------------------------------

class AddItemListCreateView(generics.ListCreateAPIView):
    queryset = AddItem.objects.all()
    serializer_class = AddItemSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]


class AddItemDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = AddItem.objects.all()
    serializer_class = AddItemSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]


# ------------------------------
# Feedback Views
# ------------------------------

class FeedbackListCreateView(generics.ListCreateAPIView):
    queryset = Feedback.objects.all()
    serializer_class = FeedbackSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]


class FeedbackDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Feedback.objects.all()
    serializer_class = FeedbackSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
