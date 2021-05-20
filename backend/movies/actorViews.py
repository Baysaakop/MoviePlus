from django.http import Http404
from django.db.models import Q, Count    
from rest_framework import status
from rest_framework.response import Response
from rest_framework.authtoken.models import Token
from .models import Artist, Actor, Film, Series, TempActor, Movie
from .serializers import ActorSerializer, TempActorSerializer
from rest_framework import viewsets

class ActorViewSet(viewsets.ModelViewSet):
    serializer_class = ActorSerializer
    queryset = Actor.objects.all().order_by('artist__id') 

    def get_queryset(self):        
        queryset = Actor.objects.all().order_by('artist__id')
        film = self.request.query_params.get('film', None)
        series = self.request.query_params.get('series', None)
        artist = self.request.query_params.get('artist', None)        
        if film is not None:                       
            queryset = Actor.objects.filter(film__id=int(film)).order_by('artist__id')    
        if series is not None:                       
            queryset = Actor.objects.filter(series__id=int(series)).order_by('artist__id')    
        if artist is not None:                       
            queryset = Actor.objects.filter(artist__id=int(artist)).order_by('artist__id')          
        return queryset

class TempActorViewSet(viewsets.ModelViewSet):
    serializer_class = TempActorSerializer
    queryset = TempActor.objects.all().order_by('artist__id') 

    def get_queryset(self):        
        queryset = TempActor.objects.all().order_by('artist__id')
        film = self.request.query_params.get('film', None)
        series = self.request.query_params.get('series', None)
        artist = self.request.query_params.get('artist', None)
        if film is not None:                       
            queryset = TempActor.objects.filter(film__id=int(film)).order_by('artist__id')   
        if series is not None:                       
            queryset = TempActor.objects.filter(series__id=int(series)).order_by('artist__id')    
        if artist is not None:                       
            queryset = TempActor.objects.filter(artist__id=int(artist)).order_by('artist__id')          
        return queryset

    def create(self, request, *args, **kwargs):                                      
        artist = Artist.objects.get(pk=int(request.data['artist']))
        role_name = str(request.data['role_name'])
        tempactor = TempActor.objects.create(
            artist=artist,
            role_name=role_name
        )        
        if 'film' in request.data:
            film = Film.objects.get(pk=int(request.data['film']))
            tempactor.film = film
            tempactor.save()
        elif 'series' in request.data:
            series = Series.objects.get(pk=int(request.data['series']))
            tempactor.series = series
            tempactor.save()
        serializer = TempActorSerializer(tempactor)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

    def update(self, request, *args, **kwargs):                         
        tempactor = self.get_object()                 
        if 'accept' in request.data:
            actor = None
            if tempactor.film is not None:
                actor, created = Actor.objects.get_or_create(artist=tempactor.artist, film=tempactor.film) 
            elif tempactor.series is not None:   
                actor, created = Actor.objects.get_or_create(artist=tempactor.artist, series=tempactor.series)
            actor.role_name = tempactor.role_name       
            actor.save()
            TempActor.objects.filter(pk=tempactor.id).delete()                  
            return Response(status=status.HTTP_200_OK)                
        elif 'decline' in request.data:
            TempActor.objects.filter(pk=tempactor.id).delete()                
            return Response(status=status.HTTP_200_OK)         
        return Response(status=status.HTTP_400_BAD_REQUEST)