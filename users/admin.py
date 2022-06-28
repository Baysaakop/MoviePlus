from django.contrib import admin
from .models import CustomUser, MovieScore

admin.site.register(CustomUser)
admin.site.register(MovieScore)
