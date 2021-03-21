from .views import GenreViewSet, RatingViewSet, ProductionViewSet, OccupationViewSet, ArtistViewSet, MemberViewSet, MovieViewSet, ReviewViewSet
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register(r'genres', GenreViewSet, basename='genres')
router.register(r'ratings', RatingViewSet, basename='ratings')
router.register(r'productions', ProductionViewSet, basename='productions')
router.register(r'occupations', OccupationViewSet, basename='occupations')
router.register(r'artists', ArtistViewSet, basename='artists')
router.register(r'members', MemberViewSet, basename='members')
router.register(r'', MovieViewSet, basename='movies')
router.register(r'reviews', ReviewViewSet, basename='reviews')
urlpatterns = router.urls