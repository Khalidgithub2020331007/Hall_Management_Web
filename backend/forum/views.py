from rest_framework import generics
from .models import Forum
from .serializers import ForumSerializer
from rest_framework.permissions import IsAuthenticated

class ForumListCreateView(generics.ListCreateAPIView):
    queryset = Forum.objects.all().order_by('-post_date_time')
    serializer_class = ForumSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(user_email=self.request.user.userinformation)
