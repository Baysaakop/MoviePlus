from rest_framework import serializers
from rest_framework.authtoken.models import Token
from .models import Genre, Rating, Production, Occupation, Artist, Member, Movie, Review

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
    class Meta:
        model = Artist
        fields = ('id', 'name', 'firstname', 'lastname', 'biography', 'birthday', 'avatar', 'occupation', 'likes', 'followers', 'created_by', 'created_at')  

class MemberSerializer(serializers.ModelSerializer):
    class Meta:
        model = Member
        fields = ('id', 'artist', 'role', 'role_name')    

class MovieSerializer(serializers.ModelSerializer):
    class Meta:
        model = Movie
        fields = ('id', 'name', 'description', 'plot', 'duration', 'releasedate', 'rating', 'genre', 'production', 'members', 'views', 'likes', 'watched', 'watchlisted', 'score', 'score_count', 'poster', 'trailer', 'created_by', 'created_at')  

class ReviewSerializer(serializers.ModelSerializer):
    class Meta:
        model = Review
        fields = ('id', 'title', 'content', 'thumbnail', 'created_by', 'created_at')    