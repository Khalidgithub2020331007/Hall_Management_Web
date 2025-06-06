# =================
# events serializers.py
# =================


from rest_framework import serializers
from .models import Create_Event, AddFile

class AddFileSerializer(serializers.ModelSerializer):
    class Meta:
        model = AddFile
        fields = ['id', 'file']

class CreateEventSerializer(serializers.ModelSerializer):
    files = AddFileSerializer(many=True, read_only=True)  # nested files

    class Meta:
        model = Create_Event
        fields = [
            'event_id',
            'event_name',
            'event_description',
            'event_date_time',
            'event_location',
            'event_publicist_email',
            'event_file',
            'files',
        ]

class CreateEventCreateSerializer(serializers.ModelSerializer):
    # Accept multiple files on creation via a write-only field
    uploaded_files = serializers.ListField(
        child=serializers.FileField(),
        write_only=True,
        required=False
    )

    class Meta:
        model = Create_Event
        fields = [
            'event_name',
            'event_description',
            'event_date_time',
            'event_location',
            'event_publicist_email',
            'uploaded_files',
        ]

    def create(self, validated_data):
        uploaded_files = validated_data.pop('uploaded_files', [])
        event = Create_Event.objects.create(**validated_data)
        for f in uploaded_files:
            AddFile.objects.create(event=event, file=f)
        return event
