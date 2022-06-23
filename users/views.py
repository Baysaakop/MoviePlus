from rest_framework import viewsets, status
from rest_framework.response import Response
from allauth.socialaccount.providers.facebook.views import FacebookOAuth2Adapter
from allauth.socialaccount.providers.google.views import GoogleOAuth2Adapter
from dj_rest_auth.registration.views import SocialLoginView
from allauth.socialaccount.providers.oauth2.client import OAuth2Client

from .serializers import CustomUserSerializer
from .models import CustomUser


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
        if 'avatar' in request.data:
            customuser.avatar = request.data['avatar']
        if 'role' in request.data:
            customuser.role = request.data['role']
        customuser.save()
        serializer = CustomUserSerializer(customuser)
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
