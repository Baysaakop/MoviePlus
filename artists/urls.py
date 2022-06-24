from .views import OccupationViewSet, ArtistListViewSet, ArtistDetailViewSet, MovieCastMemberViewSet, MovieCrewMemberViewSet

from rest_framework.routers import DefaultRouter


router = DefaultRouter()
router.register(r'occupations', OccupationViewSet, basename='occupations')
router.register(r'artistlist', ArtistListViewSet, basename='artistlist')
router.register(r'artistdetail', ArtistDetailViewSet, basename='artistdetail')
router.register(r'moviecast', MovieCastMemberViewSet,
                basename='moviecast')
router.register(r'moviecrew', MovieCrewMemberViewSet,
                basename='moviecrew')
urlpatterns = router.urls
