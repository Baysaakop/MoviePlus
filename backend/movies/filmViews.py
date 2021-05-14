from django.http import Http404
from django.db.models import Q, Count    
from rest_framework import status
from rest_framework.response import Response
from rest_framework.authtoken.models import Token
from .models import Genre, Rating, Production, Occupation, Score, Comment, Review, Artist, Member, Actor, Movie, Film, TempFilm, Series
from .serializers import FilmSerializer, TempFilmSerializer
from rest_framework import viewsets

def filter(queryset, name, genre, yearfrom, yearto, member, actor, user, state, order):
    if name is not None:
        queryset = queryset.filter(movie__name__icontains=name).distinct()
    if genre is not None:
        queryset = queryset.filter(movie__genre__id=genre).distinct()
    if yearfrom is not None:
        queryset = queryset.filter(movie__releasedate__year__gte=yearfrom).distinct()
    if yearto is not None:
        queryset = queryset.filter(movie__releasedate__year__lte=yearto).distinct()
    if member is not None:
        queryset = queryset.filter(movie__members__artist__id=member).distinct()
    if actor is not None:
        queryset = queryset.filter(movie__actors__artist__id=actor).distinct()
    if user is not None and state is not None:                         
        if state == 'like':                    
            queryset = queryset.filter(movie__likes__id=user).distinct() 
        elif state == 'check':                    
            queryset = queryset.filter(movie__checks__id=user).distinct() 
        elif state == 'watchlist':                    
            queryset = queryset.filter(movie__watchlists__id=user).distinct()  
        elif state == 'score':                    
            queryset = queryset.filter(movie__scores__user__id=user).distinct()  
    if order is not None:
        if (order == 'created_at'):
            queryset = queryset.order_by('-movie__created_at')
        elif (order == 'releasedate'):
            queryset = queryset.order_by('-movie__releasedate')
        elif (order == 'duration'):
            queryset = queryset.order_by('-movie__duration')
        elif (order == 'name'):
            queryset = queryset.order_by('movie__name')
        elif (order == 'score'):
            queryset = queryset.order_by('-movie__score')
        elif (order == 'likes'):
            queryset = queryset.annotate(likes_count=Count('movie__likes')).order_by('-likes_count')
        elif (order == 'checks'):
            queryset = queryset.annotate(checks_count=Count('movie__checks')).order_by('-checks_count')
        elif (order == 'watchlists'):
            queryset = queryset.annotate(watchlists_count=Count('movie__watchlists')).order_by('-watchlists_count')
        elif (order == 'views'):
            queryset = queryset.order_by('-movie__views')
    return queryset

def calculateScore(item):
    total = 0
    if (item.scores.count() == 0):
        return 0
    for obj in item.scores.all():
        total = total + obj.score
    average = int((total * 10) / item.scores.count())
    return average

def action(movie, request):
    user = Token.objects.get(key=request.data['token']).user          
    if 'like' in request.data:
        if user in movie.likes.all():
            movie.likes.remove(user)
        else:
            movie.likes.add(user)
    if 'check' in request.data:
        if user in movie.checks.all():
            movie.checks.remove(user)
        else:
            movie.checks.add(user)
    if 'watchlist' in request.data:
        if user in movie.watchlists.all():
            movie.watchlists.remove(user)
        else:
            movie.watchlists.add(user)
    if 'score' in request.data:
        score = int(request.data['score'])
        user_score = movie.scores.filter(user=user).first()            
        if user_score is None:
            user_score = Score.objects.create(
                user=user,
                score=score
            )
            movie.scores.add(user_score)
        else:
            if score == 0:
                movie.scores.remove(user_score)                
                Score.objects.filter(id=user_score.id).delete()
            else:
                user_score.score = score
                user_score.save()
        movie.score = calculateScore(movie)            
    movie.save()
    return movie

class FilmViewSet(viewsets.ModelViewSet):
    serializer_class = FilmSerializer
    queryset = Film.objects.all()

    def get_queryset(self):
        queryset = Film.objects.all().order_by('-movie__created_at')
        name = self.request.query_params.get('name', None)
        genre = self.request.query_params.get('genre', None)
        yearfrom = self.request.query_params.get('yearfrom', None)
        yearto = self.request.query_params.get('yearto', None)        
        member = self.request.query_params.get('member', None)
        actor = self.request.query_params.get('actor', None)
        user = self.request.query_params.get('user', None)                
        state = self.request.query_params.get('state', None)
        order = self.request.query_params.get('order', None)
        queryset = filter(queryset, name, genre, yearfrom, yearto, member, actor, user, state, order)
        return queryset

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        instance.movie.views = instance.movie.views + 1                
        instance.movie.save()
        serializer = self.get_serializer(instance)
        return Response(serializer.data)

    def update(self, request, *args, **kwargs):                         
        film = self.get_object()                         
        action(film.movie, request)          
        serializer = FilmSerializer(film)
        headers = self.get_success_headers(serializer.data)        
        return Response(serializer.data, status=status.HTTP_200_OK, headers=headers)

    def destroy(self, request, *args, **kwargs):
        try:
            instance = self.get_object()
            movie = instance.movie
            self.perform_destroy(instance)
            Movie.objects.filter(id=movie.id).delete()
        except Http404:
            pass
        return Response(status=status.HTTP_204_NO_CONTENT)

class TempFilmViewSet(viewsets.ModelViewSet):
    serializer_class = TempFilmSerializer
    queryset = TempFilm.objects.all().order_by('-movie__created_at')

    def get_queryset(self):        
        queryset = TempFilm.objects.all().order_by('-movie__created_at')
        filmid = self.request.query_params.get('filmid', None)
        if filmid is not None:                       
            if filmid == '0':
                queryset = TempFilm.objects.filter(filmid=0).order_by('movie__created_at')        
            else:
                queryset = TempFilm.objects.filter(~Q(filmid=0)).order_by('movie__created_at')        
        return queryset

    def create(self, request, *args, **kwargs):       
        user = Token.objects.get(key=request.data['token']).user                   
        tempfilm = None             
        # CREATE                        
        if 'filmid' not in request.data:                        
            movie = Movie.objects.create(
                name=request.data['name'],
                created_by=user
            )
            updateMovie(movie, request)                  
            tempfilm = TempFilm.objects.create(movie=movie)
        # UPDATE
        else:                 
            film = Film.objects.get(pk=int(request.data['filmid']))
            movie = Movie.objects.create(
                name=film.movie.name,               
                updated_by=user                
            )
            copyMovie(movie, film.movie)            
            updateMovie(movie, request)
            tempfilm = TempFilm.objects.create(movie=movie, filmid=film.id)
        serializer = TempFilmSerializer(tempfilm)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

    def update(self, request, *args, **kwargs):                         
        tempfilm = self.get_object()                 
        if 'accept' in request.data:
            # CREATE
            if tempfilm.filmid == 0:
                film = Film.objects.create(movie=tempfilm.movie)        
                TempFilm.objects.filter(id=tempfilm.id).delete()
                return Response(status=status.HTTP_200_OK)
            # UPDATE
            else:
                film = Film.objects.get(pk=tempfilm.filmid)   
                film.movie.name=tempfilm.movie.name
                film.movie.updated_by=tempfilm.movie.updated_by                         
                copyMovie(film.movie, tempfilm.movie)                                             
                TempFilm.objects.filter(id=tempfilm.id).delete()
                Movie.objects.filter(id=tempfilm.movie.id).delete()                
                return Response(status=status.HTTP_200_OK)      
        elif 'decline' in request.data:
            TempFilm.objects.filter(id=tempfilm.id).delete()
            Movie.objects.filter(id=tempfilm.movie.id).delete()    
            return Response(status=status.HTTP_200_OK)         
        return Response(status=status.HTTP_400_BAD_REQUEST)

def updateMovie(movie, request):    
    if 'name' in request.data:
        movie.name=request.data['name']
    if 'description' in request.data:
        movie.description=request.data['description']
    if 'plot' in request.data:
        movie.plot=request.data['plot']
    if 'duration' in request.data:
        movie.duration=request.data['duration']
    if 'releasedate' in request.data:
        movie.releasedate=request.data['releasedate']
    if 'trailer' in request.data:
        movie.trailer=request.data['trailer']
    if 'poster' in request.data:
        movie.poster=request.data['poster']
    if 'landscape' in request.data:
        movie.landscape=request.data['landscape']
    if 'is_released' in request.data:
        if request.data['is_released'] == "true":
            movie.is_released=True
        else:
            movie.is_released=False
    if 'is_playing' in request.data:
        if request.data['is_playing'] == "true":
            movie.is_playing=True
        else:
            movie.is_playing=False
    if 'rating' in request.data:            
        rating = Rating.objects.get(id=int(request.data['rating']))
        movie.rating=rating   
    if 'genre' in request.data:           
        movie.genre.clear()   
        genres = request.data['genre'].split(",")
        for item in genres:
            movie.genre.add(int(item))        
    if 'cast' in request.data:        
        movie.actors.clear()
        actors = request.data['cast']
        for actor in actors:
            artist = actor['artist'] 
            role_name = actor['role_name']
            artist_obj = Artist.objects.get(pk=int(artist['id']))
            actor_obj, created = Actor.objects.get_or_create(artist=artist_obj, role_name=role_name)
            movie.actors.add(actor_obj)
    if 'crew' in request.data:        
        movie.members.clear()
        members = request.data['crew']
        for member in members:
            artist = member['artist'] 
            roles = member['role']
            artist_obj = Artist.objects.get(pk=int(artist['id']))
            artist_members = Member.objects.filter(artist=artist_obj)
            target = None
            if (artist_members.count() > 0):
                for m in artist_members:               
                    if (compareRoles(m.role, roles)) == True:
                        target = m                
            if target is None:
                target = Member.objects.create(artist=artist_obj)
                for role in roles:
                    occupation = Occupation.objects.get(pk=role['id'])
                    target.role.add(occupation)
            movie.members.add(target)
    movie.save()
    return movie

def copyMovie(movie, temp):
    movie.description = temp.description
    movie.plot = temp.plot
    movie.trailer = temp.trailer
    movie.duration = temp.duration
    movie.releasedate = temp.releasedate
    movie.releasedate = temp.releasedate
    movie.is_released = temp.is_released
    movie.is_playing = temp.is_playing
    movie.poster = temp.poster
    movie.landscape = temp.landscape
    movie.rating = temp.rating
    movie.genre.clear()
    for g in temp.genre.all():
        movie.genre.add(g)
    movie.production.clear()
    for p in temp.production.all():
        movie.production.add(p)
    movie.actors.clear()
    for a in temp.actors.all():
        movie.actors.add(a)
    movie.members.clear()
    for m in temp.members.all():
        movie.members.add(m)
    movie.save()
    return movie

def sortRoles(roles):
    list = roles.order_by('id')
    return list

def getRoles(roles):
    data = []
    for r in roles:                
        data.append(r['id'])
    queryset = Occupation.objects.filter(id__in=data)
    return queryset

def compareRoles(roles1, roles2):
    roles2 = getRoles(roles2)
    if (roles1.count() != roles2.count()):
        return False
    else:
        roles1 = sortRoles(roles1)
        roles2 = sortRoles(roles2)
        count = 0
        for i in range(roles1.count()):
            if (roles1[i].id == roles2[i].id):
                count=count+1
        if count == roles1.count():
            print("True")
            return True
        print("False")
        return False