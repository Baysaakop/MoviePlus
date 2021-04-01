from django.db import models
from django.contrib.auth.models import User
from djrichtextfield.models import RichTextField

class Genre(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True, null=True)    

    def __str__(self):
        return self.name

class Rating(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True, null=True)    

    def __str__(self):
        return self.name

class Production(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True, null=True)    

    def __str__(self):
        return self.name

class Occupation(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True, null=True)    

    def __str__(self):
        return self.name

class Artist(models.Model):
    name = models.CharField(max_length=100)
    firstname = models.CharField(max_length=50, blank=True, null=True)
    lastname = models.CharField(max_length=50, blank=True, null=True)
    biography = models.TextField(blank=True, null=True)    
    birthday = models.DateField(auto_now=False, blank=True, null=True)
    gender = models.CharField(max_length=10, blank=True, null=True)    
    occupation = models.ManyToManyField(Occupation)    
    avatar = models.ImageField(upload_to='artists/%Y/%m/%d', null=True, blank=True)
    views = models.IntegerField(default=0)
    likes = models.IntegerField(default=0)
    followers = models.IntegerField(default=0)    
    created_by = models.ForeignKey(User, on_delete=models.CASCADE, null=True, related_name='artist_created_by')
    created_at = models.DateTimeField(auto_now_add=True, null=True)        

    def __str__(self):
        return self.name

class Member(models.Model):    
    artist = models.ForeignKey(Artist, on_delete=models.CASCADE)    
    role = models.ForeignKey(Occupation, on_delete=models.CASCADE, null=True, blank=True)        

    def __str__(self):
        return self.artist.name

class Cast(models.Model):    
    artist = models.ForeignKey(Artist, on_delete=models.CASCADE)    
    role_name = models.CharField(max_length=100, null=True, blank=True)

    def __str__(self):
        return self.artist.name

class Movie(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField(null=True, blank=True)    
    plot = models.TextField(null=True, blank=True)    
    duration = models.IntegerField(default=90)
    releasedate = models.DateField(auto_now=False, null=True, blank=True)
    rating = models.ForeignKey(Rating, on_delete=models.CASCADE, null=True, blank=True)
    genre = models.ManyToManyField(Genre, null=True, blank=True)    
    production = models.ManyToManyField(Production, null=True, blank=True)
    member = models.ManyToManyField(Member, null=True, blank=True)
    cast = models.ManyToManyField(Cast, null=True, blank=True)
    views = models.IntegerField(default=0)
    likes = models.IntegerField(default=0)    
    watched = models.IntegerField(default=0)    
    watchlist = models.IntegerField(default=0)    
    score = models.IntegerField(default=0)
    score_count = models.IntegerField(default=0)
    poster = models.ImageField(upload_to='movies/%Y/%m/%d', null=True, blank=True)
    landscape = models.ImageField(upload_to='movies/%Y/%m/%d', null=True, blank=True)
    trailer = models.CharField(max_length=200, null=True, blank=True)
    created_by = models.ForeignKey(User, on_delete=models.CASCADE, null=True, related_name='movie_created_by')
    created_at = models.DateTimeField(auto_now_add=True, null=True)            

    def __str__(self):
        return self.name

class Review(models.Model):    
    title = models.CharField(max_length=100)
    content = RichTextField()
    thumbnail = models.ImageField(upload_to='review/%Y/%m/%d', null=True, blank=True)    
    views = models.IntegerField(default=0)
    likes = models.IntegerField(default=0)        
    created_at = models.DateTimeField(auto_now_add=True)
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, blank=True, null=True, related_name="review_created_by")

    def __str__(self):
        return self.title        
    
