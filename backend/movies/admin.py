from django.contrib import admin
from .models import Genre, Rating, Production, Occupation, Artist, Member, Movie, Review

admin.site.register(Genre)
admin.site.register(Rating)
admin.site.register(Production)
admin.site.register(Occupation)
admin.site.register(Artist)
admin.site.register(Member)
admin.site.register(Movie)
admin.site.register(Review)