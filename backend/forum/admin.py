
# =================
# forum admin.py
# =================

from django.contrib import admin
from .models import New_Forum_Post

@admin.register(New_Forum_Post)
class ForumAdmin(admin.ModelAdmin):
    list_display = ('post_id', 'user_email', 'user_name', 'post_date_time', 'file', 'hall')
    search_fields = ('user_email__email', 'user_email__name', 'post_date_time', 'user_email__hall__name')
    list_filter = ('post_date_time',)
    readonly_fields = ('post_date_time',)

    def hall(self, obj):
        return obj.user_email.hall
    hall.short_description = 'Hall'

    def user_name(self, obj):
        return obj.user_email.name
    user_name.short_description = 'User Name'
