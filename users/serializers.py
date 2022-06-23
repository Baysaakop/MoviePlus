from rest_framework import serializers
from django.db import transaction
from django.utils.translation import gettext as _
from dj_rest_auth.registration.serializers import RegisterSerializer
from dj_rest_auth.models import TokenModel

from .models import CustomUser


class CustomUserSerializer(serializers.ModelSerializer):

    class Meta:
        model = CustomUser
        fields = ['id', 'username', 'email', 'biography',
                  'website', 'avatar', 'role', 'created_at',
                  ]


class CustomTokenSerializer(serializers.ModelSerializer):

    user = CustomUserSerializer(read_only=True)

    class Meta:
        model = TokenModel
        fields = ('key', 'user')


class CustomRegisterSerializer(RegisterSerializer):
    username = serializers.CharField(max_length=100, required=False)
    avatar = serializers.URLField(max_length=254, required=False)

    # Define transaction.atomic to rollback the save operation in case of error
    @transaction.atomic
    def save(self, request):
        user = super().save(request)
        if (self.data.get('username') != ""):
            user.username = self.data.get('username')
        user.save()
        return user
