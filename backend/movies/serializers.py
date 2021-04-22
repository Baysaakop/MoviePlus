from rest_framework import serializers
from rest_framework.authtoken.models import Token
from .models import Genre, Rating, Production, Occupation, Artist, Member, Movie, Series, Review, Comment, Score, Like, Check, Watchlist
from users.models import User, Profile
# from users.serializers import UserSerializer

class GenreSerializer(serializers.ModelSerializer):
    class Meta:
        model = Genre
        fields = ('id', 'name', 'description')     

class RatingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Rating
        fields = ('id', 'name', 'description') 

class ProductionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Production
        fields = ('id', 'name', 'description')      

class OccupationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Occupation
        fields = ('id', 'name', 'description')        

class ArtistSerializer(serializers.ModelSerializer):
    occupation = OccupationSerializer(read_only=True, many=True)
    class Meta:
        model = Artist
        fields = ('id', 'name', 'firstname', 'lastname', 'biography', 'birthday', 'gender', 'avatar', 'occupation', 
        'view_count', 'like_count', 'follow_count', 'created_by', 'created_at')  

class MovieSerializer(serializers.ModelSerializer):
    rating = RatingSerializer(read_only=True)
    genre = GenreSerializer(read_only=True, many=True)
    production = ProductionSerializer(read_only=True, many=True)
    class Meta:
        model = Movie
        fields = ('id', 'name', 'description', 'plot', 'duration', 'releasedate', 'rating', 'is_released', 'in_theater', 'genre', 'production', 
        'view_count', 'comment_count', 'like_count', 'check_count', 'watchlist_count', 'score_count',
        'score', 'poster', 'landscape', 'trailer', 'created_by', 'created_at')  

class SeriesSerializer(serializers.ModelSerializer):
    rating = RatingSerializer(read_only=True)
    genre = GenreSerializer(read_only=True, many=True)
    production = ProductionSerializer(read_only=True, many=True)
    class Meta:
        model = Series
        fields = ('id', 'name', 'description', 'plot', 'duration', 'releasedate', 'rating', 'is_released', 'on_tv', 'is_finished', 'genre', 'production', 
        'season_count', 'episode_count', 'view_count', 'comment_count', 'like_count', 'check_count', 'watchlist_count', 'score_count',
        'score', 'poster', 'landscape', 'trailer', 'created_by', 'created_at')  

class MemberSerializer(serializers.ModelSerializer):
    artist = ArtistSerializer(read_only=True)
    movie = MovieSerializer(read_only=True)
    series = SeriesSerializer(read_only=True)
    role = OccupationSerializer(read_only=True, many=True)
    class Meta:
        model = Member
        fields = ('id', 'artist', 'movie', 'series', 'role', 'role_name')    

class ProfileSerializer(serializers.ModelSerializer):            
    class Meta:
        model = Profile
        fields = ('id', 'avatar', 'phone_number', 'birthday')    

class UserSerializer(serializers.ModelSerializer):         
    profile = ProfileSerializer(read_only=True)     
    class Meta:
        model = User
        fields = ('id', 'username', 'profile')    

class ReviewSerializer(serializers.ModelSerializer):          
    movie = MovieSerializer(read_only=True)
    created_by = UserSerializer(read_only=True)  
    class Meta:
        model = Review
        fields = ('id', 'title', 'content', 'thumbnail', 'movie', 'views', 'likes', 'score', 'created_by', 'created_at')    

class CommentSerializer(serializers.ModelSerializer):          
    movie = MovieSerializer(read_only=True)
    user = UserSerializer(read_only=True)  
    class Meta:
        model = Comment
        fields = ('id', 'movie', 'user', 'comment', 'score', 'likes', 'dislikes', 'created_at')    

class ScoreSerializer(serializers.ModelSerializer):          
    movie = MovieSerializer(read_only=True)
    user = UserSerializer(read_only=True)  
    class Meta:
        model = Score
        fields = ('id', 'movie', 'user', 'score', 'created_at')    

class LikeSerializer(serializers.ModelSerializer):          
    movie = MovieSerializer(read_only=True)
    user = UserSerializer(read_only=True)  
    class Meta:
        model = Like
        fields = ('id', 'movie', 'user', 'created_at')    

class CheckSerializer(serializers.ModelSerializer):          
    movie = MovieSerializer(read_only=True)
    user = UserSerializer(read_only=True)  
    class Meta:
        model = Check
        fields = ('id', 'movie', 'user', 'created_at')    

class WatchlistSerializer(serializers.ModelSerializer):          
    movie = MovieSerializer(read_only=True)
    user = UserSerializer(read_only=True)  
    class Meta:
        model = Watchlist
        fields = ('id', 'movie', 'user', 'created_at')    