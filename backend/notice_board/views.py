from rest_framework import generics
from .models import Notices
from .serializers import NoticesSerializer

class NoticesListCreateAPIView(generics.ListCreateAPIView):
    queryset = Notices.objects.filter().order_by('-notice_data_and_time')
    serializer_class = NoticesSerializer

class NoticeBoardRetrieveUpdateDestroyAPIView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Notices.objects.all()
    serializer_class = NoticesSerializer
