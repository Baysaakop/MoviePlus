from rest_framework import serializers
from .models import Genre, PlatformUrl, Platform, Rating, Production, Movie


class GenreSerializer(serializers.ModelSerializer):
    class Meta:
        model = Genre
        fields = ('id', 'name', 'description')


class PlatformSerializer(serializers.ModelSerializer):
    class Meta:
        model = Platform
        fields = ('id', 'name', 'logo')


class PlatformUrlSerializer(serializers.ModelSerializer):
    platform = PlatformSerializer(read_only=True)

    class Meta:
        model = PlatformUrl
        fields = ('id', 'url', 'platform')


class RatingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Rating
        fields = ('id', 'name', 'description')


class ProductionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Production
        fields = ('id', 'name', 'description')


class MovieListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Movie
        fields = (
            'id', 'title', 'releasedate', 'score_count', 'avg_score', 'poster'
        )


class MovieDetailSerializer(serializers.ModelSerializer):
    rating = RatingSerializer(read_only=True)
    genres = GenreSerializer(read_only=True, many=True)
    productions = ProductionSerializer(read_only=True, many=True)
    platforms = PlatformUrlSerializer(read_only=True, many=True)

    class Meta:
        model = Movie
        fields = (
            'id', 'title', 'description', 'duration', 'releasedate',
            'rating', 'genres', 'productions', 'poster', 'background',
            'view_count', 'like_count', 'watched_count', 'watchlist_count',
            'score_count', 'avg_score', 'trailer', 'is_released', 'in_theater', 'platforms'
        )
