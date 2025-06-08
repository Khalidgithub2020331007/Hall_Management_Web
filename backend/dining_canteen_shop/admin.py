from django.contrib import admin
from .models import *
from halls_and_rooms.models import *
from user_info.models import *
from official.models import *
from student_admission.models import *

@admin.register(HallOutlet)
class HallOutletAdmin(admin.ModelAdmin):
    list_display = ('owner', 'owner_name', 'hall', 'is_active', 'get_role')
    search_fields = ('owner__name', 'owner__official_role', 'owner__hall__name')
    list_filter = ('is_active',)

    readonly_fields = (
        'rating',
        'feedback',
        'breakfast_items',
        'lunch_items',
        'dinner_items',
        'shop_items'
    )

    def owner_name(self, obj):
        return obj.owner.name
    owner_name.short_description = 'Owner Name'

    def hall(self, obj):
        return obj.owner.hall.name if obj.owner.hall else '-'
    hall.short_description = 'Hall Name'

    def get_role(self, obj):
        return obj.owner.official_role
    get_role.short_description = 'Role'


@admin.register(AddItem)
class AddItemAdmin(admin.ModelAdmin):
    list_display = ('item', 'owner_name', 'hall', 'meal_time', 'price')
    search_fields = ('item', 'owner__name', 'owner__hall__name')
    list_filter = ('meal_time',) 
    autocomplete_fields = ('owner',)

    def hall(self, obj):
        return obj.owner.hall.name
    hall.short_description = 'Hall Name'

    def owner_name(self, obj):
        return obj.owner.name
    owner_name.short_description = 'Owner Name'


@admin.register(Feedback)
class FeedbackAdmin(admin.ModelAdmin):
    list_display = ('item', 'owner_name', 'hall', 'user', 'rating', 'short_review')
    search_fields = ('item__item', 'user__name', 'item__owner__name', 'item__owner__hall__name', 'review')
    list_filter = ('rating',)
    autocomplete_fields = ('item', 'user')

    def short_review(self, obj):
        return f'{obj.review[:75]}...' if len(obj.review) > 75 else obj.review
    short_review.short_description = 'Review'

    def hall(self, obj):
        return obj.item.owner.hall.name if obj.item.owner.hall else '-'
    hall.short_description = 'Hall Name'

    def owner_name(self, obj):
        return obj.item.owner.name
    owner_name.short_description = 'Owner Name'
