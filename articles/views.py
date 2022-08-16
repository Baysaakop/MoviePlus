import string
from django.db.models import Q
from rest_framework import status, pagination, viewsets
from rest_framework.response import Response
from rest_framework.authtoken.models import Token

from .models import Category, Tag, Article
from .serializers import CategorySerializer, ArticleSerializer


class CategoryViewSet(viewsets.ModelViewSet):
    serializer_class = CategorySerializer
    queryset = Category.objects.all().order_by('name')


class ArticlePagination(pagination.PageNumberPagination):
    page_size = 12


class ArticleViewSet(viewsets.ModelViewSet):
    serializer_class = ArticleSerializer
    queryset = Article.objects.all().order_by('-created_at')
    pagination_class = ArticlePagination

    def get_queryset(self):
        queryset = Article.objects.all().order_by('-created_at')
        search = self.request.query_params.get('search', None)
        category = self.request.query_params.get('category', None)
        order = self.request.query_params.get('order', None)
        if search is not None:
            queryset = queryset.filter(
                Q(title__icontains=search) |
                Q(title__icontains=string.capwords(search)) |
                Q(tags__name__icontains=search) |
                Q(tags__name__icontains=string.capwords(search))).distinct()
        if category is not None:
            queryset = queryset.filter(categories__id=category)
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
        article = Article.objects.create(
            title=request.data['title'],            
            author=user
        )
        updateArticle(article, request)
        serializer = ArticleSerializer(article)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

    def update(self, request, *args, **kwargs):
        article = self.get_object()
        updateArticle(article, request)
        serializer = ArticleSerializer(article)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_200_OK, headers=headers)


def updateArticle(article, request):
    if 'title' in request.data:
        article.title = request.data['title']
    if 'content' in request.data:
        article.content = request.data['content']
    if 'cover' in request.data:
        article.cover = request.data['cover']
    if 'categories' in request.data:
        article.categories.clear()
        arr = str(request.data['categories']).split(',')
        for item in arr:
            article.categories.add(int(item))
    if 'tags' in request.data:
        article.tags.clear()
        arr = str(request.data['tags']).split(',')
        for item in arr:
            article.tags.add(int(item))
    article.save()
    return article