from rest_framework import serializers
from django.db import transaction
from django.utils.translation import gettext as _
from dj_rest_auth.registration.serializers import RegisterSerializer
from dj_rest_auth.models import TokenModel

from .models import CustomUser, MovieScore, MovieComment, MovieLog
from movies.serializers import MovieListSerializer


class MovieScoreSerializer(serializers.ModelSerializer):

    movie = MovieListSerializer(read_only=True)

    class Meta:
        model = MovieScore
        fields = ['id', 'movie', 'score']


class CustomUserSerializer(serializers.ModelSerializer):

    class Meta:
        model = CustomUser
        fields = ['id', 'username', 'email', 'biography',
                  'facebook', 'instagram', 'youtube', 'twitter', 'medium',
                  'website', 'avatar', 'role', 'created_at',
                  ]


class CustomUserDetailSerializer(serializers.ModelSerializer):

    movies_like = MovieListSerializer(read_only=True, many=True)
    movies_watched = MovieListSerializer(read_only=True, many=True)
    movies_watchlist = MovieListSerializer(read_only=True, many=True)
    movies_rated = MovieScoreSerializer(read_only=True, many=True)
    following = CustomUserSerializer(read_only=True, many=True)
    followers = CustomUserSerializer(read_only=True, many=True)

    class Meta:
        model = CustomUser
        fields = ['id', 'username', 'email', 'biography',
                  'facebook', 'instagram', 'youtube', 'twitter', 'medium',
                  'website', 'avatar', 'role', 'created_at',
                  'movies_like', 'movies_watched', 'movies_watchlist', 'movies_rated',
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

class MovieCommentSerializer(serializers.ModelSerializer):

    movie = MovieListSerializer(read_only=True)
    user = CustomUserSerializer(read_only=True)

    class Meta:
        model = MovieComment
        fields = (
            'id', 'movie', 'user', 'comment', 'spoiler_alert', 'score', 'like_count', 'reply_count', 'timestamp', 'parent'
        )
