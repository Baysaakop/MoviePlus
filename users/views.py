from urllib import response
from rest_framework import viewsets, status
from rest_framework.response import Response
from allauth.socialaccount.providers.facebook.views import FacebookOAuth2Adapter
from allauth.socialaccount.providers.google.views import GoogleOAuth2Adapter
from dj_rest_auth.registration.views import SocialLoginView
from allauth.socialaccount.providers.oauth2.client import OAuth2Client

from movies.models import Movie

from .serializers import CustomUserSerializer, MovieLogSerializer, CustomUserDetailSerializer
from .models import CustomUser, MovieLog


class CustomUserViewSet(viewsets.ModelViewSet):
    serializer_class = CustomUserSerializer
    queryset = CustomUser.objects.all().order_by('id')

    def update(self, request, *args, **kwargs):
        customuser = self.get_object()
        if 'username' in request.data:
            customuser.username = request.data['username']
        if 'biography' in request.data:
            customuser.biography = request.data['biography']
        if 'website' in request.data:
            customuser.website = request.data['website']
        if 'facebook' in request.data:
            customuser.facebook = request.data['facebook']
        if 'instagram' in request.data:
            customuser.instagram = request.data['instagram']
        if 'youtube' in request.data:
            customuser.youtube = request.data['youtube']
        if 'twitter' in request.data:
            customuser.twitter = request.data['twitter']
        if 'medium' in request.data:
            customuser.medium = request.data['medium']
        if 'avatar' in request.data:
            customuser.avatar = request.data['avatar']
        if 'role' in request.data:
            customuser.role = request.data['role']
        customuser.save()
        serializer = CustomUserSerializer(customuser)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_200_OK, headers=headers)


class CustomUserDetailViewSet(viewsets.ModelViewSet):
    serializer_class = CustomUserDetailSerializer
    queryset = CustomUser.objects.all().order_by('id')

    def update(self, request, *args, **kwargs):
        customuser = self.get_object()
        if 'member' in request.data:
            member = CustomUser.objects.get(id=int(request.data['member']))
            if member in customuser.following.all():
                customuser.following.remove(member)
                member.followers.remove(customuser)
            else:
                customuser.following.add(member)
                member.followers.add(customuser)
        customuser.save()
        serializer = CustomUserDetailSerializer(customuser)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_200_OK, headers=headers)


class MovieLogViewSet(viewsets.ModelViewSet):
    serializer_class = MovieLogSerializer
    queryset = MovieLog.objects.all().order_by('-timestamp')    

    def get_queryset(self):
        queryset = MovieLog.objects.all().order_by('-timestamp')
        movie = self.request.query_params.get('movie', None)
        user = self.request.query_params.get('user', None)
        following = self.request.query_params.get('following', None)
        comment = self.request.query_params.get('comment', None)
        like = self.request.query_params.get('like', None)
        watched = self.request.query_params.get('watched', None)
        watchlist = self.request.query_params.get('watchlist', None)
        rated = self.request.query_params.get('rated', None)
        score = self.request.query_params.get('score', None)
        order = self.request.query_params.get('order', None)
        if movie is not None:
            queryset = queryset.filter(
                movie__id=int(movie)).distinct()            
        if user is not None:
            queryset = queryset.filter(
                user__id=int(user)).distinct()
        if following is not None:                        
            user = CustomUser.objects.get(id=int(following))
            queryset = queryset.filter(
                user__in=user.following.all()).distinct()
        if comment is not None: 
            queryset = queryset.exclude(comment__isnull=True).exclude(comment__exact='').distinct()
        if like is not None:
            queryset = queryset.filter(like=True).distinct()       
        if watched is not None:
            queryset = queryset.filter(watched=True).distinct()
        if watchlist is not None:
            queryset = queryset.filter(watchlist=True).distinct()
        if rated is not None:
            queryset = queryset.filter(score__gt=0).distinct()
        if score is not None:
            queryset = queryset.filter(score=int(score)).distinct()
        if order is not None:
            queryset = queryset.order_by(order).distinct()
        return queryset
    
    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        instance.view_count = instance.view_count + 1
        instance.save()
        serializer = self.get_serializer(instance)
        return Response(serializer.data)

    def create(self, request, *args, **kwargs):
        user = CustomUser.objects.get(id=int(request.data['user']))
        movie = Movie.objects.get(id=int(request.data['movie']))
        movieLog = MovieLog.objects.create(
            movie=movie,
            user=user            
        )
        movieLog = updateLog(movieLog, request)
        serializer = MovieLogSerializer(movieLog)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

    def update(self, request, *args, **kwargs):
        movieLog = self.get_object()        
        movieLog = updateLog(movieLog, request)        
        serializer = MovieLogSerializer(movieLog)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_200_OK, headers=headers)


def updateMovieScore(movie):
    score_list = MovieLog.objects.filter(movie=movie, score__gt=0)
    avg = 0
    if (score_list.count() < 10):
        movie.avg_score = 0
    else:
        sum = 0 
        for item in score_list:
            sum += item.score * 10
        avg = round(sum / score_list.count())
    movie.avg_score = avg    
    movie.save()


def updateUserAvgScore(user):
    score_list = MovieLog.objects.filter(user=user, score__gt=0)
    sum = 0
    avg = 0
    if score_list.count() > 0:
        for item in score_list:
            sum += item.score * 10
        avg = round(sum / score_list.count())   
    user.movies_average_score = avg
    user.save()


def updateLog(movieLog, request):
    if 'watched' in request.data:        
        if request.data['watched'] == True:
            movieLog.watched = True
            movieLog.movie.watched_count += 1
            movieLog.user.movies_watched_count += 1
            if movieLog.watchlist == True:
                movieLog.watchlist = False       
                movieLog.movie.watchlist_count -= 1
                movieLog.user.movies_watchlist_count -= 1                   
        else:
            movieLog.watched = False
            movieLog.movie.watched_count -= 1
            movieLog.user.movies_watched_count -= 1               
    if 'like' in request.data:        
        if request.data['like'] == True:
            movieLog.like = True
            movieLog.movie.like_count += 1
            movieLog.user.movies_like_count += 1
        else:
            movieLog.like = False
            movieLog.movie.like_count -= 1
            movieLog.user.movies_like_count -= 1
    if 'watchlist' in request.data:
        if request.data['watchlist'] == True:
            movieLog.watchlist = True
            movieLog.movie.watchlist_count += 1
            movieLog.user.movies_watchlist_count += 1
        else:
            movieLog.watchlist = False
            movieLog.movie.watchlist_count -= 1
            movieLog.user.movies_watchlist_count -= 1 
    if 'score' in request.data:        
        score = int(request.data['score'])
        if movieLog.score == 0 and score > 0:
            movieLog.movie.score_count += 1
            movieLog.user.movies_score_count += 1
            if movieLog.watched == False:
                movieLog.watched = True
                movieLog.movie.watched_count += 1
                movieLog.user.movies_watched_count += 1
            if movieLog.watchlist == True:
                movieLog.watchlist = False       
                movieLog.movie.watchlist_count -= 1
                movieLog.user.movies_watchlist_count -= 1               
        elif movieLog.score > 0 and score == 0:
            movieLog.movie.score_count -= 1
            movieLog.user.movies_score_count -= 1                        
        movieLog.score = score           
        movieLog.save()     
        updateMovieScore(movieLog.movie)
        updateUserAvgScore(movieLog.user)
    if 'watched_at' in request.data:
        movieLog.watched_at = request.data['watched_at']
    if 'comment' in request.data:
        movieLog.comment = request.data['comment']
    if 'spoiler_alert' in request.data:
        movieLog.spoiler_alert = request.data['spoiler_alert']        
    movieLog.movie.save()
    movieLog.user.save()
    movieLog.save()
    return movieLog


class FacebookLogin(SocialLoginView):
    adapter_class = FacebookOAuth2Adapter
    callback_url = 'http://localhost:3000/'
    client_class = OAuth2Client


class GoogleLogin(SocialLoginView):
    adapter_class = GoogleOAuth2Adapter
    callback_url = 'http://localhost:3000/'
    client_class = OAuth2Client
