from rest_framework.routers import DefaultRouter
from .views import CustomUserViewSet, CustomUserDetailViewSet

router = DefaultRouter()
router.register(r'userlist', CustomUserViewSet, basename='userlist')
router.register(r'userdetail', CustomUserDetailViewSet, basename='userdetail')
urlpatterns = router.urls
