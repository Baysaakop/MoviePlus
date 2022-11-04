from django.contrib import admin
from .models import CustomUser, MovieScore, MovieComment, MovieLog

admin.site.register(CustomUser)
admin.site.register(MovieScore)
admin.site.register(MovieComment)
admin.site.register(MovieLog)
