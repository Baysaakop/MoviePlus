from rest_framework.routers import DefaultRouter
from .views import CustomUserViewSet, CustomUserDetailViewSet, MovieCommentViewSet, MovieLogViewSet

router = DefaultRouter()
router.register(r'userlist', CustomUserViewSet, basename='userlist')
router.register(r'userdetail', CustomUserDetailViewSet, basename='userdetail')
router.register(r'moviecomments', MovieCommentViewSet,
                basename='moviecomments')
router.register(r'movielogs', MovieLogViewSet,
                basename='movielogs')            
urlpatterns = router.urls
