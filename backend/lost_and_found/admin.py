from django.contrib import admin
<<<<<<< HEAD

# Register your models here.
=======
from .models import LostAndFound

@admin.register(LostAndFound)
class LostAndFoundAdmin(admin.ModelAdmin):
    list_display = (
        'element_name',
        'post_date_time',
        'user_email',
        'user_name',
        'contact_number',
        'hall'
    )
    search_fields = (
        'element_name',
        'element_description_location',
        'user_email__email',
        'user_email__name',
        'user_email__hall__hall_name',
    )
    list_filter = ('post_date_time',)
    readonly_fields = ('post_date_time',)
    ordering = ('-post_date_time',)

    def user_name(self, obj):
        return obj.user_email.name
    user_name.short_description = 'User Name'

    def hall(self, obj):
        return obj.user_email.hall
    hall.short_description = 'Hall'
>>>>>>> develop_khalid
