from rest_framework import serializers
from rest_framework.authtoken.models import Token
from .models import Genre, Rating, Production, Occupation, Artist, Member, Cast, Movie, Review
from users.models import User, Profile

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
        fields = ('id', 'name', 'firstname', 'lastname', 'biography', 'birthday', 'gender', 'avatar', 'occupation', 'views', 'likes', 'followers', 'created_by', 'created_at')  

class MemberSerializer(serializers.ModelSerializer):
    artist = ArtistSerializer(read_only=True)
    role = OccupationSerializer(read_only=True)
    class Meta:
        model = Member
        fields = ('id', 'artist', 'role')    

class CastSerializer(serializers.ModelSerializer):
    artist = ArtistSerializer(read_only=True)    
    class Meta:
        model = Cast
        fields = ('id', 'artist', 'role_name')    

class MovieSerializer(serializers.ModelSerializer):
    rating = RatingSerializer(read_only=True)
    genre = GenreSerializer(read_only=True, many=True)
    production = ProductionSerializer(read_only=True, many=True)
    member = MemberSerializer(read_only=True, many=True)
    cast = CastSerializer(read_only=True, many=True)
    class Meta:
        model = Movie
        fields = ('id', 'name', 'description', 'plot', 'duration', 'releasedate', 'rating', 'genre', 'production', 'member', 'cast', 'views', 'likes', 'watched', 'watchlist', 'score', 'score_count', 'poster', 'landscape', 'trailer', 'created_by', 'created_at')  

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
    created_by = UserSerializer(read_only=True)  
    class Meta:
        model = Review
        fields = ('id', 'title', 'content', 'thumbnail', 'views', 'likes', 'created_by', 'created_at')    