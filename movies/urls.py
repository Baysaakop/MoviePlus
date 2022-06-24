from .views import GenreViewSet, RatingViewSet, ProductionViewSet, PlatformViewSet, MovieListViewSet, MovieDetailViewSet

from rest_framework.routers import DefaultRouter


router = DefaultRouter()
router.register(r'movielist', MovieListViewSet, basename='movielist')
router.register(r'moviedetail', MovieDetailViewSet, basename='moviedetail')
router.register(r'genres', GenreViewSet, basename='genres')
router.register(r'ratings', RatingViewSet, basename='ratings')
router.register(r'productions', ProductionViewSet, basename='productions')
router.register(r'platforms', PlatformViewSet, basename='platforms')
urlpatterns = router.urls
