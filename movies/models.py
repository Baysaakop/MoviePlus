from django.db import models
from django.conf import settings


class Genre(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True, null=True)
    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, related_name='genre_created_by')
    created_at = models.DateTimeField(auto_now_add=True, null=True)

    def __str__(self):
        return self.name


class Rating(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True, null=True)
    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, related_name='rating_created_by')
    created_at = models.DateTimeField(auto_now_add=True, null=True)

    def __str__(self):
        return self.name


class Production(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True, null=True)
    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, related_name='production_created_by')
    created_at = models.DateTimeField(auto_now_add=True, null=True)

    def __str__(self):
        return self.name


class Platform(models.Model):
    name = models.CharField(max_length=100)
    logo = models.ImageField(
        upload_to='platforms/', null=True, blank=True)

    def __str__(self):
        return self.name


class PlatformUrl(models.Model):
    url = models.URLField(max_length=255)
    platform = models.ForeignKey(
        Platform, on_delete=models.SET_NULL, null=True, blank=True)

    def __str__(self):
        return self.url


class Movie(models.Model):
    title = models.CharField(max_length=100)
    description = models.TextField(null=True, blank=True)
    duration = models.IntegerField(default=90)
    releasedate = models.DateField(auto_now=False, null=True, blank=True)
    rating = models.ForeignKey(
        Rating, on_delete=models.CASCADE, null=True, blank=True)
    genres = models.ManyToManyField(Genre, blank=True)    
    productions = models.ManyToManyField(Production, blank=True)
    poster = models.ImageField(
        upload_to='movies/posters/%Y/%m/', null=True, blank=True)
    background = models.ImageField(
        upload_to='movies/backgrounds/%Y/%m/', null=True, blank=True)
    trailer = models.CharField(max_length=255, null=True, blank=True)
    view_count = models.IntegerField(default=0)
    like_count = models.IntegerField(default=0)
    watched_count = models.IntegerField(default=0)
    watchlist_count = models.IntegerField(default=0)
    score_count = models.IntegerField(default=0)
    avg_score = models.IntegerField(default=0)
    is_released = models.BooleanField(default=True)
    in_theater = models.BooleanField(default=False)
    platforms = models.ManyToManyField(PlatformUrl, blank=True)
    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, related_name='movie_created_by')
    created_at = models.DateTimeField(auto_now_add=True, null=True)

    def __str__(self):
        return self.title
