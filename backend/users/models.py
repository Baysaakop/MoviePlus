from django.db import models
from django.contrib.auth.models import User
from django.db.models.signals import post_save
from django.dispatch import receiver
from movies.models import Movie, Artist, Review

USER_ROLES = (
    ("1", "admin"),
    ("2", "moderator"),
    ("3", "user"),
)

def user_directory_path(instance, filename):
    # file will be uploaded to MEDIA_ROOT/users/<id>/<filename> 
    return 'users/{0}/{1}'.format(instance.user.id, filename) 

class Score(models.Model):
    movie = models.ForeignKey(Movie, on_delete=models.CASCADE, related_name="movie_score")
    score = models.IntegerField(default=0)   

    def __str__(self):
        return self.movie.name

class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    description = models.TextField(max_length=500, blank=True)
    phone_number = models.CharField(max_length=30, blank=True)
    birthday = models.DateField(null=True, blank=True)
    avatar = models.ImageField(upload_to=user_directory_path, null=True, blank=True)
    role = models.CharField(max_length=20, choices=USER_ROLES, default="3")
    likes = models.ManyToManyField(Movie, related_name="movie_likes", null=True, blank=True)
    watched = models.ManyToManyField(Movie, related_name="movie_watched", null=True, blank=True)
    watchlist = models.ManyToManyField(Movie, related_name="movie_watchlist", null=True, blank=True)
    artist_likes = models.ManyToManyField(Artist, related_name="artist_likes", null=True, blank=True)
    artist_followed = models.ManyToManyField(Artist, related_name="artist_followed", null=True, blank=True)    
    review_likes = models.ManyToManyField(Review, related_name="review_likes", null=True, blank=True)
    critic_likes = models.ManyToManyField(User, related_name="critic_likes", null=True, blank=True)
    critic_followed = models.ManyToManyField(User, related_name="critic_followed", null=True, blank=True)
    scores = models.ManyToManyField(Score, null=True, blank=True)

    def __str__(self):
        return self.user.username
    

@receiver(post_save, sender=User)
def create_user_profile(sender, instance, created, **kwargs):
    if created:
        Profile.objects.create(user=instance)

@receiver(post_save, sender=User)
def save_user_profile(sender, instance, **kwargs):
    instance.profile.save()