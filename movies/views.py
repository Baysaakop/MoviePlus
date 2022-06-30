import string
from django.db.models import Q
from rest_framework import status, pagination
from rest_framework.response import Response
from rest_framework.authtoken.models import Token
from .models import Movie, Genre, Platform, PlatformUrl, Rating, Production
from .serializers import MovieListSerializer, MovieDetailSerializer, GenreSerializer, PlatformSerializer, RatingSerializer, ProductionSerializer
from rest_framework import viewsets


class GenreViewSet(viewsets.ModelViewSet):
    serializer_class = GenreSerializer
    queryset = Genre.objects.all().order_by('name')


class RatingViewSet(viewsets.ModelViewSet):
    serializer_class = RatingSerializer
    queryset = Rating.objects.all().order_by('name')


class ProductionViewSet(viewsets.ModelViewSet):
    serializer_class = ProductionSerializer
    queryset = Production.objects.all().order_by('name')


class PlatformViewSet(viewsets.ModelViewSet):
    serializer_class = PlatformSerializer
    queryset = Platform.objects.all().order_by('name')


class MovieListPagination(pagination.PageNumberPagination):
    page_size = 40


class MovieListViewSet(viewsets.ModelViewSet):
    serializer_class = MovieListSerializer
    queryset = Movie.objects.all().order_by('-created_at')
    pagination_class = MovieListPagination

    def get_queryset(self):
        queryset = Movie.objects.all().order_by('-created_at')
        search = self.request.query_params.get('search', None)
        genre = self.request.query_params.get('genre', None)
        decade = self.request.query_params.get('decade', None)
        year = self.request.query_params.get('year', None)
        scoreto = self.request.query_params.get('scoreto', None)
        order = self.request.query_params.get('order', None)
        if search is not None:
            queryset = queryset.filter(
                Q(title__icontains=search) |
                Q(title__icontains=string.capwords(search)) |
                Q(tags__name__icontains=search) |
                Q(tags__name__icontains=string.capwords(search))).distinct()
        if genre is not None:
            queryset = queryset.filter(genres__id=genre).distinct()
        if decade is not None:
            queryset = queryset.filter(
                Q(releasedate__year__gte=int(decade)) &
                Q(releasedate__year__lt=int(decade)+10)).distinct()
        if year is not None:
            queryset = queryset.filter(releasedate__year=year).distinct()
        if scoreto is not None:
            queryset = queryset.filter(
                Q(avg_score__gte=int(scoreto)-20) &
                Q(avg_score__lt=int(scoreto))).distinct()
        if order is not None:
            queryset = queryset.order_by(order).distinct()
        return queryset


class MovieDetailViewSet(viewsets.ModelViewSet):
    serializer_class = MovieDetailSerializer
    queryset = Movie.objects.all().order_by('-created_at')

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        instance.view_count = instance.view_count + 1
        instance.save()
        serializer = self.get_serializer(instance)
        return Response(serializer.data)

    def create(self, request, *args, **kwargs):
        user = Token.objects.get(key=request.data['token']).user
        movie = Movie.objects.create(
            title=request.data['title'],
            created_by=user
        )
        updateMovie(movie, request)
        serializer = MovieDetailSerializer(movie)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

    def update(self, request, *args, **kwargs):
        movie = self.get_object()
        updateMovie(movie, request)
        serializer = MovieDetailSerializer(movie)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_200_OK, headers=headers)


def updateMovie(movie, request):
    if 'title' in request.data:
        movie.title = request.data['title']
    if 'description' in request.data:
        movie.description = request.data['description']
    if 'duration' in request.data:
        movie.duration = request.data['duration']
    if 'releasedate' in request.data:
        movie.releasedate = request.data['releasedate']
    if 'trailer' in request.data:
        movie.trailer = request.data['trailer']
    if 'poster' in request.data:
        movie.poster = request.data['poster']
    if 'background' in request.data:
        movie.background = request.data['background']
    if 'is_released' in request.data:
        if request.data['is_released'] == "true":
            movie.is_released = True
        else:
            movie.is_released = False
    if 'in_theater' in request.data:
        if request.data['in_theater'] == "true":
            movie.in_theater = True
        else:
            movie.in_theater = False
    if 'rating' in request.data:
        rating = Rating.objects.get(id=int(request.data['rating']))
        movie.rating = rating
    if 'productions' in request.data:
        movie.productions.clear()
        productions = request.data['productions'].split(",")
        for item in productions:
            movie.productions.add(int(item))
    if 'genres' in request.data:
        movie.genres.clear()
        genres = request.data['genres'].split(",")
        for item in genres:
            movie.genres.add(int(item))
    if 'tags' in request.data:
        movie.tags.clear()
        tags = request.data['tags'].split(",")
        for item in tags:
            movie.tags.add(int(item))
    if 'platform' in request.data:
        platform = Platform.objects.get(id=int(request.data['platform']))
        url = request.data['url']
        platformurl = movie.platforms.filter(platform=platform)
        if not platformurl:
            if url != "":
                platformurl = PlatformUrl.objects.create(
                    platform=platform,
                    url=url
                )
                movie.platforms.add(platformurl)
        else:
            if url != "":
                platformurl[0].url = url
                platformurl[0].save()
            else:
                movie.platforms.remove(platformurl[0])
                PlatformUrl.objects.filter(id=platformurl[0].id).delete()
    movie.save()
    return movie
