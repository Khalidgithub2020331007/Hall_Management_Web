from rest_framework import serializers
from .models import HallOutlet, AddItem, Feedback

class AddItemSerializer(serializers.ModelSerializer):
    owner_name = serializers.CharField(source='owner.name', read_only=True)
    hall_name = serializers.CharField(source='owner.hall.name', read_only=True)
    
    class Meta:
        model = AddItem
        fields = ['id', 'owner', 'owner_name', 'hall_name', 'meal_time', 'item', 'price']

class HallOutletSerializer(serializers.ModelSerializer):
    owner_name = serializers.CharField(source='owner.name', read_only=True)
    hall_name = serializers.CharField(source='owner.hall.name', read_only=True)
    role = serializers.CharField(source='owner.role', read_only=True)

    class Meta:
        model = HallOutlet
        fields = [
            'id', 'owner', 'owner_name', 'hall_name', 'role', 'is_active',
            'breakfast_start', 'breakfast_end',
            'lunch_start', 'lunch_end',
            'dinner_start', 'dinner_end',
            'shop_open_time', 'shop_close_time',
            'rating', 'feedback',
            'shop_items', 'breakfast_items', 'lunch_items', 'dinner_items'
        ]

class FeedbackSerializer(serializers.ModelSerializer):
    user_name = serializers.CharField(source='user.name', read_only=True)
    item_name = serializers.CharField(source='item.item', read_only=True)
    owner_name = serializers.CharField(source='item.owner.name', read_only=True)
    hall_name = serializers.CharField(source='item.owner.hall.name', read_only=True)

    class Meta:
        model = Feedback
        fields = ['id', 'item', 'item_name', 'owner_name', 'hall_name', 'user', 'user_name', 'rating', 'review']
