import json
from rest_framework import status
from rest_framework.response import Response
from rest_framework.authtoken.models import Token
from .models import Genre, Rating, Production, Occupation, Artist, Member, Movie, Review
from .serializers import GenreSerializer, RatingSerializer, ProductionSerializer, OccupationSerializer, ArtistSerializer, MemberSerializer, MovieSerializer, ReviewSerializer
from rest_framework import viewsets, filters
from rest_framework.generics import ListCreateAPIView, RetrieveAPIView, CreateAPIView, DestroyAPIView, UpdateAPIView
from django_filters.rest_framework import DjangoFilterBackend
from django_filters import FilterSet

class MovieFilter(FilterSet):
    class Meta:
        model = Movie
        fields = ['name', 'genre__id']       

class GenreViewSet(viewsets.ModelViewSet):
    serializer_class = GenreSerializer
    queryset = Genre.objects.all()
    filter_backends = [filters.SearchFilter]
    search_fields = ['name']

class RatingViewSet(viewsets.ModelViewSet):
    serializer_class = RatingSerializer
    queryset = Rating.objects.all()
    filter_backends = [filters.SearchFilter]
    search_fields = ['name']

class ProductionViewSet(viewsets.ModelViewSet):
    serializer_class = ProductionSerializer
    queryset = Production.objects.all()
    filter_backends = [filters.SearchFilter]
    search_fields = ['name']

class OccupationViewSet(viewsets.ModelViewSet):
    serializer_class = OccupationSerializer
    queryset = Occupation.objects.all()
    filter_backends = [filters.SearchFilter]
    search_fields = ['name']

class ArtistViewSet(viewsets.ModelViewSet):
    serializer_class = ArtistSerializer
    queryset = Artist.objects.all()

    def get_queryset(self):
        queryset = Artist.objects.all().order_by('-created_at')
        name = self.request.query_params.get('name', None)
        if name is not None:
            queryset = queryset.filter(name__startswith=name)
        return queryset

    def create(self, request, *args, **kwargs):
        user = Token.objects.get(key=request.data['token']).user   
        artist = Artist.objects.create(
            name=request.data['name'],
            created_by=user
        )
        if 'firstname' in request.data:
            artist.firstname=request.data['firstname']
        if 'lastname' in request.data:
            artist.lastname=request.data['lastname']
        if 'biography' in request.data:
            artist.biography=request.data['biography']
        if 'birthday' in request.data:
            artist.birthday=request.data['birthday']
        if 'gender' in request.data:
            artist.gender=request.data['gender']
        if 'avatar' in request.data:
            artist.avatar=request.data['avatar']
        if 'occupation' in request.data:
            arr = str(request.data['occupation']).split(',')
            for item in arr:
                artist.occupation.add(int(item))
        artist.save()
        serializer = ArtistSerializer(artist)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

    def update(self, request, *args, **kwargs):                         
        artist = self.get_object()                 
        user = Token.objects.get(key=request.data['token']).user
        artist.updated_by=user
        if 'name' in request.data:
            artist.name=request.data['name']
        if 'lastname' in request.data:
            artist.lastname=request.data['lastname']
        if 'firstname' in request.data:
            artist.firstname=request.data['firstname']
        if 'biography' in request.data:
            artist.biography=request.data['biography']
        if 'gender' in request.data:
            artist.gender=request.data['gender']
        if 'occupation' in request.data:          
            artist.occupation.clear()  
            arr = str(request.data['occupation']).split(',')
            for item in arr:
                check = item.isnumeric()
                if check == True:
                    artist.occupation.add(int(item))                            
        if 'birthday' in request.data:
            print(request.data['birthday'])
            artist.birthday=request.data['birthday']        
        if 'avatar' in request.data:
            artist.avatar=request.data['avatar'] 
        artist.save()
        serializer = ArtistSerializer(artist)
        headers = self.get_success_headers(serializer.data)        
        return Response(serializer.data, status=status.HTTP_200_OK, headers=headers)       

class MemberViewSet(viewsets.ModelViewSet):
    serializer_class = MemberSerializer
    queryset = Member.objects.all()

class MovieViewSet(viewsets.ModelViewSet):
    serializer_class = MovieSerializer
    queryset = Movie.objects.all()

    def get_queryset(self):
        queryset = Movie.objects.all().order_by('-created_at')
        name = self.request.query_params.get('name', None)
        genre = self.request.query_params.get('genre', None)
        order = self.request.query_params.get('order', None)
        if name is not None:
            queryset = queryset.filter(name__istartswith=name)
        if genre is not None:
            queryset = queryset.filter(genre__id=genre)
        if order is not None:
            if (order == 'created_at'):
                queryset = queryset.order_by('-created_at')
            elif (order == 'releasedate'):
                queryset = queryset.order_by('-releasedate')
            elif (order == 'duration'):
                queryset = queryset.order_by('-duration')
            elif (order == 'name'):
                queryset = queryset.order_by('name')
            elif (order == 'score'):
                queryset = queryset.order_by('-score')
            elif (order == 'views'):
                queryset = queryset.order_by('-views')
            elif (order == 'likes'):
                queryset = queryset.order_by('-likes')
        return queryset

    def create(self, request, *args, **kwargs):
        user = Token.objects.get(key=request.data['token']).user        
        json_obj = json.dumps(request.data)
        print(json_obj)   
        # movie = Movie.objects.create(
        #     name=request.data['name'],
        #     created_by=user
        # )
        # if 'description' in request.data:
        #     movie.description=request.data['description']
        # if 'plot' in request.data:
        #     movie.plot=request.data['plot']
        # if 'duration' in request.data:
        #     movie.duration=request.data['duration']
        # if 'releasedate' in request.data:
        #     movie.releasedate=request.data['releasedate']
        # if 'poster' in request.data:
        #     movie.poster=request.data['poster']
        # if 'landscape' in request.data:
        #     movie.landscape=request.data['landscape']
        # if 'rating' in request.data:
        #     arr = str(request.data['rating']).split(',')
        #     for item in arr:
        #         movie.rating.add(int(item))
        # if 'genre' in request.data:
        #     arr = str(request.data['genre']).split(',')
        #     for item in arr:
        #         movie.genre.add(int(item))     
            
        # movie.save()
        # serializer = MovieSerializer(movie)
        # headers = self.get_success_headers(serializer.data)
        # return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

    # def update(self, request, *args, **kwargs):                         
    #     artist = self.get_object()                 
    #     user = Token.objects.get(key=request.data['token']).user
    #     artist.updated_by=user
    #     if 'name' in request.data:
    #         artist.name=request.data['name']
    #     if 'lastname' in request.data:
    #         artist.lastname=request.data['lastname']
    #     if 'firstname' in request.data:
    #         artist.firstname=request.data['firstname']
    #     if 'biography' in request.data:
    #         artist.biography=request.data['biography']
    #     if 'gender' in request.data:
    #         artist.gender=request.data['gender']
    #     if 'occupation' in request.data:          
    #         artist.occupation.clear()  
    #         arr = str(request.data['occupation']).split(',')
    #         for item in arr:
    #             check = item.isnumeric()
    #             if check == True:
    #                 artist.occupation.add(int(item))                            
    #     if 'birthday' in request.data:
    #         print(request.data['birthday'])
    #         artist.birthday=request.data['birthday']        
    #     if 'avatar' in request.data:
    #         artist.avatar=request.data['avatar'] 
    #     artist.save()
    #     serializer = ArtistSerializer(artist)
    #     headers = self.get_success_headers(serializer.data)        
    #     return Response(serializer.data, status=status.HTTP_200_OK, headers=headers)  

class ReviewViewSet(viewsets.ModelViewSet):
    serializer_class = ReviewSerializer
    queryset = Review.objects.all()