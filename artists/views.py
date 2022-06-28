import string
from django.db.models import Q
from rest_framework import status, pagination
from rest_framework.response import Response
from rest_framework.authtoken.models import Token

from .models import Occupation, Artist, MovieCastMember, MovieCrewMember
from .serializers import OccupationSerializer, ArtistListSerializer, ArtistDetailSerializer, MovieCastMemberSerializer, MovieCrewMemberSerializer

from movies.models import Movie
from rest_framework import viewsets


class OccupationViewSet(viewsets.ModelViewSet):
    serializer_class = OccupationSerializer
    queryset = Occupation.objects.all().order_by('name')


class ArtistPagination(pagination.PageNumberPagination):
    page_size = 48


class ArtistListViewSet(viewsets.ModelViewSet):
    serializer_class = ArtistListSerializer
    queryset = Artist.objects.all().order_by('-created_at')
    pagination_class = ArtistPagination

    def get_queryset(self):
        queryset = Artist.objects.all().order_by('-created_at')
        name = self.request.query_params.get('name', None)
        occupation = self.request.query_params.get('occupation', None)
        order = self.request.query_params.get('order', None)
        if name is not None:
            queryset = queryset.filter(Q(name__icontains=name) | Q(
                name__icontains=string.capwords(name))).distinct()
        if occupation is not None:
            queryset = queryset.filter(occupations__id=occupation)
        if order is not None:
            queryset = queryset.order_by(order).distinct()
        return queryset


class ArtistDetailViewSet(viewsets.ModelViewSet):
    serializer_class = ArtistDetailSerializer
    queryset = Artist.objects.all().order_by('-created_at')
    pagination_class = ArtistPagination

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        instance.view_count = instance.view_count + 1
        instance.save()
        serializer = self.get_serializer(instance)
        return Response(serializer.data)

    def create(self, request, *args, **kwargs):
        user = Token.objects.get(key=request.data['token']).user
        artist = Artist.objects.create(
            name=request.data['name'],
            created_by=user
        )
        updateArtist(artist, request)
        serializer = ArtistDetailSerializer(artist)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

    def update(self, request, *args, **kwargs):
        artist = self.get_object()
        updateArtist(artist, request)
        serializer = ArtistDetailSerializer(artist)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_200_OK, headers=headers)


def updateArtist(artist, request):
    if 'name' in request.data:
        artist.name = request.data['name']
    if 'firstname' in request.data:
        artist.firstname = request.data['firstname']
    if 'lastname' in request.data:
        artist.lastname = request.data['lastname']
    if 'biography' in request.data:
        artist.biography = request.data['biography']
    if 'birthdate' in request.data:
        artist.birthdate = request.data['birthdate']
    if 'gender' in request.data:
        artist.gender = request.data['gender']
    if 'image' in request.data:
        artist.image = request.data['image']
    if 'occupations' in request.data:
        artist.occupations.clear()
        arr = str(request.data['occupations']).split(',')
        for item in arr:
            artist.occupations.add(int(item))
    artist.save()
    return artist


class MemberPagination(pagination.PageNumberPagination):
    page_size = 50


class MovieCastMemberViewSet(viewsets.ModelViewSet):
    serializer_class = MovieCastMemberSerializer
    queryset = MovieCastMember.objects.all().order_by('movie__releasedate')
    pagination_class = MemberPagination

    def get_queryset(self):
        queryset = MovieCastMember.objects.all().order_by('movie__releasedate')
        movie = self.request.query_params.get('movie', None)
        artist = self.request.query_params.get('artist', None)
        is_lead = self.request.query_params.get('is_lead', None)
        if movie is not None:
            queryset = queryset.filter(
                movie__id=int(movie)).order_by('is_lead')
        if artist is not None:
            queryset = queryset.filter(
                artist__id=int(artist)).order_by('movie__releasedate')
        if is_lead is not None:
            if is_lead == 'true':
                queryset = queryset.filter(is_lead=True)
            else:
                queryset = queryset.filter(is_lead=False)
        return queryset

    def create(self, request, *args, **kwargs):
        user = Token.objects.get(key=request.data['token']).user
        artist = Artist.objects.get(id=int(request.data['artist']))
        movie = Movie.objects.get(id=int(request.data['movie']))
        member = MovieCastMember.objects.create(
            artist=artist,
            movie=movie,
            created_by=user
        )
        if 'is_lead' in request.data:
            member.is_lead = True
        if 'role_name' in request.data:
            member.role_name = request.data['role_name']
        member.save()
        serializer = MovieCastMemberSerializer(member)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

    def update(self, request, *args, **kwargs):
        member = self.get_object()
        if 'is_lead' in request.data:
            if request.data['is_lead'] == "true":
                member.is_lead = True
            else:
                member.is_lead = False
        if 'role_name' in request.data:
            member.role_name = request.data['role_name']
        member.save()
        serializer = MovieCastMemberSerializer(member)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_200_OK, headers=headers)


class MovieCrewMemberViewSet(viewsets.ModelViewSet):
    serializer_class = MovieCrewMemberSerializer
    queryset = MovieCrewMember.objects.all().order_by('movie__releasedate')
    pagination_class = MemberPagination

    def get_queryset(self):
        queryset = MovieCrewMember.objects.all().order_by('movie__releasedate')
        movie = self.request.query_params.get('movie', None)
        artist = self.request.query_params.get('artist', None)
        role = self.request.query_params.get('role', None)
        if movie is not None:
            queryset = queryset.filter(
                movie__id=int(movie)).order_by('roles__id')
        if artist is not None:
            queryset = queryset.filter(
                artist__id=int(artist)).order_by('movie__releasedate')
        if role is not None:
            queryset = queryset.filter(
                roles=int(role))
        return queryset

    def create(self, request, *args, **kwargs):
        user = Token.objects.get(key=request.data['token']).user
        artist = Artist.objects.get(id=int(request.data['artist']))
        movie = Movie.objects.get(id=int(request.data['movie']))
        member = MovieCrewMember.objects.create(
            artist=artist,
            movie=movie,
            created_by=user
        )
        if 'roles' in request.data:
            arr = str(request.data['roles']).split(',')
            for item in arr:
                member.roles.add(int(item))
        member.save()
        serializer = MovieCrewMemberSerializer(member)
        headers = self.get_success_headers(serializer.data)
        return Response(
            serializer.data,
            status=status.HTTP_201_CREATED,
            headers=headers
        )

    def update(self, request, *args, **kwargs):
        member = self.get_object()
        if 'roles' in request.data:
            member.roles.clear()
            arr = str(request.data['roles']).split(',')
            for item in arr:
                member.roles.add(int(item))
        member.save()
        serializer = MovieCrewMemberSerializer(member)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_200_OK, headers=headers)
