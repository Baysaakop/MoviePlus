from pyexpat import model
from django.db import models
from django.conf import settings
from ckeditor.fields import RichTextField

class Category(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True, null=True)

    def __str__(self):
        return self.name


class Tag(models.Model):
    name = models.CharField(max_length=100)

    def __str__(self):
        return self.name


class Article(models.Model):
    title = models.CharField(max_length=255)
    categories = models.ManyToManyField(Category)
    tags = models.ManyToManyField(Tag)
    content = RichTextField()
    cover = models.ImageField(
        upload_to='articles/%Y/%m/%d', null=True, blank=True)
    view_count = models.IntegerField(default=0)
    like_count = models.IntegerField(default=0)
    comment_count = models.IntegerField(default=0)
    author = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, related_name='author')
    created_at = models.DateTimeField(auto_now_add=True, null=True)

    def __str__(self):
        return self.title
