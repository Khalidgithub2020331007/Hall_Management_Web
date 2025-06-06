# Generated by Django 5.2.1 on 2025-06-06 16:05

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Hall',
            fields=[
                ('hall_id', models.AutoField(primary_key=True, serialize=False)),
                ('hall_name', models.CharField(max_length=100)),
                ('total_room', models.PositiveIntegerField()),
                ('total_number_of_seat', models.PositiveIntegerField()),
                ('admitted_students', models.PositiveIntegerField(default=0)),
                ('image', models.ImageField(upload_to='hall_images/')),
                ('room_list', models.JSONField(blank=True, default=list)),
            ],
        ),
        migrations.CreateModel(
            name='Room',
            fields=[
                ('room_id', models.AutoField(primary_key=True, serialize=False)),
                ('room_number', models.CharField(max_length=10)),
                ('capacity', models.PositiveIntegerField()),
                ('admitted_students', models.PositiveIntegerField(default=0)),
                ('student_list', models.JSONField(blank=True, default=list)),
                ('hall', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='rooms', to='halls_and_rooms.hall')),
            ],
        ),
    ]
