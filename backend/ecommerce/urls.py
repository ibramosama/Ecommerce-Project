from django.conf.urls.static import static
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

from djangoProject4 import settings
from .views import (
    UserViewSet,
    ProductViewSet,
    CategoryViewSet,
    OrderViewSet,
    UserRegistrationAPIView,
    UserLoginAPIView,
    ProductSearchAPIView,
    CategoryProductsView, CartItemViewSet, WishlistItemViewSet,
)

router = DefaultRouter()
router.register('users', UserViewSet, basename='users')
router.register('products', ProductViewSet, basename='products')
router.register('categories', CategoryViewSet, basename='categories')
router.register('orders', OrderViewSet, basename='orders')

class CartItemCreateView:
    pass

urlpatterns = [
    path('api/', include(router.urls)),
    path('api/products/', ProductViewSet.as_view({'post': 'create'}), name='create-product'),

    path('api/products/<int:pk>/', ProductViewSet.as_view({'get': 'retrieve'}), name='retrieve-product'),

    path('api/products/<int:pk>/', ProductViewSet.as_view({'put': 'update'}), name='update-product'),
    path('api/products/<int:pk>/', ProductViewSet.as_view({'delete': 'destroy'}), name='delete-product'),
    path('api/register/', UserRegistrationAPIView.as_view(), name='user-registration'),
    path('api/login/', UserLoginAPIView.as_view(), name='user-login'),
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/categories/<int:category_id>/products/', CategoryProductsView.as_view(), name='category-products'),
    path('api/products/search/', ProductSearchAPIView.as_view(), name='product-search'),
    path('users/<int:pk>/', UserViewSet.as_view({'put': 'update'}), name='user-update'),
    path('add/', CartItemViewSet.as_view({'post': 'create'}), name='add-to-cart'),
    path('api/user-cart/', CartItemViewSet.as_view({'get': 'get_user_cart'}), name='user_cart'),
    path('delete/<int:pk>/', CartItemViewSet.as_view({'delete': 'destroy'}), name='delete-from-cart'),
    path('api/wishlist-items/', WishlistItemViewSet.as_view({'post': 'create'}), name='add-to-wishlist'),
    path('api/wishlist-items/get_user_wishlist/',WishlistItemViewSet.as_view({'get': 'get_user_wishlist'}), name='get_user_wishlist'),
    path('api/wishlist-items/<int:pk>/', WishlistItemViewSet.as_view({'delete': 'destroy'}), name='delete-from-wishlist'),
    ]+ static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)