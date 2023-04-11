
from django.contrib import admin
from django.urls import include, path
from voting_api import urls as voting_urls

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api-auth/', include('rest_framework.urls')),
    path('biometric_voting/', include(voting_urls)),
]
