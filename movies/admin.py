from django.contrib import admin
from .models import Genre, Rating, Production, Tag, Platform, PlatformUrl, Movie

admin.site.register(Genre)
admin.site.register(Rating)
admin.site.register(Production)
admin.site.register(Tag)
admin.site.register(Platform)
admin.site.register(PlatformUrl)
admin.site.register(Movie)
