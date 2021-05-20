from django.http import Http404
from django.db.models import Q, Count    
from rest_framework import status
from rest_framework.response import Response
from rest_framework.authtoken.models import Token
from .models import Artist, Film, Member, Occupation, Series, TempMember, Movie
from .serializers import MemberSerializer, TempMemberSerializer
from rest_framework import viewsets

class MemberViewSet(viewsets.ModelViewSet):
    serializer_class = MemberSerializer
    queryset = Member.objects.all().order_by('artist__id') 

    def get_queryset(self):        
        queryset = Member.objects.all().order_by('artist__id')
        film = self.request.query_params.get('film', None)
        series = self.request.query_params.get('series', None)
        artist = self.request.query_params.get('artist', None)        
        if film is not None:                       
            queryset = Member.objects.filter(film__id=int(film)).order_by('artist__id') 
        if series is not None:                       
            queryset = Member.objects.filter(series__id=int(series)).order_by('artist__id')    
        if artist is not None:                       
            queryset = Member.objects.filter(artist__id=int(artist)).order_by('artist__id')          
        return queryset

class TempMemberViewSet(viewsets.ModelViewSet):
    serializer_class = TempMemberSerializer
    queryset = TempMember.objects.all().order_by('artist__id') 

    def get_queryset(self):        
        queryset = TempMember.objects.all().order_by('artist__id')
        film = self.request.query_params.get('film', None)
        series = self.request.query_params.get('series', None)
        artist = self.request.query_params.get('artist', None)        
        if film is not None:                       
            queryset = TempMember.objects.filter(film__id=int(film)).order_by('artist__id') 
        if series is not None:                       
            queryset = TempMember.objects.filter(series__id=int(series)).order_by('artist__id')    
        if artist is not None:                       
            queryset = TempMember.objects.filter(artist__id=int(artist)).order_by('artist__id')          
        return queryset

    def create(self, request, *args, **kwargs):                      
        artist = Artist.objects.get(pk=int(request.data['artist']))
        roles = request.data['role']
        tempmember = TempMember.objects.create(
            artist=artist
        )     
        if 'film' in request.data:
            film = Film.objects.get(pk=int(request.data['film']))
            tempmember.film = film
            tempmember.save()
        elif 'series' in request.data:
            series = Series.objects.get(pk=int(request.data['series']))
            tempmember.series = series
            tempmember.save()
        for role in roles:   
            role_id = role['id']
            tempmember.role.add(Occupation.objects.get(pk=int(role_id)))
        tempmember.save()
        serializer = TempMemberSerializer(tempmember)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

    def update(self, request, *args, **kwargs):                         
        tempmember = self.get_object()                 
        if 'accept' in request.data:
            member = None
            if tempmember.film is not None:
                member, created = Member.objects.get_or_create(artist=tempmember.artist, film=tempmember.film)
            elif tempmember.series is not None:
                member, created = Member.objects.get_or_create(artist=tempmember.artist, series=tempmember.series)
            member.role.clear()
            for role in tempmember.role.all():
                member.role.add(Occupation.objects.get(pk=role.id))
            member.save()
            TempMember.objects.filter(pk=tempmember.id).delete()                  
            return Response(status=status.HTTP_200_OK)      
        elif 'decline' in request.data:
            TempMember.objects.filter(pk=tempmember.id).delete()                
            return Response(status=status.HTTP_200_OK)         
        return Response(status=status.HTTP_400_BAD_REQUEST)