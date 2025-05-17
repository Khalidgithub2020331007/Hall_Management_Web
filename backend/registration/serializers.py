from django.contrib.auth.hashers import make_password
from rest_framework import serializers
from .models import (
    Hall, Room, Application, Admission, UserInformation,
    Student, ProvostBody, OfficialPerson, AddOffice,
)




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
        return [room.room_number for room in obj.room_set.all()]


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





# =======================
# APPLICATION SERIALIZER
# =======================
class ApplicationSerializer(serializers.ModelSerializer):
    attached_hall = serializers.PrimaryKeyRelatedField(queryset=Hall.objects.all(), allow_null=True)

    class Meta:
        model = Application
        fields = [
            'registration_number', 'name', 'phone_number', 'email', 'blood_group',
            'father_name', 'mother_name', 'gender', 'department_name',
            'study_program', 'session', 'semester', 'premanent_address',
            'home_distance_from_SUST_in_km', 'family_monthly_income',
            'special_reason_for_hall_seat', 'total_credits_offered', 'total_credits_completed',
            'cgpa', 'last_semester_gpa', 'attached_hall', 'is_resident',
            'resident_months_in_university_hall', 'convicted', 'profile_picture'
        ]


# =======================
# USER INFORMATION SERIALIZER
# =======================

class UserInformationSerializer(serializers.ModelSerializer):
    hall = serializers.PrimaryKeyRelatedField(queryset=Hall.objects.all(), allow_null=True)

    class Meta:
        model = UserInformation
        fields = [
            'id', 'email', 'name', 'image',
            'phone_number', 'password', 'role',
            'blood_group', 'hall'
        ]
        extra_kwargs = {
            'password': {'write_only': True}
        }

    def create(self, validated_data):
        password = validated_data.pop('password', None)
        user = UserInformation(**validated_data)
        if password:
            user.set_password(password)  # Handles hashing correctly
        user.save()
        return user




# =======================
# STUDENT SERIALIZER
# =======================
class StudentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Student
        fields = [
            'registration_number', 'email',
            'department', 'semester', 'room_number', 'session'
        ]



# =======================
# ADMISSION SERIALIZER
# =======================
class AdmissionSerializer(serializers.ModelSerializer):
    registration_number = serializers.PrimaryKeyRelatedField(queryset=Application.objects.all())
    room_number = serializers.PrimaryKeyRelatedField(queryset=Room.objects.all())
    hall = serializers.PrimaryKeyRelatedField(queryset=Hall.objects.all())

    class Meta:
        model = Admission
        fields = ['registration_number', 'password', 'room_number', 'hall']

    def validate(self, attrs):
        room = attrs.get('room_number')
        hall = attrs.get('hall')
        if room.admitted_students >= room.capacity:
            raise serializers.ValidationError("This room is already full.")

        if room.hall != hall:
            raise serializers.ValidationError("Selected room does not belong to the selected hall.")
        registration_number = attrs.get('registration_number')
        if Student.objects.filter(registration_number=registration_number.registration_number).exists():
            raise serializers.ValidationError("This student is already admitted.")
        return attrs

    def create(self, validated_data):
        # Use model save method which includes admission logic
        admission = Admission(**validated_data)
        admission.save()
        return admission



# =======================
# PROVOST BODY SERIALIZER
# =======================
class ProvostBodySerializer(serializers.ModelSerializer):

    class Meta:
        model = ProvostBody
        fields = ['email','provost_body_role', 'department', 'department_role']


# =======================
# OFFICIAL PERSON SERIALIZER
# =======================
class OfficialPersonSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = OfficialPerson
        fields = ['email', 'official_role']

# =======================
# ADD OFFICE SERIALIZER
# =======================
class AddOfficeSerializer(serializers.ModelSerializer):
    hall = serializers.PrimaryKeyRelatedField(queryset=Hall.objects.all())

    class Meta:
        model = AddOffice
        fields = [
            'name', 'email', 'phone_number', 'password',
            'user_role', 'blood_group', 'hall',
            'provost_body_role', 'department', 'department_role',
            'official_role', 'profile_picture'
        ]

    def validate(self, attrs):
        role = attrs.get('user_role')
        if role == 'Provost_Body':
            if not attrs.get('provost_body_role') or not attrs.get('department') or not attrs.get('department_role'):
                raise serializers.ValidationError("Provost body role, department, and department role are required.")
        elif role == 'Official_Person':
            if not attrs.get('official_role'):
                raise serializers.ValidationError("Official role is required for Official Person.")
        return attrs

    def create(self, validated_data):
        password = validated_data.pop('password', None)

        # Create AddOffice instance
        add_office_instance = AddOffice.objects.create(**validated_data)

        # Create UserInformation
        user_data = {
            'email': add_office_instance.email,
            'name': add_office_instance.name,
            'image': add_office_instance.profile_picture,
            'phone_number': add_office_instance.phone_number,
            'role': add_office_instance.user_role,
            'blood_group': add_office_instance.blood_group,
            'hall': add_office_instance.hall,
        }
        user = UserInformation(**user_data)
        if password:
            user.set_password(password)
        user.save()

        # Handle role-specific creation
        if add_office_instance.user_role == 'Provost_Body':
            ProvostBody.objects.create(
                email=add_office_instance.email,
                name=add_office_instance.name,
                provost_body_role=add_office_instance.provost_body_role,
                department=add_office_instance.department,
                department_role=add_office_instance.department_role
            )
        elif add_office_instance.user_role == 'Official_Person':
            OfficialPerson.objects.create(
                email=add_office_instance.email,
                name=add_office_instance.name,
                official_role=add_office_instance.official_role
            )

        return add_office_instance


    def update(self, instance, validated_data):
        validated_data.pop('password', None)  # Ignore password here
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        return instance

