from rest_framework import generics
from .models import NoticeBoard
from .serializers import NoticeBoardSerializer

class NoticeBoardListCreateAPIView(generics.ListCreateAPIView):
    queryset = NoticeBoard.objects.filter().order_by('-notice_data_and_time')
    serializer_class = NoticeBoardSerializer

class NoticeBoardRetrieveUpdateDestroyAPIView(generics.RetrieveUpdateDestroyAPIView):
    queryset = NoticeBoard.objects.all()
    serializer_class = NoticeBoardSerializer
