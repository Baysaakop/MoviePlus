from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from users.views import FacebookLogin, GoogleLogin

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/users/', include('users.urls')),
    path('api/movies/', include('movies.urls')),
    path('api/artists/', include('artists.urls')),
    path('api/articles/', include('articles.urls')),
    # path('accounts/', include('allauth.urls'), name='socialaccount_signup'),
    path('rest-auth/', include('dj_rest_auth.urls')),
    path('rest-auth/registration', include('dj_rest_auth.registration.urls')),
    path('rest-auth/facebook/', FacebookLogin.as_view(), name='fb_login'),
    path('rest-auth/google/', GoogleLogin.as_view(), name='google_login'),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
