from rest_framework import serializers
from .models import Occupation, Artist, MovieCastMember, MovieCrewMember
from movies.serializers import MovieListSerializer


class OccupationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Occupation
        fields = ('id', 'name', 'description')


class ArtistListSerializer(serializers.ModelSerializer):

    class Meta:
        model = Artist
        fields = (
            'id', 'name', 'image'
        )


class ArtistDetailSerializer(serializers.ModelSerializer):
    occupations = OccupationSerializer(read_only=True, many=True)

    class Meta:
        model = Artist
        fields = (
            'id', 'name', 'firstname', 'lastname', 'biography', 'birthdate',
            'gender', 'image', 'occupations', 'view_count',
            'created_by', 'created_at'
        )


class MovieCastMemberSerializer(serializers.ModelSerializer):
    artist = ArtistListSerializer(read_only=True)
    movie = MovieListSerializer(read_only=True)

    class Meta:
        model = MovieCastMember
        fields = ('id', 'artist', 'movie', 'is_lead',
                  'role_name', 'created_by', 'created_at')


class MovieCrewMemberSerializer(serializers.ModelSerializer):
    artist = ArtistListSerializer(read_only=True)
    movie = MovieListSerializer(read_only=True)
    roles = OccupationSerializer(read_only=True, many=True)

    class Meta:
        model = MovieCrewMember
        fields = ('id', 'artist', 'movie', 'roles', 'created_by', 'created_at')
