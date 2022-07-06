from django.contrib import admin
from .models import CustomUser, MovieScore, MovieComment

admin.site.register(CustomUser)
admin.site.register(MovieScore)
admin.site.register(MovieComment)
