import json
from rest_framework import status
from rest_framework.response import Response
from rest_framework.authtoken.models import Token
from .models import Genre, Rating, Production, Occupation, Artist, Member, Movie, Series, Review, Comment, Score, Like, Check, Watchlist
from .serializers import GenreSerializer, RatingSerializer, ProductionSerializer, OccupationSerializer, ArtistSerializer, MemberSerializer, MovieSerializer, SeriesSerializer, ReviewSerializer, CommentSerializer, ScoreSerializer, LikeSerializer, CheckSerializer, WatchlistSerializer
from rest_framework import viewsets, filters
from rest_framework.generics import ListCreateAPIView, RetrieveAPIView, CreateAPIView, DestroyAPIView, UpdateAPIView
from django_filters.rest_framework import DjangoFilterBackend
from django_filters import FilterSet
from django.db.models import Q, Count

class MovieFilter(FilterSet):
    class Meta:
        model = Movie
        fields = ['name', 'genre__id']       

class GenreViewSet(viewsets.ModelViewSet):
    serializer_class = GenreSerializer
    queryset = Genre.objects.all().order_by('name')
    filter_backends = [filters.SearchFilter]
    search_fields = ['name']

class RatingViewSet(viewsets.ModelViewSet):
    serializer_class = RatingSerializer
    queryset = Rating.objects.all().order_by('name')
    filter_backends = [filters.SearchFilter]
    search_fields = ['name']

class ProductionViewSet(viewsets.ModelViewSet):
    serializer_class = ProductionSerializer
    queryset = Production.objects.all().order_by('name')
    filter_backends = [filters.SearchFilter]
    search_fields = ['name']

class OccupationViewSet(viewsets.ModelViewSet):
    serializer_class = OccupationSerializer
    queryset = Occupation.objects.all().order_by('name')
    filter_backends = [filters.SearchFilter]
    search_fields = ['name']

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
            elif (order == 'view_count'):
                queryset = queryset.order_by('-view_count')
            elif (order == 'like_count'):
                queryset = queryset.order_by('-like_count')
            elif (order == 'follow_count'):
                queryset = queryset.order_by('-follow_count')
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
            elif (order == 'view_count'):
                queryset = queryset.order_by('-view_count')
            elif (order == 'like_count'):
                queryset = queryset.order_by('-like_count')
        return queryset

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        instance.view_count = instance.view_count + 1        
        instance.save()
        serializer = self.get_serializer(instance)
        return Response(serializer.data)

    def create(self, request, *args, **kwargs):              
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
        if 'trailer' in request.data:
            movie.trailer=request.data['trailer']
        if 'genre' in request.data:            
            for item in request.data['genre']:
                movie.genre.add(int(item))     

        movie.save()
        serializer = MovieSerializer(movie)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

    def update(self, request, *args, **kwargs):                         
        movie = self.get_object()                         
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
        movie.save()
        serializer = MovieSerializer(movie)
        headers = self.get_success_headers(serializer.data)        
        return Response(serializer.data, status=status.HTTP_200_OK, headers=headers)

class SeriesViewSet(viewsets.ModelViewSet):
    serializer_class = SeriesSerializer
    queryset = Series.objects.all().order_by('-created_at')

    def get_queryset(self):
        queryset = Series.objects.all().order_by('-created_at')
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
            elif (order == 'view_count'):
                queryset = queryset.order_by('-view_count')
            elif (order == 'like_count'):
                queryset = queryset.order_by('-like_count')
        return queryset

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        instance.view_count = instance.view_count + 1        
        instance.save()
        serializer = self.get_serializer(instance)
        return Response(serializer.data)

    def create(self, request, *args, **kwargs):              
        user = Token.objects.get(key=request.data['token']).user                                
        series = Series.objects.create(
            name=request.data['name'],
            created_by=user
        )
        if 'description' in request.data:
            series.description=request.data['description']
        if 'plot' in request.data:
            series.plot=request.data['plot']
        if 'duration' in request.data:
            series.duration=request.data['duration']
        if 'releasedate' in request.data:
            series.releasedate=request.data['releasedate']
        if 'season_count' in request.data:
            series.season_count=request.data['season_count']
        if 'episode_count' in request.data:
            series.episode_count=request.data['episode_count']
        if 'poster' in request.data:
            series.poster=request.data['poster']
        if 'landscape' in request.data:
            series.landscape=request.data['landscape']
        if 'is_released' in request.data:
            series.is_released=request.data['is_released']
        if 'on_tv' in request.data:
            series.on_tv=request.data['on_tv']
        if 'is_finished' in request.data:
            series.is_finished=request.data['is_finished']
        if 'rating' in request.data:            
            rating = Rating.objects.get(id=int(request.data['rating']))
            series.rating=rating   
        if 'trailer' in request.data:
            series.trailer=request.data['trailer']
        if 'genre' in request.data:            
            for item in request.data['genre']:
                series.genre.add(int(item))     

        series.save()
        serializer = SeriesSerializer(series)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

    def update(self, request, *args, **kwargs):                         
        series = self.get_object()                         
        if 'description' in request.data:
            series.description=request.data['description']
        if 'plot' in request.data:
            series.plot=request.data['plot']
        if 'duration' in request.data:
            series.duration=request.data['duration']
        if 'releasedate' in request.data:
            series.releasedate=request.data['releasedate']
        if 'season_count' in request.data:
            series.season_count=request.data['season_count']
        if 'episode_count' in request.data:
            series.episode_count=request.data['episode_count']
        if 'trailer' in request.data:
            series.trailer=request.data['trailer']
        if 'poster' in request.data:
            series.poster=request.data['poster']
        if 'landscape' in request.data:
            series.landscape=request.data['landscape']
        if 'is_released' in request.data:
            series.is_released=request.data['is_released']
        if 'on_tv' in request.data:
            series.on_tv=request.data['on_tv']
        if 'is_finished' in request.data:
            series.is_finished=request.data['is_finished']
        if 'rating' in request.data:            
            rating = Rating.objects.get(id=int(request.data['rating']))
            series.rating=rating   
        if 'genre' in request.data:           
            series.genre.clear()   
            for item in request.data['genre']:
                series.genre.add(int(item))             
        series.save()
        serializer = SeriesSerializer(series)
        headers = self.get_success_headers(serializer.data)        
        return Response(serializer.data, status=status.HTTP_200_OK, headers=headers)  

class MemberViewSet(viewsets.ModelViewSet):
    serializer_class = MemberSerializer
    queryset = Member.objects.all().order_by('artist__id')

    def get_queryset(self):
        queryset = Member.objects.all().order_by('artist__id')
        artist = self.request.query_params.get('artist', None)
        movie = self.request.query_params.get('movie', None)
        series = self.request.query_params.get('series', None)        
        if artist is not None:
            queryset = queryset.filter(artist__id=artist)
        if movie is not None:
            queryset = queryset.filter(movie__id=movie) 
        if series is not None:
            queryset = queryset.filter(series__id=series)       
        return queryset

    def create(self, request, *args, **kwargs):           
        artist = Artist.objects.get(id=int(request.data['artist']))                
        role = request.data['role']
        role_name = request.data['role_name']
        member = Member.objects.create(
            artist=artist,            
            role_name=role_name
        )
        if 'movie' in request.data:
            movie = Movie.objects.get(id=int(request.data['movie']))
            member.movie = movie
        if 'series' in request.data:
            series = Series.objects.get(id=int(request.data['series']))
            member.series = series
        for r in role:
            member.role.add(r)        
        member.save()
        serializer = MemberSerializer(member)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

    def update(self, request, *args, **kwargs):                         
        member = self.get_object()      
        role = request.data['role']
        role_name = request.data['role_name']
        member.role.clear()
        for r in role:
            member.role.add(r)  
        member.role_name = role_name                 
        member.save()
        serializer = MemberSerializer(member)
        headers = self.get_success_headers(serializer.data)        
        return Response(serializer.data, status=status.HTTP_200_OK, headers=headers)       

class ReviewViewSet(viewsets.ModelViewSet):
    serializer_class = ReviewSerializer
    queryset = Review.objects.all().order_by('-created_at')

    def get_queryset(self):
        queryset = Review.objects.all().order_by('-created_at')  
        id = self.request.query_params.get('user', None)     
        if id is not None:
            queryset = queryset.filter(created_by__id=id)      
        return queryset

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        instance.views = instance.views + 1        
        instance.save()
        serializer = self.get_serializer(instance)
        return Response(serializer.data)

    def create(self, request, *args, **kwargs):       
        user = Token.objects.get(key=request.data['token']).user                                
        review = Review.objects.create(
            title=request.data['title'],
            created_by=user
        )
        if 'movie' in request.data:
            movie=Movie.objects.get(id=int(request.data['movie']))
            review.movie=movie
        if 'score' in request.data:
            review.score=int(request.data['score'])
        if 'thumbnail' in request.data:
            review.thumbnail=request.data['thumbnail']
        if 'content' in request.data:
            review.content=request.data['content']        
        review.save()
        serializer = ReviewSerializer(review)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

    def update(self, request, *args, **kwargs):                         
        review = self.get_object()                         
        if 'title' in request.data:
            review.title=request.data['title']
        if 'movie' in request.data:
            movie=Movie.objects.get(id=int(request.data['movie']))
            review.movie=movie
        if 'score' in request.data:
            review.score=int(request.data['score'])
        if 'thumbnail' in request.data:
            review.thumbnail=request.data['thumbnail']
        if 'content' in request.data:
            review.content=request.data['content']          
        if 'like' in request.data:
            user = Token.objects.get(key=request.data['token']).user
            profile = Profile.objects.get(user=user)
            is_detail = request.data['like']            
            if (is_detail == True):
                review.views = review.views - 1
            if review in profile.review_likes.all():
                profile.review_likes.remove(review)
                review.likes = review.likes - 1                
            else:
                profile.review_likes.add(review)
                review.likes = review.likes + 1
            profile.save()
        review.save()
        serializer = ReviewSerializer(review)
        headers = self.get_success_headers(serializer.data)        
        return Response(serializer.data, status=status.HTTP_200_OK, headers=headers)  

class CommentViewSet(viewsets.ModelViewSet):
    serializer_class = CommentSerializer
    queryset = Comment.objects.all().order_by('-created_at')
    
    def get_queryset(self):
        queryset = Comment.objects.all().annotate(likes_count=Count('likes')).order_by('-likes_count', '-created_at')
        movie = self.request.query_params.get('movie', None)     
        if movie is not None:
            queryset = queryset.filter(movie__id=movie)      
        return queryset

    def create(self, request, *args, **kwargs):                                            
        movie = Movie.objects.get(id=int(request.data['movie']))
        user = Token.objects.get(key=request.data['token']).user
        text = request.data['comment']
        score = 0
        score_obj = Score.objects.filter(user=user, movie=movie).first()
        if score_obj is not None:
            score = score_obj.score
        comment = Comment.objects.create(
            movie=movie,
            user=user,
            comment=text,
            score=score
        )                
        movie.comment_count = Comment.objects.filter(movie=movie).count()
        movie.save()
        serializer = CommentSerializer(comment)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

    def update(self, request, *args, **kwargs):                         
        print(request.data)
        comment = self.get_object()     
        movie = comment.movie
        if 'comment' in request.data:
            comment.comment=request.data['comment']          
        if 'like' in request.data:
            user = Token.objects.get(key=request.data['token']).user
            if user in comment.likes.all():
                comment.likes.remove(user)
            else:
                comment.likes.add(user)
        if 'dislike' in request.data:
            user = Token.objects.get(key=request.data['token']).user
            if user in comment.dislikes.all():
                comment.dislikes.remove(user)
            else:
                comment.dislikes.add(user)
        comment.save()                  
        movie.comment_count = Comment.objects.filter(movie=movie).count()
        movie.save()
        serializer = CommentSerializer(comment)
        headers = self.get_success_headers(serializer.data)        
        return Response(serializer.data, status=status.HTTP_200_OK, headers=headers)  

    def destroy(self, request, *args, **kwargs):
        comment = self.get_object()     
        movie = comment.movie
        self.perform_destroy(comment)
        movie.comment_count = Comment.objects.filter(movie=movie).count()
        movie.save()
        return Response(status=status.HTTP_204_NO_CONTENT)
        

def calculateScore(movie):
    scores = Score.objects.filter(movie=movie)
    if scores is None or scores.count() == 0:
        return 0
    else:
        total = 0
        for score in scores:
            total = total + score.score        
        return int((total * 10) / scores.count())

class ScoreViewSet(viewsets.ModelViewSet):
    serializer_class = ScoreSerializer
    queryset = Score.objects.all().order_by('-created_at')

    def get_queryset(self):
        queryset = Score.objects.all().order_by('-created_at')        
        token = self.request.query_params.get('token', None)     
        movie = self.request.query_params.get('movie', None)             
        if token is not None:
            user = Token.objects.get(key=token).user
            queryset = queryset.filter(user=user)     
        if movie is not None:            
            queryset = queryset.filter(movie__id=movie)      
        return queryset

    def create(self, request, *args, **kwargs):                                            
        movie = Movie.objects.get(id=int(request.data['movie']))
        user = Token.objects.get(key=request.data['token']).user
        score = int(request.data['score'])
        instance = Score.objects.filter(movie=movie, user=user).first()
        if instance is None:            
            instance = Score.objects.create(
                movie=movie,
                user=user,
                score=score            
            )                    
            movie.score = calculateScore(movie)        
            movie.score_count = Score.objects.filter(movie=movie).count()        
            movie.save()
            serializer = ScoreSerializer(instance)
            headers = self.get_success_headers(serializer.data)
            return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)
        else:
            if score > 0:
                instance.score = score
                instance.save()
                movie.score = calculateScore(movie)        
                movie.score_count = Score.objects.filter(movie=movie).count()        
                movie.save()
                serializer = ScoreSerializer(instance)
                headers = self.get_success_headers(serializer.data)
                return Response(serializer.data, status=status.HTTP_200_OK, headers=headers)
            else:
                self.perform_destroy(instance)
                movie.score = calculateScore(movie)        
                movie.score_count = Score.objects.filter(movie=movie).count()        
                movie.save()
                return Response(status=status.HTTP_204_NO_CONTENT)

class LikeViewSet(viewsets.ModelViewSet):
    serializer_class = LikeSerializer
    queryset = Like.objects.all().order_by('-created_at')

    def get_queryset(self):
        queryset = Like.objects.all().order_by('-created_at')        
        token = self.request.query_params.get('token', None)     
        movie = self.request.query_params.get('movie', None)             
        if token is not None:  
            user = Token.objects.get(key=token).user
            queryset = queryset.filter(user=user)        
        if movie is not None:            
            queryset = queryset.filter(movie__id=movie)      
        return queryset

    def create(self, request, *args, **kwargs):                                            
        movie = Movie.objects.get(id=int(request.data['movie']))
        user = Token.objects.get(key=request.data['token']).user
        instance = Like.objects.filter(movie=movie, user=user).first()
        if instance is None:            
            instance = Like.objects.create(
                movie=movie,
                user=user            
            )                            
            movie.like_count = Like.objects.filter(movie=movie).count()        
            movie.save()
            serializer = LikeSerializer(instance)
            headers = self.get_success_headers(serializer.data)
            return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)
        else:
            self.perform_destroy(instance)
            movie.like_count = Like.objects.filter(movie=movie).count()
            movie.save()
            return Response(status=status.HTTP_204_NO_CONTENT)

class CheckViewSet(viewsets.ModelViewSet):
    serializer_class = CheckSerializer
    queryset = Check.objects.all().order_by('-created_at')

    def get_queryset(self):
        queryset = Check.objects.all().order_by('-created_at')        
        token = self.request.query_params.get('token', None)     
        movie = self.request.query_params.get('movie', None)           
        if token is not None:  
            user = Token.objects.get(key=token).user
            queryset = queryset.filter(user=user)     
        if movie is not None:            
            queryset = queryset.filter(movie__id=movie)      
        return queryset

    def create(self, request, *args, **kwargs):                                            
        movie = Movie.objects.get(id=int(request.data['movie']))
        user = Token.objects.get(key=request.data['token']).user
        instance = Check.objects.filter(movie=movie, user=user).first()
        if instance is None:            
            instance = Check.objects.create(
                movie=movie,
                user=user            
            )                
            movie.check_count = Check.objects.filter(movie=movie).count()        
            movie.save()
            serializer = CheckSerializer(instance)
            headers = self.get_success_headers(serializer.data)
            return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)
        else:
            self.perform_destroy(instance)
            movie.check_count = Check.objects.filter(movie=movie).count()        
            movie.save()
            return Response(status=status.HTTP_204_NO_CONTENT)

class WatchlistViewSet(viewsets.ModelViewSet):
    serializer_class = WatchlistSerializer
    queryset = Watchlist.objects.all().order_by('-created_at')

    def get_queryset(self):
        queryset = Watchlist.objects.all().order_by('-created_at')        
        token = self.request.query_params.get('token', None)     
        movie = self.request.query_params.get('movie', None)             
        if token is not None:  
            user = Token.objects.get(key=token).user
            queryset = queryset.filter(user=user)             
        if movie is not None:            
            queryset = queryset.filter(movie__id=movie)      
        return queryset

    def create(self, request, *args, **kwargs):                                            
        movie = Movie.objects.get(id=int(request.data['movie']))
        user = Token.objects.get(key=request.data['token']).user
        instance = Watchlist.objects.filter(movie=movie, user=user).first()
        if instance is None:            
            instance = Watchlist.objects.create(
                movie=movie,
                user=user            
            )                
            movie.watchlist_count = Watchlist.objects.filter(movie=movie).count()        
            movie.save()
            serializer = WatchlistSerializer(instance)
            headers = self.get_success_headers(serializer.data)
            return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)
        else:
            self.perform_destroy(instance)
            movie.watchlist_count = Watchlist.objects.filter(movie=movie).count()        
            movie.save()
            return Response(status=status.HTTP_204_NO_CONTENT)