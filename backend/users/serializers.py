from rest_framework import serializers
from django.contrib.auth.models import User
from django.contrib.auth.forms import PasswordResetForm
from django.conf import settings
from django.utils.translation import gettext as _
from .models import Profile, Score
from movies.serializers import MovieSerializer, ArtistSerializer

class ScoreSerializer(serializers.ModelSerializer):    
    movie = MovieSerializer(read_only=True)
    class Meta:
        model = Score
        fields = ('id', 'movie', 'score')

class ProfileSerializer(serializers.ModelSerializer):    
    scores = ScoreSerializer(many=True, read_only=True)
    likes = MovieSerializer(many=True, read_only=True)
    watched = MovieSerializer(many=True, read_only=True)
    watchlist = MovieSerializer(many=True, read_only=True)
    artist_likes = ArtistSerializer(many=True, read_only=True)
    artist_followed = ArtistSerializer(many=True, read_only=True)
    class Meta:
        model = Profile
        # fields = (
        #     'id', 'description', 'phone_number', 'birth_date', 'avatar', 'role'
        # )
        read_only_fields = ('created_at', 'updated_at', 'role')        
        exclude = ('user',)
     
class UserSerializer(serializers.ModelSerializer):
    profile = ProfileSerializer(required=False)    
    class Meta:
        model = User
        fields = (
            'id', 'username', 'email', 'first_name', 'last_name', 'profile'
        )

# class PasswordResetSerializer(serializers.Serializer):
#     email = serializers.EmailField()
#     password_reset_form_class = PasswordResetForm
#     def validate_email(self, value):
#         self.reset_form = self.password_reset_form_class(data=self.initial_data)
#         if not self.reset_form.is_valid():
#             raise serializers.ValidationError(_('Error'))

#         ###### FILTER YOUR USER MODEL ######
#         if not User.objects.filter(email=value).exists():

#             raise serializers.ValidationError(_('Invalid e-mail address'))
#         return value

#     def save(self):
#         request = self.context.get('request')
#         opts = {
#             'use_https': request.is_secure(),
#             'from_email': getattr(settings, 'DEFAULT_FROM_EMAIL'),

#             ###### USE YOUR TEXT FILE ######
#             'email_template_name': 'password_reset.txt',

#             'request': request,
#         }
#         self.reset_form.save(**opts)