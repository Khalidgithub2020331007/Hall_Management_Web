
from django.contrib import admin
from .models import CreateMeeting, AddTopic


@admin.register(CreateMeeting)
class CreateMeetingAdmin(admin.ModelAdmin):
    list_display = (
        'meeting_id',
        'meeting_date_time',
        'meeting_chairperson',
        'meeting_description',
        'next_meeting_date_time',
        'hall'
    )
    list_filter = ('meeting_chairperson',)
    search_fields = ('meeting_description', 'meeting_decision')
    ordering = ('meeting_date_time',)  # Optional
    def hall(self, obj):
        return obj.meeting_chairperson.hall
    hall.short_description = 'Hall'



@admin.register(AddTopic)
class AddTopicAdmin(admin.ModelAdmin):
    list_display = (
        'get_meeting_id',
        'get_meeting_datetime',
        'topic_text',
    )
    search_fields = ('topic_text',)

    def get_meeting_id(self, obj):
        return obj.meeting.meeting_id
    get_meeting_id.short_description = 'Meeting ID'

    def get_meeting_datetime(self, obj):
        return obj.meeting.meeting_date_time
    get_meeting_datetime.short_description = 'Meeting Date & Time'