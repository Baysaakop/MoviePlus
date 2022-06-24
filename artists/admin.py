from django.contrib import admin
from .models import Occupation, Artist, MovieCastMember, MovieCrewMember
# Register your models here.
admin.site.register(Occupation)
admin.site.register(Artist)
admin.site.register(MovieCastMember)
admin.site.register(MovieCrewMember)
