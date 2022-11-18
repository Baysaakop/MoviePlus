from rest_framework import serializers
from django.db import transaction
from django.utils.translation import gettext as _
from dj_rest_auth.registration.serializers import RegisterSerializer
from dj_rest_auth.models import TokenModel

from .models import CustomUser, MovieLog
from movies.serializers import MovieListSerializer


class CustomUserSerializer(serializers.ModelSerializer):

    class Meta:
        model = CustomUser
        fields = ['id', 'username', 'email', 'biography',
                  'facebook', 'instagram', 'youtube', 'twitter', 'medium',
                  'movies_watched_count', 'movies_watchlist_count', 'movies_like_count', 'movies_score_count', 'movies_average_score',
                  'website', 'avatar', 'role', 'created_at'      
                  ]


class CustomUserDetailSerializer(serializers.ModelSerializer):

    following = CustomUserSerializer(read_only=True, many=True)
    followers = CustomUserSerializer(read_only=True, many=True)

    class Meta:
        model = CustomUser
        fields = ['id', 'username', 'email', 'biography',
                  'facebook', 'instagram', 'youtube', 'twitter', 'medium',
                  'movies_watched_count', 'movies_watchlist_count', 'movies_like_count', 'movies_score_count', 'movies_average_score',
                  'website', 'avatar', 'role', 'created_at',
                  'following', 'followers'
                ]


class CustomTokenSerializer(serializers.ModelSerializer):

    user = CustomUserSerializer(read_only=True)

    class Meta:
        model = TokenModel
        fields = ('key', 'user')


class CustomRegisterSerializer(RegisterSerializer):
    username = serializers.CharField(max_length=100, required=False)
    avatar = serializers.URLField(max_length=254, required=False)

    # Define transaction.atomic to rollback the save operation in case of error
    @transaction.atomic
    def save(self, request):
        user = super().save(request)
        if (self.data.get('username') != ""):
            user.username = self.data.get('username')
        user.save()
        return user

class MovieLogSerializer(serializers.ModelSerializer):

    movie = MovieListSerializer(read_only=True)
    user = CustomUserSerializer(read_only=True)

    class Meta:
        model = MovieLog
        fields = [
            'id', 'movie', 'user', 'watched_at', 'comment', 'spoiler_alert', 
            'like', 'watched', 'watchlist', 'score', 
            'like_count', 'view_count', 'comment_count', 'timestamp'
        ]
