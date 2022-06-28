from django.db import models
from movies.models import Movie
from django.conf import settings


class Occupation(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True, null=True)

    def __str__(self):
        return self.name


class Artist(models.Model):
    name = models.CharField(max_length=100)
    firstname = models.CharField(max_length=100, blank=True, null=True)
    lastname = models.CharField(max_length=100, blank=True, null=True)
    biography = models.TextField(null=True, blank=True)
    birthdate = models.DateField(auto_now=False, blank=True, null=True)
    gender = models.CharField(max_length=10, blank=True, null=True)
    occupations = models.ManyToManyField(Occupation)
    image = models.ImageField(
        upload_to='artists/%Y/%m/%d', null=True, blank=True)
    view_count = models.IntegerField(default=0)
    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, related_name='artist_created_by')
    created_at = models.DateTimeField(auto_now_add=True, null=True)

    def __str__(self):
        return self.name


class MovieCastMember(models.Model):
    artist = models.ForeignKey(Artist, on_delete=models.CASCADE)
    movie = models.ForeignKey(
        Movie, on_delete=models.CASCADE, null=True, blank=True)
    is_lead = models.BooleanField(default=False)
    role_name = models.CharField(max_length=100, null=True, blank=True)
    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True, related_name='movie_cast_member_created_by')
    created_at = models.DateTimeField(auto_now_add=True, null=True)

    def __str__(self):
        return self.movie.title + " - " + self.artist.name


class MovieCrewMember(models.Model):
    artist = models.ForeignKey(Artist, on_delete=models.CASCADE)
    movie = models.ForeignKey(
        Movie, on_delete=models.CASCADE, null=True, blank=True)
    roles = models.ManyToManyField(Occupation, blank=True)
    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True, related_name='movie_crew_member_created_by')
    created_at = models.DateTimeField(auto_now_add=True, null=True)

    def __str__(self):
        return self.movie.title + " - " + self.artist.name
