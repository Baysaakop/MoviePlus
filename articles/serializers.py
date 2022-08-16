from rest_framework import serializers
from .models import Category, Article, Tag
from users.serializers import CustomUserSerializer


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ('id', 'name', 'description')


class TagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tag
        fields = ('id', 'name')


class ArticleSerializer(serializers.ModelSerializer):
    categories = CategorySerializer(read_only=True, many=True)
    tags = TagSerializer(read_only=True, many=True)
    author = CustomUserSerializer(read_only=True)

    class Meta:
        model = Article
        fields = (
            'id', 'title', 'categories', 'tags', 'content', 'cover',
            'view_count', 'like_count', 'comment_count',
            'author', 'created_at'
        )