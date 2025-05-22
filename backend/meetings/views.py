from rest_framework import viewsets
from .models import CreateMeeting, AddTopic
from .serializers import CreateMeetingSerializer, AddTopicSerializer
from rest_framework.permissions import IsAuthenticatedOrReadOnly


class CreateMeetingViewSet(viewsets.ModelViewSet):
    queryset = CreateMeeting.objects.all().order_by('-meeting_date_time')
    serializer_class = CreateMeetingSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]


class AddTopicViewSet(viewsets.ModelViewSet):
    queryset = AddTopic.objects.all()
    serializer_class = AddTopicSerializer
