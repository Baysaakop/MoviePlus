from django.db import models
from django.contrib.auth.models import User
from djrichtextfield.models import RichTextField

class Genre(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True, null=True)    
    count = models.IntegerField(default=0)

    def __str__(self):
        return self.name

class Rating(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True, null=True)    
    count = models.IntegerField(default=0)

    def __str__(self):
        return self.name

class Production(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True, null=True)    
    count = models.IntegerField(default=0)

    def __str__(self):
        return self.name

class Occupation(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True, null=True)    
    count = models.IntegerField(default=0)

    def __str__(self):
        return self.name

class Score(models.Model):    
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    score = models.IntegerField(default=0)    

class Comment(models.Model):    
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    comment = models.TextField()        
    score = models.IntegerField(default=0)
    likes = models.ManyToManyField(User, null=True, blank=True, related_name="comment_likes")
    dislikes = models.ManyToManyField(User, null=True, blank=True, related_name="comment_dislikes")
    created_at = models.DateTimeField(auto_now_add=True)        

class Review(models.Model):    
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True)
    title = models.CharField(max_length=100)
    content = RichTextField()
    thumbnail = models.ImageField(upload_to='review/%Y/%m/%d', null=True, blank=True)      
    score = models.IntegerField(default=0)    
    views = models.IntegerField(default=0)
    likes = models.ManyToManyField(User, related_name="review_likes", null=True, blank=True)
    dislikes = models.ManyToManyField(User, related_name="review_dislikes", null=True, blank=True) 
    comments = models.ManyToManyField(Comment, null=True, blank=True, related_name="review_comments")    
    created_at = models.DateTimeField(auto_now_add=True)    

    def __str__(self):
        return self.title        

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
    likes = models.ManyToManyField(User, null=True, blank=True, related_name="artist_likes")
    follows = models.ManyToManyField(User, null=True, blank=True, related_name="artist_follows")      
    created_by = models.ForeignKey(User, on_delete=models.CASCADE, null=True, related_name='artist_created_by')
    created_at = models.DateTimeField(auto_now_add=True, null=True)      
    updated_by = models.ForeignKey(User, on_delete=models.CASCADE, null=True, related_name='artist_updated_by')
    updated_at = models.DateTimeField(auto_now=True, null=True)    

    def __str__(self):
        return self.name

class TempArtist(models.Model):
    name = models.CharField(max_length=100)
    firstname = models.CharField(max_length=50, blank=True, null=True)
    lastname = models.CharField(max_length=50, blank=True, null=True)
    biography = models.TextField(blank=True, null=True)    
    birthday = models.DateField(auto_now=False, blank=True, null=True)
    gender = models.CharField(max_length=10, blank=True, null=True)    
    occupation = models.ManyToManyField(Occupation)    
    avatar = models.ImageField(upload_to='artists/%Y/%m/%d', null=True, blank=True)
    created_by = models.ForeignKey(User, on_delete=models.CASCADE, null=True, related_name='tempartist_created_by')
    created_at = models.DateTimeField(auto_now_add=True, null=True)      
    updated_by = models.ForeignKey(User, on_delete=models.CASCADE, null=True, related_name='tempartist_updated_by')
    updated_at = models.DateTimeField(auto_now=True, null=True)    
    artistid = models.IntegerField(default=0) # 0. Create 1. Update /artistid/

    def __str__(self):
        return self.name

class Movie(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField(null=True, blank=True)    
    plot = models.TextField(null=True, blank=True)    
    duration = models.IntegerField(default=90)
    releasedate = models.DateField(auto_now=False, null=True, blank=True)
    rating = models.ForeignKey(Rating, on_delete=models.CASCADE, null=True, blank=True)
    genre = models.ManyToManyField(Genre, null=True, blank=True)    
    production = models.ManyToManyField(Production, null=True, blank=True)        
    views = models.IntegerField(default=0)
    likes = models.ManyToManyField(User, null=True, blank=True, related_name="movie_likes")
    checks = models.ManyToManyField(User, null=True, blank=True, related_name="movie_checks")
    watchlists = models.ManyToManyField(User, null=True, blank=True, related_name="movie_watchlists")
    scores = models.ManyToManyField(Score, null=True, blank=True, related_name="movie_scores")
    comments = models.ManyToManyField(Comment, null=True, blank=True, related_name="movie_comments")    
    # members = models.ManyToManyField(Member, null=True, blank=True, related_name="movie_members")
    # actors = models.ManyToManyField(Actor, null=True, blank=True, related_name="movie_actors")
    score = models.IntegerField(default=0)
    poster = models.ImageField(upload_to='movies/%Y/%m/%d', null=True, blank=True)
    landscape = models.ImageField(upload_to='movies/%Y/%m/%d', null=True, blank=True)
    trailer = models.CharField(max_length=200, null=True, blank=True)
    is_released = models.BooleanField(default=True)
    is_playing = models.BooleanField(default=False)    
    created_by = models.ForeignKey(User, on_delete=models.CASCADE, null=True, related_name='movie_created_by')
    created_at = models.DateTimeField(auto_now_add=True, null=True)            
    updated_by = models.ForeignKey(User, on_delete=models.CASCADE, null=True, related_name='movie_updated_by')
    updated_at = models.DateTimeField(auto_now=True, null=True)            

    def __str__(self):
        return self.name

class Film(models.Model):
    movie = models.ForeignKey(Movie, on_delete=models.CASCADE, null=True, blank=True)       

    def __str__(self):
        return self.movie.name

class TempFilm(models.Model):
    movie = models.ForeignKey(Movie, on_delete=models.DO_NOTHING, null=True, blank=True)       
    filmid = models.IntegerField(default=0) # 0. Create 1. Update /filmID/

    def __str__(self):
        return self.movie.name

class Series(models.Model):
    movie = models.ForeignKey(Movie, on_delete=models.CASCADE, null=True, blank=True)       
    season_count = models.IntegerField(default=1)
    episode_count = models.IntegerField(default=1)
    is_finished = models.BooleanField(default=True)

    def __str__(self):
        return self.movie.name

class TempSeries(models.Model):
    movie = models.ForeignKey(Movie, on_delete=models.DO_NOTHING, null=True, blank=True)       
    seriesid = models.IntegerField(default=0) # 0. Create 1. Update /seriesID/
    season_count = models.IntegerField(default=1)
    episode_count = models.IntegerField(default=1)
    is_finished = models.BooleanField(default=True)

    def __str__(self):
        return self.movie.name

class Actor(models.Model):    
    artist = models.ForeignKey(Artist, on_delete=models.CASCADE)    
    film = models.ForeignKey(Film, on_delete=models.CASCADE, null=True, blank=True)
    series = models.ForeignKey(Series, on_delete=models.CASCADE, null=True, blank=True)
    role_name = models.CharField(max_length=100, null=True, blank=True)

    def __str__(self):
        if self.film is not None:
            return self.artist.name + " - " + self.film.movie.name
        else:
            return self.artist.name + " - " + self.series.movie.name

class TempActor(models.Model):    
    artist = models.ForeignKey(Artist, on_delete=models.CASCADE)    
    film = models.ForeignKey(Film, on_delete=models.CASCADE, null=True, blank=True)
    series = models.ForeignKey(Series, on_delete=models.CASCADE, null=True, blank=True)
    role_name = models.CharField(max_length=100, null=True, blank=True)

    def __str__(self):
        if self.film is not None:
            return self.artist.name + " - " + self.film.movie.name
        else:
            return self.artist.name + " - " + self.series.movie.name

class Member(models.Model):    
    artist = models.ForeignKey(Artist, on_delete=models.CASCADE)    
    film = models.ForeignKey(Film, on_delete=models.CASCADE, null=True, blank=True)
    series = models.ForeignKey(Series, on_delete=models.CASCADE, null=True, blank=True)
    role = models.ManyToManyField(Occupation, null=True)        

    def __str__(self):
        if self.film is not None:
            return self.artist.name + " - " + self.film.movie.name
        else:
            return self.artist.name + " - " + self.series.movie.name

class TempMember(models.Model):    
    artist = models.ForeignKey(Artist, on_delete=models.CASCADE)    
    film = models.ForeignKey(Film, on_delete=models.CASCADE, null=True, blank=True)
    series = models.ForeignKey(Series, on_delete=models.CASCADE, null=True, blank=True)
    role = models.ManyToManyField(Occupation, null=True)        

    def __str__(self):
        if self.film is not None:
            return self.artist.name + " - " + self.film.movie.name
        else:
            return self.artist.name + " - " + self.series.movie.name

