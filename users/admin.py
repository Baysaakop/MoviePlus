from django.contrib import admin
from .models import CustomUser, MovieLog

admin.site.register(CustomUser)
admin.site.register(MovieLog)
