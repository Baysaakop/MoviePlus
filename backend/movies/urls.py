from .views import GenreViewSet, RatingViewSet, ProductionViewSet, OccupationViewSet, ArtistViewSet, MemberViewSet, MovieViewSet, ReviewViewSet, CommentViewSet, ScoreViewSet, LikeViewSet, CheckViewSet, WatchlistViewSet
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register(r'genres', GenreViewSet, basename='genres')
router.register(r'ratings', RatingViewSet, basename='ratings')
router.register(r'productions', ProductionViewSet, basename='productions')
router.register(r'occupations', OccupationViewSet, basename='occupations')
router.register(r'artists', ArtistViewSet, basename='artists')
router.register(r'members', MemberViewSet, basename='members')
router.register(r'reviews', ReviewViewSet, basename='reviews')
router.register(r'comments', CommentViewSet, basename='comments')
router.register(r'scores', ScoreViewSet, basename='scores')
router.register(r'likes', LikeViewSet, basename='likes')
router.register(r'checks', CheckViewSet, basename='checks')
router.register(r'watchlists', WatchlistViewSet, basename='watchlists')
router.register(r'', MovieViewSet, basename='movies')
urlpatterns = router.urls