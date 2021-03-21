from .views import UserViewSet, ScoreViewSet, ProfileViewSet
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register(r'', UserViewSet, basename='users')
router.register(r'scores', UserViewSet, basename='scores')
router.register(r'profiles', UserViewSet, basename='profiles')
urlpatterns = router.urls