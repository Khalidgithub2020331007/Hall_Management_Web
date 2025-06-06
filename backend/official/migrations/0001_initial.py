# Generated by Django 5.2.1 on 2025-06-06 16:05

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('halls_and_rooms', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='AddOffice',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=100)),
                ('email', models.EmailField(max_length=254, unique=True)),
                ('phone_number', models.CharField(max_length=15)),
                ('password', models.CharField(editable=False, max_length=100)),
                ('blood_group', models.CharField(choices=[('A+', 'A positive (A+)'), ('A-', 'A negative (A-)'), ('B+', 'B positive (B+)'), ('B-', 'B negative (B-)'), ('AB+', 'AB positive (AB+)'), ('AB-', 'AB negative (AB-)'), ('O+', 'O positive (O+)'), ('O-', 'O negative (O-)'), ('Others', 'Others')], max_length=100)),
                ('user_role', models.CharField(choices=[('student', 'Student'), ('provost_body', 'Provost Body'), ('official_person', 'Official Person'), ('dining_shop_canteen', 'Dining/Shop/Canteen')], max_length=100)),
                ('provost_body_role', models.CharField(blank=True, choices=[('provost', 'Provost'), ('assistant_provost', 'Assistant Provost')], help_text='Only for Provost Body', max_length=100, null=True)),
                ('department', models.CharField(blank=True, max_length=100, null=True)),
                ('department_role', models.CharField(blank=True, choices=[('professor', 'Professor'), ('associate_professor', 'Associate Professor'), ('assistant_professor', 'Assistant Professor'), ('lecturer', 'Lecturer')], help_text='Only for Provost Body', max_length=100, null=True)),
                ('official_role', models.CharField(blank=True, choices=[('assistant_register', 'Assistant Register'), ('administrative_officer', 'Administrative Officer'), ('accountant', 'Accountant'), ('cleaner', 'Cleaner'), ('electrician', 'Electrician'), ('plumber', 'Plumber'), ('gardener', 'Gardener'), ('office_assistant', 'Office Assistant'), ('office_attendant', 'Office Attendant'), ('guard', 'Guard'), ('senior_assistant', 'Senior Assistant'), ('dining', 'Dining'), ('shop', 'Shop'), ('canteen', 'Canteen'), ('others', 'Others')], default='Assistant Register', help_text='Only for Official Person or Dining/Shop/Canteen', max_length=100, null=True)),
                ('profile_picture', models.ImageField(blank=True, null=True, upload_to='student_profile_pictures/')),
                ('hall', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, to='halls_and_rooms.hall')),
            ],
        ),
        migrations.CreateModel(
            name='Dining_Shop_Canteen',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('email', models.EmailField(max_length=254, unique=True, verbose_name='Official Email')),
                ('name', models.CharField(max_length=100)),
                ('official_role', models.CharField(choices=[('assistant_register', 'Assistant Register'), ('administrative_officer', 'Administrative Officer'), ('accountant', 'Accountant'), ('cleaner', 'Cleaner'), ('electrician', 'Electrician'), ('plumber', 'Plumber'), ('gardener', 'Gardener'), ('office_assistant', 'Office Assistant'), ('office_attendant', 'Office Attendant'), ('guard', 'Guard'), ('senior_assistant', 'Senior Assistant'), ('dining', 'Dining'), ('shop', 'Shop'), ('canteen', 'Canteen'), ('others', 'Others')], default='Electrician', max_length=100)),
                ('hall', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='halls_and_rooms.hall')),
            ],
        ),
        migrations.CreateModel(
            name='OfficialPerson',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('email', models.EmailField(max_length=254, unique=True)),
                ('name', models.CharField(default='', max_length=100)),
                ('official_role', models.CharField(choices=[('assistant_register', 'Assistant Register'), ('administrative_officer', 'Administrative Officer'), ('accountant', 'Accountant'), ('cleaner', 'Cleaner'), ('electrician', 'Electrician'), ('plumber', 'Plumber'), ('gardener', 'Gardener'), ('office_assistant', 'Office Assistant'), ('office_attendant', 'Office Attendant'), ('guard', 'Guard'), ('senior_assistant', 'Senior Assistant'), ('dining', 'Dining'), ('shop', 'Shop'), ('canteen', 'Canteen'), ('others', 'Others')], default='Electrician', max_length=100)),
                ('hall', models.ForeignKey(default='', on_delete=django.db.models.deletion.CASCADE, to='halls_and_rooms.hall')),
            ],
        ),
        migrations.CreateModel(
            name='ProvostBody',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('email', models.EmailField(max_length=254, unique=True, verbose_name='Official Email')),
                ('name', models.CharField(max_length=100)),
                ('provost_body_role', models.CharField(choices=[('provost', 'Provost'), ('assistant_provost', 'Assistant Provost')], default='provost', max_length=100)),
                ('department', models.CharField(default='', max_length=100)),
                ('department_role', models.CharField(choices=[('professor', 'Professor'), ('associate_professor', 'Associate Professor'), ('assistant_professor', 'Assistant Professor'), ('lecturer', 'Lecturer')], default='professor', max_length=100)),
                ('priority', models.PositiveIntegerField(default=99, editable=False)),
                ('hall', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='halls_and_rooms.hall')),
            ],
            options={
                'ordering': ['priority', 'name'],
            },
        ),
    ]
