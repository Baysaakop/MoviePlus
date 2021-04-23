import json
from rest_framework import status
from rest_framework.response import Response
from rest_framework.authtoken.models import Token
from .models import Genre, Rating, Production, Occupation, Score, Comment, Review, Artist, Member, Actor, Movie, Series
from .serializers import GenreSerializer, RatingSerializer, ProductionSerializer, OccupationSerializer, ScoreSerializer, CommentSerializer, ReviewSerializer, ArtistSerializer, MemberSerializer, ActorSerializer, MovieSerializer, SeriesSerializer
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
        series = self.request.query_params.get('series', None)
        review = self.request.query_params.get('review', None)
        if movie is not None:
            movie_obj = Movie.objects.get(id=movie)
            queryset = movie_obj.comments.all().annotate(likes_count=Count('likes')).order_by('-likes_count', '-created_at')
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
        if 'series' in request.data:
            series = Series.objects.get(id=int(request.data['series']))
            series.comments.add(comment)
            series.save()
            score_obj = series.scores.filter(user=user).first()
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

    def get_queryset(self):
        queryset = Member.objects.all().order_by('artist__id')
        artist = self.request.query_params.get('artist', None)
        if artist is not None:
            queryset = queryset.filter(artist__id=artist)    
        return queryset

    def create(self, request, *args, **kwargs):           
        artist = Artist.objects.get(id=int(request.data['artist']))                
        role = request.data['role']
        member = Member.objects.create(
            artist=artist
        )
        for r in role:
            member.role.add(r)        
        member.save()
        serializer = MemberSerializer(member)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

    def update(self, request, *args, **kwargs):                         
        member = self.get_object()      
        role = request.data['role']
        member.role.clear()
        for r in role:
            member.role.add(r)               
        member.save()
        serializer = MemberSerializer(member)
        headers = self.get_success_headers(serializer.data)        
        return Response(serializer.data, status=status.HTTP_200_OK, headers=headers)     

class ActorViewSet(viewsets.ModelViewSet):
    serializer_class = ActorSerializer
    queryset = Actor.objects.all().order_by('artist__id')

    def get_queryset(self):
        queryset = Member.objects.all().order_by('artist__id')
        artist = self.request.query_params.get('artist', None)
        if artist is not None:
            queryset = queryset.filter(artist__id=artist)    
        return queryset

    def create(self, request, *args, **kwargs):           
        artist = Artist.objects.get(id=int(request.data['artist']))                
        role_name = request.data['role_name']
        member = Member.objects.create(
            artist=artist,
            role_name=role_name
        )
        serializer = MemberSerializer(member)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

    def update(self, request, *args, **kwargs):                         
        member = self.get_object()      
        role_name = request.data['role_name']
        member.role_name = role_name             
        member.save()
        serializer = MemberSerializer(member)
        headers = self.get_success_headers(serializer.data)        
        return Response(serializer.data, status=status.HTTP_200_OK, headers=headers)      

def calculateMovieScore(movie):
    total = 0
    if (movie.scores.count() == 0):
        return 0
    for obj in movie.scores.all():
        total = total + obj.score
    average = int((total * 10) / movie.scores.count())
    return average
        

class MovieViewSet(viewsets.ModelViewSet):
    serializer_class = MovieSerializer
    queryset = Movie.objects.all().order_by('-created_at')

    def get_queryset(self):
        queryset = Movie.objects.all().order_by('-created_at')
        name = self.request.query_params.get('name', None)
        genre = self.request.query_params.get('genre', None)
        order = self.request.query_params.get('order', None)
        if name is not None:
            queryset = queryset.filter(name__icontains=name)
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
            elif (order == 'likes'):
                queryset = queryset.order_by('-likes')
            elif (order == 'checks'):
                queryset = queryset.order_by('-checks')
            elif (order == 'watchlists'):
                queryset = queryset.order_by('-watchlists')
            elif (order == 'views'):
                queryset = queryset.order_by('-views')
        return queryset

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        instance.views = instance.views + 1        
        instance.save()
        serializer = self.get_serializer(instance)
        return Response(serializer.data)

    def create(self, request, *args, **kwargs):              
        user = Token.objects.get(key=request.data['token']).user                                
        movie = Movie.objects.create(
            name=request.data['name'],
            description=request.data['description'],
            plot=request.data['plot'],
            duration=request.data['duration'],
            releasedate=request.data['releasedate'],
            is_released=request.data['is_released'],
            in_theater=request.data['in_theater'],
            trailer=request.data['trailer'],
            created_by=user
        )
        if 'poster' in request.data:
            movie.poster=request.data['poster']
        if 'landscape' in request.data:
            movie.landscape=request.data['landscape']        
        if 'rating' in request.data:            
            rating = Rating.objects.get(id=int(request.data['rating']))
            movie.rating=rating   
        if 'genre' in request.data:            
            for item in request.data['genre']:
                movie.genre.add(int(item))     
        movie.save()
        serializer = MovieSerializer(movie)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

    def update(self, request, *args, **kwargs):                         
        movie = self.get_object()                         
        user = Token.objects.get(key=request.data['token']).user  
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
        if 'in_theater' in request.data:
            movie.in_theater=request.data['in_theater']
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
        if 'comment' in request.data:
            comment = request.data['score']
            user_comment = movie.scores.filter(user=user).first()            
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
        movie.save()
        serializer = MovieSerializer(movie)
        headers = self.get_success_headers(serializer.data)        
        return Response(serializer.data, status=status.HTTP_200_OK, headers=headers)

class SeriesViewSet(viewsets.ModelViewSet):
    serializer_class = SeriesSerializer
    queryset = Series.objects.all().order_by('-created_at')