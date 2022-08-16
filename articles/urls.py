from .views import CategoryViewSet, ArticleViewSet

from rest_framework.routers import DefaultRouter


router = DefaultRouter()
router.register(r'categories', CategoryViewSet, basename='categories')
router.register(r'articles', ArticleViewSet, basename='articles')
urlpatterns = router.urls
