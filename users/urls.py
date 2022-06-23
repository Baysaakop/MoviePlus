from rest_framework.routers import DefaultRouter
from .views import CustomUserViewSet

router = DefaultRouter()
router.register(r'', CustomUserViewSet, basename='users')
urlpatterns = router.urls
