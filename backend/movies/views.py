import json
from rest_framework import status
from rest_framework.response import Response
from rest_framework.authtoken.models import Token
from .models import Genre, Rating, Production, Occupation, Score, Comment, Review, Artist, Member, Actor, Movie, Film, TempFilm, Series
from .serializers import (
    GenreSerializer, RatingSerializer, ProductionSerializer, OccupationSerializer, 
    ScoreSerializer, CommentSerializer, ReviewSerializer, ArtistSerializer, 
    MemberSerializer, ActorSerializer, MovieSerializer, FilmSerializer, TempFilmSerializer, SeriesSerializer
)
from rest_framework import viewsets, filters
from rest_framework.generics import ListCreateAPIView, RetrieveAPIView, CreateAPIView, DestroyAPIView, UpdateAPIView
from django_filters.rest_framework import DjangoFilterBackend
from django_filters import FilterSet
from django.db.models import Q, Count    

class GenreViewSet(viewsets.ModelViewSet):
    serializer_class = GenreSerializer
    queryset = Genre.objects.all().order_by('name')

class RatingViewSet(viewsets.ModelViewSet):
    serializer_class = RatingSerializer
    queryset = Rating.objects.all().order_by('name')

class ProductionViewSet(viewsets.ModelViewSet):
    serializer_class = ProductionSerializer
    queryset = Production.objects.all().order_by('name')

class OccupationViewSet(viewsets.ModelViewSet):
    serializer_class = OccupationSerializer
    queryset = Occupation.objects.all().order_by('name')

class ScoreViewSet(viewsets.ModelViewSet):
    serializer_class = ScoreSerializer
    queryset = Score.objects.all()

class CommentViewSet(viewsets.ModelViewSet):
    serializer_class = CommentSerializer
    queryset = Comment.objects.all()  

    def get_queryset(self):
        queryset = Comment.objects.all().order_by('-created_at')        
        movie = self.request.query_params.get('movie', None)
        review = self.request.query_params.get('review', None)
        if movie is not None:
            movie_obj = Movie.objects.get(id=movie)
            queryset = movie_obj.comments.all().annotate(likes_count=Count('likes')).order_by('-likes_count', '-created_at')
        if review is not None:
            review_obj = Review.objects.get(id=review)
            queryset = review_obj.comments.all().annotate(likes_count=Count('likes')).order_by('-likes_count', '-created_at')
        return queryset


    def create(self, request, *args, **kwargs):
        user = Token.objects.get(key=request.data['token']).user   
        text = request.data['comment']
        comment = Comment.objects.create(
            user=user,
            comment=text
        )
        if 'movie' in request.data:
            movie = Movie.objects.get(id=int(request.data['movie']))
            movie.comments.add(comment)
            movie.save()
            score_obj = movie.scores.filter(user=user).first()
            if score_obj is not None:
                comment.score = score_obj.score
        if 'review' in request.data:
            review = Review.objects.get(id=int(request.data['review']))
            review.comments.add(comment)
            review.save()
        comment.save()
        serializer = CommentSerializer(comment)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

    def update(self, request, *args, **kwargs):                         
        comment = self.get_object()                 
        user = Token.objects.get(key=request.data['token']).user
        if 'comment' in request.data:
            comment.comment = request.data['comment']
        if 'like' in request.data:
            if user in comment.likes.all():
                comment.likes.remove(user)
            else:            
                comment.likes.add(user)
        if 'dislike' in request.data:
            if user in comment.dislikes.all():
                comment.dislikes.remove(user)
            else:            
                comment.dislikes.add(user)
        comment.save()
        serializer = CommentSerializer(comment)
        headers = self.get_success_headers(serializer.data)        
        return Response(serializer.data, status=status.HTTP_200_OK, headers=headers)       

class ReviewViewSet(viewsets.ModelViewSet):
    serializer_class = ReviewSerializer
    queryset = Review.objects.all().order_by('-created_at')

    def get_queryset(self):
        queryset = Review.objects.all().order_by('-created_at') 
        title = self.request.query_params.get('title', None)       
        order = self.request.query_params.get('order', None)
        if title is not None:
            queryset = queryset.filter(title__icontains=title)
        if order is not None:
            if (order == 'created_at'):
                queryset = queryset.order_by('-created_at')
            elif (order == 'title'):
                queryset = queryset.order_by('title')
            elif (order == 'views'):
                queryset = queryset.order_by('-views')
            elif (order == 'likes'):
                queryset = queryset.annotate(likes_count=Count('likes')).order_by('-likes_count')
            elif (order == 'dislikes'):
                queryset = queryset.annotate(dislikes_count=Count('dislikes')).order_by('-dislikes_count')
            elif (order == 'comments'):
                queryset = queryset.annotate(comments_count=Count('comments')).order_by('-comments_count')
        return queryset

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        instance.views = instance.views + 1        
        instance.save()
        serializer = self.get_serializer(instance)
        return Response(serializer.data)

    def create(self, request, *args, **kwargs):
        user = Token.objects.get(key=request.data['token']).user   
        title = request.data['title']
        content = request.data['content']
        thumbnail = request.data['thumbnail']
        review = Review.objects.create(
            user=user,
            title=title,
            thumbnail=thumbnail,
            content=content
        )
        if 'movie' in request.data:
            movie = Movie.objects.get(id=int(request.data['movie']))
            review.movie = movie
        if 'score' in request.data:
            review.score = int(request.data['score'])
        review.save()
        serializer = ReviewSerializer(review)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

    def update(self, request, *args, **kwargs):                         
        review = self.get_object()                 
        user = Token.objects.get(key=request.data['token']).user
        if 'title' in request.data:
            review.title = request.data['title']
        if 'thumbnail' in request.data:
            review.thumbnail = request.data['thumbnail']
        if 'content' in request.data:
            review.content = request.data['content']
        if 'score' in request.data:
            review.score = request.data['score']
        if 'movie' in request.data:
            movie = Movie.objects.get(id=int(request.data['movie']))
            review.movie = movie
        if 'like' in request.data:
            if user in review.likes.all():
                review.likes.remove(user)
            else:            
                review.likes.add(user)
        if 'dislike' in request.data:
            if user in review.dislikes.all():
                review.dislikes.remove(user)
            else:            
                review.dislikes.add(user)
        review.save()
        serializer = ReviewSerializer(review)
        headers = self.get_success_headers(serializer.data)        
        return Response(serializer.data, status=status.HTTP_200_OK, headers=headers)       

class ArtistViewSet(viewsets.ModelViewSet):
    serializer_class = ArtistSerializer
    queryset = Artist.objects.all().order_by('-created_at')

    def get_queryset(self):
        queryset = Artist.objects.all().order_by('-created_at')        
        name = self.request.query_params.get('name', None)
        occupation = self.request.query_params.get('occupation', None)
        order = self.request.query_params.get('order', None)
        if name is not None:
            queryset = queryset.filter(name__icontains=name)
        if occupation is not None:
            queryset = queryset.filter(occupation__id=occupation)
        if order is not None:
            if (order == 'created_at'):
                queryset = queryset.order_by('-created_at')
            elif (order == 'birthday'):
                queryset = queryset.order_by('-birthday')
            elif (order == 'name'):
                queryset = queryset.order_by('name')
            elif (order == 'views'):
                queryset = queryset.order_by('-views')
            elif (order == 'likes'):
                queryset = queryset.order_by('-likes')
            elif (order == 'follows'):
                queryset = queryset.order_by('-follows')
        return queryset

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        instance.views = instance.views + 1        
        instance.save()
        serializer = self.get_serializer(instance)
        return Response(serializer.data)

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
            artist.birthday=request.data['birthday']        
        if 'avatar' in request.data:
            artist.avatar=request.data['avatar']         
            profile.save()        
        artist.save()
        serializer = ArtistSerializer(artist)
        headers = self.get_success_headers(serializer.data)        
        return Response(serializer.data, status=status.HTTP_200_OK, headers=headers)       

class MemberViewSet(viewsets.ModelViewSet):
    serializer_class = MemberSerializer
    queryset = Member.objects.all().order_by('artist__id')  

class ActorViewSet(viewsets.ModelViewSet):
    serializer_class = ActorSerializer
    queryset = Actor.objects.all().order_by('artist__id') 

class MovieViewSet(viewsets.ModelViewSet):
    serializer_class = MovieSerializer
    queryset = Movie.objects.all().order_by('-created_at')

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
        queryset = filterMovies(queryset, name, genre, yearfrom, yearto, member, actor, user, state, order)
        return queryset

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        instance.movie.views = instance.movie.views + 1                
        instance.movie.save()
        serializer = self.get_serializer(instance)
        return Response(serializer.data)

    # def create(self, request, *args, **kwargs):                     
    #     movie = createMovie(request)
    #     film = Film.objects.create(movie=movie)
    #     serializer = FilmSerializer(film)
    #     headers = self.get_success_headers(serializer.data)
    #     return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

    # def update(self, request, *args, **kwargs):                         
    #     film = self.get_object()                         
    #     updateMovie(film.movie, request)
    #     film.save()
    #     serializer = FilmSerializer(film)
    #     headers = self.get_success_headers(serializer.data)        
    #     return Response(serializer.data, status=status.HTTP_200_OK, headers=headers)

class TempFilmViewSet(viewsets.ModelViewSet):
    serializer_class = TempFilmSerializer
    queryset = TempFilm.objects.all().order_by('-movie__created_at')

    def get_queryset(self):        
        queryset = TempFilm.objects.all().order_by('-movie__created_at')
        filmid = self.request.query_params.get('filmid', None)
        if filmid is not None:
            if filmid == 0:
                queryset = TempFilm.objects.filter(filmid=0).order_by('movie__created_at')        
            else:
                queryset = TempFilm.objects.filter(~Q(filmid=0)).order_by('movie__created_at')        
        return queryset

    def create(self, request, *args, **kwargs):                             
        movie = createMovie(request)        
        tempfilm = TempFilm.objects.create(movie=movie)
        if 'filmid' in request.data:
            tempfilm.filmid = int(request.data['filmid'])
            tempfilm.save()
        serializer = TempFilmSerializer(tempfilm)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

    def update(self, request, *args, **kwargs):                         
        tempfilm = self.get_object()         
        print(request.data)        
        if 'accept' in request.data:
            if tempfilm.filmid == 0:
                film = Film.objects.create(movie=tempfilm.movie)        
                TempFilm.objects.filter(id=tempfilm.id).delete()
                return Response(status=status.HTTP_200_OK)
            else:
                film = Film.objects.get(id=tempfilm.filmid)                
                film.movie = tempfilm.movie
                film.save()
                return Response(status=status.HTTP_200_OK)                
        return Response(status=status.HTTP_400_BAD_REQUEST)
 
class SeriesViewSet(viewsets.ModelViewSet):
    serializer_class = SeriesSerializer
    queryset = Series.objects.all()

def calculateScore(item):
    total = 0
    if (item.scores.count() == 0):
        return 0
    for obj in item.scores.all():
        total = total + obj.score
    average = int((total * 10) / item.scores.count())
    return average

def filterMovies(queryset, name, genre, yearfrom, yearto, member, actor, user, state, order):
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

def createMovie(request):
    user = Token.objects.get(key=request.data['token']).user                      
    movie = Movie.objects.create(
        name=request.data['name'],
        created_by=user
    )
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
    if 'description' in request.data: 
        movie.description=request.data['description']
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
    if 'poster' in request.data:
        movie.poster=request.data['poster']
    if 'landscape' in request.data:
        movie.landscape=request.data['landscape']        
    if 'rating' in request.data:            
        rating = Rating.objects.get(id=int(request.data['rating']))
        movie.rating=rating   
    if 'genre' in request.data:            
        genres = request.data['genre'].split(",")
        for item in genres:
            movie.genre.add(int(item))     
    movie.save()
    return movie

def updateMovie(movie, request):
    user = Token.objects.get(key=request.data['token']).user  
    movie.updated_by=user
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
        movie.is_released=request.data['is_released']
    if 'is_playing' in request.data:
        movie.is_playing=request.data['is_playing']
    if 'rating' in request.data:            
        rating = Rating.objects.get(id=int(request.data['rating']))
        movie.rating=rating   
    if 'genre' in request.data:           
        movie.genre.clear()   
        for item in request.data['genre']:
            movie.genre.add(int(item))             
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
                user_score.delete()
            else:
                user_score.score = score
                user_score.save()
        movie.score = calculateMovieScore(movie)        
    if 'artist' in request.data:
        artist = Artist.objects.get(id=int(request.data['artist']))
        if 'role' in request.data:                
            role = int(request.data['role'])
            member = Member.objects.filter(artist=artist, role__id=role).first()                 
            if member is None:
                member = Member.objects.create(
                    artist=artist,
                    role=Occupation.objects.get(id=role)
                )
            if member not in movie.members.all():                                        
                movie.members.add(member)                
        if 'role_name' in request.data:
            actor = movie.actors.filter(artist=artist).first()
            if actor is None:
                actor, created = Actor.objects.get_or_create(artist=artist, role_name=request.data['role_name'])
                movie.actors.add(actor)
            else:
                actor.role_name=request.data['role_name']       
                actor.save()             
    movie.save()
    return movie