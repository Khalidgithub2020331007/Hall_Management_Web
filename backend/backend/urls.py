# =======================
# backend/urls.py
# =======================

from django.conf import settings  # Import settings
from django.contrib import admin
from django.urls import path, include
from django.conf.urls.static import static


urlpatterns = [
    path('admin/', admin.site.urls),

    # Apps sorted alphabetically
    path('complain/', include('complain.urls')),
    path('dining_canteen_shop/', include('dining_canteen_shop.urls')),
    path('events/', include('events.urls')),
    path('forum/', include('forum.urls')),
    path('guest_registration/', include('guest_registration.urls')),
    path('halls_and_rooms/', include('halls_and_rooms.urls')),
    path('lost_and_found/', include('lost_and_found.urls')),
    path('meetings/', include('meetings.urls')),
    path('official/', include('official.urls')),
    path('official_transaction/', include('official_transaction.urls')),
    path('sport_equipment/', include('sport_equipment.urls')),
    path('student_admission/', include('student_admission.urls')),
    path('user_info/', include('user_info.urls')),
]

if settings.DEBUG:  # Now you can use settings.DEBUG
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
