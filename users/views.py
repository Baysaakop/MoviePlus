from urllib import response
from rest_framework import viewsets, status, pagination
from rest_framework.response import Response
from rest_framework.authtoken.models import Token
from allauth.socialaccount.providers.facebook.views import FacebookOAuth2Adapter
from allauth.socialaccount.providers.google.views import GoogleOAuth2Adapter
from dj_rest_auth.registration.views import SocialLoginView
from allauth.socialaccount.providers.oauth2.client import OAuth2Client

from movies.models import Movie

from .serializers import CustomUserSerializer, MovieCommentSerializer, MovieLogSerializer, CustomUserDetailSerializer
from .models import CustomUser, MovieScore, MovieComment, MovieLog


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


def calculateMovieScore(movie):
    score_list = MovieScore.objects.filter(movie=movie)
    if (score_list.count() < 10):
        movie.avg_score = 0        
    else:
        sum = 0
        for item in score_list:
            sum += item.score
        avg = round((sum / score_list.count()) * 10)
        movie.avg_score = avg
    movie.score_count = score_list.count()
    movie.save()


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
        if 'movie' in request.data:
            movie = Movie.objects.get(id=int(request.data['movie']))
            if 'like' in request.data:
                if movie in customuser.movies_like.all():
                    customuser.movies_like.remove(movie)
                    movie.like_count -= 1
                else:
                    customuser.movies_like.add(movie)
                    movie.like_count += 1
                    ## add to watched
                    # if movie not in customuser.movies_watched.all():
                    #     customuser.movies_watched.add(movie)
                    #     movie.watched_count += 1
            if 'watched' in request.data:
                if movie in customuser.movies_watched.all():
                    customuser.movies_watched.remove(movie)
                    movie.watched_count -= 1
                else:
                    customuser.movies_watched.add(movie)
                    movie.watched_count += 1
                    ## remove from watchlist
                    # if movie in customuser.movies_watchlist.all():
                    #     customuser.movies_watchlist.remove(movie)
                    #     movie.watchlist_count -= 1
            if 'watchlist' in request.data:
                if movie in customuser.movies_watchlist.all():
                    customuser.movies_watchlist.remove(movie)
                    movie.watchlist_count -= 1
                else:
                    customuser.movies_watchlist.add(movie)
                    movie.watchlist_count += 1
            if 'score' in request.data:
                score = int(request.data['score'])
                exists = False
                for item in customuser.movies_rated.all():
                    if item.movie == movie:
                        exists = True
                        if score > 0:
                            # Update
                            item.score = score
                            item.save()
                        else:
                            # Delete
                            customuser.movies_rated.remove(item)
                            MovieScore.objects.filter(id=item.id).delete()
                if exists is False:
                    # Create
                    item = MovieScore.objects.create(movie=movie, score=score)
                    customuser.movies_rated.add(item)
                    ## add to watched
                    # if movie not in customuser.movies_watched.all():
                    #     customuser.movies_watched.add(movie)
                    #     movie.watched_count += 1
                # Calculate Score
                calculateMovieScore(movie)
        customuser.save()
        serializer = CustomUserDetailSerializer(customuser)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_200_OK, headers=headers)


class MovieLogViewSet(viewsets.ModelViewSet):
    serializer_class = MovieLogSerializer
    queryset = MovieLog.objects.all().order_by('-timestamp')    

    def get_queryset(self):
        queryset = MovieLog.objects.all().order_by('-like_count', '-timestamp')
        movie = self.request.query_params.get('movie', None)
        user = self.request.query_params.get('user', None)
        like = self.request.query_params.get('like', None)
        watched = self.request.query_params.get('watched', None)
        watchlist = self.request.query_params.get('watchlist', None)
        score = self.request.query_params.get('score', None)
        order = self.request.query_params.get('order', None)
        if movie is not None:
            queryset = queryset.filter(
                movie__id=int(movie)).distinct()
        if user is not None:
            print(user)
            queryset = queryset.filter(
                user__id=int(user)).distinct()
        if like is not None:
            queryset = queryset.filter(like=True).distinct()       
        if watched is not None:
            queryset = queryset.filter(watched=True).distinct()
        if watchlist is not None:
            queryset = queryset.filter(watchlist=True).distinct()
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
        user = Token.objects.get(key=request.data['token']).user
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


def updateMovieScore(movie) :
    score_list = MovieLog.object.filter(movie=movie)
    if (score_list.count() < 10):
        movie.avg_score = 0
    else:
        sum = 0 
        for item in score_list:
            sum += item.score
        avg = round((sum / score_list.count()) * 10)
        movie.avg_score = avg
    movie.score_count = score_list.count()
    movie.save()

def updateLog(movieLog, request):
    if 'watched' in request.data:        
        movieLog.watched = request.data['watched']
        if movieLog.watched == True and movieLog.watchlist == True:
            movieLog.watchlist = False        
    if 'like' in request.data:        
        movieLog.like = request.data['like']                    
    if 'watchlist' in request.data:
        movieLog.watchlist = request.data['watchlist']                
    if 'score' in request.data:
        movieLog.score = int(request.data['score'])
        if movieLog.score > 0 and movieLog.watched == False:
            movieLog.watched = True        
        updateMovieScore(movieLog.movie)
    if 'watched_at' in request.data:
        movieLog.watched_at = request.data['watched_at']
    if 'comment' in request.data:
        movieLog.comment = request.data['comment']
    if 'spoiler_alert' in request.data:
        if request.data['spoiler_alert'] == "true":
            movieLog.spoiler_alert = True
        else:
            movieLog.spoiler_alert = False

    movieLog.save()
    return movieLog

class MovieCommentPagination(pagination.PageNumberPagination):
    page_size = 80


class MovieCommentViewSet(viewsets.ModelViewSet):
    serializer_class = MovieCommentSerializer
    queryset = MovieComment.objects.all().order_by('-like_count', '-timestamp')
    pagination_class = MovieCommentPagination

    def get_queryset(self):
        queryset = MovieComment.objects.all().order_by('-like_count', '-timestamp')
        movie = self.request.query_params.get('movie', None)
        order = self.request.query_params.get('order', None)
        if movie is not None:
            queryset = queryset.filter(
                movie__id=int(movie)).distinct()
        if order is not None:
            queryset = queryset.order_by(order).distinct()
        return queryset

    def create(self, request, *args, **kwargs):
        user = Token.objects.get(key=request.data['token']).user
        movie = Movie.objects.get(id=int(request.data['movie']))
        movieComment = MovieComment.objects.create(
            movie=movie,
            user=user,
            comment=request.data['comment']
        )
        if 'parent' in request.data:
            parent = MovieComment.objects.get(id=(int(request.data['parent'])))
            parent.reply_count += 1
            movieComment.parent = parent
        if 'spoiler_alert' in request.data:
            movieComment.spoiler_alert = True
        score_obj = user.movies_rated.filter(movie=movie)
        if score_obj:
            movieComment.score = score_obj[0].score
        movieComment.save()
        serializer = MovieCommentSerializer(movieComment)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

    def update(self, request, *args, **kwargs):
        movieComment = self.get_object()
        movieComment.comment = response.data['comment']
        movieComment.save()
        serializer = MovieCommentSerializer(movieComment)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_200_OK, headers=headers)


class FacebookLogin(SocialLoginView):
    adapter_class = FacebookOAuth2Adapter
    callback_url = 'http://localhost:3000/'
    client_class = OAuth2Client


class GoogleLogin(SocialLoginView):
    adapter_class = GoogleOAuth2Adapter
    callback_url = 'http://localhost:3000/'
    client_class = OAuth2Client
