from rest_framework import serializers
from halls_and_rooms.models import *


# =======================
# HALL SERIALIZER
# =======================
class HallSerializer(serializers.ModelSerializer):
    vacant_seats = serializers.SerializerMethodField()
    room_list = serializers.SerializerMethodField()

    class Meta:
        model = Hall
        fields = [
            'hall_id', 'hall_name', 'total_room',
            'total_number_of_seat', 'admitted_students',
            'vacant_seats', 'image', 'room_list'
        ]

    def get_vacant_seats(self, obj):
        return obj.total_number_of_seat - obj.admitted_students

    def get_room_list(self, obj):
        return [room.room_number for room in obj.rooms.all()]

    def validate_hall_name(self, value):
        # Perform case-insensitive uniqueness check
        qs = Hall.objects.filter(hall_name__iexact=value)
        if self.instance:  # If updating, exclude self
            qs = qs.exclude(pk=self.instance.pk)
        if qs.exists():
            raise serializers.ValidationError("A hall with this name already exists.")
        return value
    
    
# =======================
# ROOM SERIALIZER
# =======================
class RoomSerializer(serializers.ModelSerializer):
    hall = serializers.PrimaryKeyRelatedField(queryset=Hall.objects.all())
    student_list = serializers.SerializerMethodField()
    vacancy = serializers.SerializerMethodField()

    class Meta:
        model = Room
        fields = [
            'room_id', 'room_number', 'hall',
            'capacity', 'admitted_students',
            'vacancy', 'student_list'
        ]

    def validate(self, attrs):
        hall = attrs.get('hall')
        room_number = attrs.get('room_number')

        if not self.instance:
            if Room.objects.filter(room_number=room_number, hall=hall).exists():
                raise serializers.ValidationError(
                    f"Room number {room_number} already exists in this hall."
                )
        elif self.instance.room_number != room_number or self.instance.hall != hall:
            if Room.objects.filter(room_number=room_number, hall=hall).exists():
                raise serializers.ValidationError(
                    f"Room number {room_number} already exists in this hall."
                )

        return attrs


    def get_student_list(self, obj):
        return [student.registration_number for student in obj.student_set.order_by('registration_number')]
    

    def get_vacancy(self, obj):
        return obj.capacity - obj.admitted_students
