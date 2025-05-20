from django.conf import settings  # Import settings
from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('registration/', include('registration.urls')),
    path('complain/', include('complain.urls')),
    path('guest_registration/', include('guest_registration.urls')),
    path('notice_board/', include('notice_board.urls')),
]

if settings.DEBUG:  # Now you can use settings.DEBUG
    from django.conf.urls.static import static
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
