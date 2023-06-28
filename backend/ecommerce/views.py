from django.contrib.auth import get_user_model
from django.db.models import Q
from django.shortcuts import get_object_or_404
from django.template.loader import render_to_string
from rest_framework import generics, status, viewsets, permissions
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.exceptions import PermissionDenied, AuthenticationFailed
from django.conf import settings
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenObtainPairView
from django.core.mail import send_mail
from djangoProject4 import settings


from .models import User, Product, Category, Order, CartItem, WishlistItem
from .serializers import (
    UserSerializer,
    ProductSerializer,
    CategorySerializer,
    OrderSerializer,
    CartItemSerializer,
    CustomTokenObtainPairSerializer, WishlistItemSerializer, CategoryProductSerializer,
)

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer

    @action(detail=False, methods=['PUT'])
    def update_profile(self, request):
        user = request.user
        serializer = UserSerializer(user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def get_permissions(self):
        if self.action == 'update_profile':
            permission_classes = [permissions.IsAuthenticated]
        else:
            permission_classes = [permissions.AllowAny]
        return [permission() for permission in permission_classes]

class CategoryProductsView(generics.ListAPIView):
    serializer_class = ProductSerializer

    def get_queryset(self):
        category_id = self.kwargs['category_id']
        try:
            category = Category.objects.get(id=category_id)
            products = category.products.all()
            return products
        except Category.DoesNotExist:
            return []

class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer

    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            permission_classes = [permissions.AllowAny]
        else:
            permission_classes = [permissions.IsAdminUser]
        return [permission() for permission in permission_classes]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        product = serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        product = serializer.save()
        return Response(serializer.data, status=status.HTTP_200_OK)

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        self.perform_destroy(instance)
        return Response(status=status.HTTP_204_NO_CONTENT)



class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer

    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            permission_classes = [permissions.AllowAny]
        else:
            permission_classes = [permissions.IsAuthenticated]
        return [permission() for permission in permission_classes]

class OrderViewSet(viewsets.ModelViewSet):
    queryset = Order.objects.all()
    serializer_class = OrderSerializer

class UserRegistrationAPIView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.AllowAny]


class UserLoginAPIView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        user = serializer.user
        if user.blocked:
            raise AuthenticationFailed('User is blocked')  # Raise an exception if the user is blocked

        token = serializer.validated_data
        return Response(token, status=status.HTTP_200_OK)



class ProductSearchAPIView(generics.ListAPIView):
    serializer_class = CategoryProductSerializer

    def get_queryset(self):
        search_query = self.request.query_params.get('search')
        queryset = Product.objects.all()

        if search_query:
            queryset = queryset.filter(Q(title__icontains=search_query) | Q(description__icontains=search_query))

        return queryset.values()


class CartItemViewSet(viewsets.ModelViewSet):
    queryset = CartItem.objects.all()
    serializer_class = CartItemSerializer

    def perform_create(self, serializer):
        user_id = self.request.data.get('user')
        product_id = self.request.data.get('product')
        quantity = self.request.data.get('quantity')
        quantity = int(quantity)
        User = get_user_model()
        user = User.objects.get(id=user_id)
        product = Product.objects.get(id=product_id)

        total_price = product.price * quantity
        if user.is_authenticated:


            cart_item = serializer.save(user=user, product=product, quantity=quantity, total_price=total_price)

            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            raise PermissionDenied("Authentication credentials were not provided.")

    def perform_update(self, serializer):
        user_id = self.request.data.get('user')
        product_id = self.request.data.get('product')
        quantity = self.request.data.get('quantity')
        quantity = int(quantity)
        User = get_user_model()
        user = User.objects.get(id=user_id)
        product = Product.objects.get(id=product_id)

        total_price = product.price * quantity

        serializer.save(user=user, product=product, quantity=quantity, total_price=total_price)

    def perform_destroy(self, instance):
        instance.delete()
        return Response({'message': 'Cart item deleted successfully.'}, status=status.HTTP_204_NO_CONTENT)

    @action(detail=False, methods=['GET'])
    def get_user_cart(self, request):
        user_id = request.GET.get('user_id')
        user = get_object_or_404(User, id=user_id)
        cart_items = CartItem.objects.filter(user=user)
        serializer = CartItemSerializer(cart_items, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    @action(detail=False, methods=['POST'], permission_classes=[IsAuthenticated])
    def checkout(self, request):
        user = request.user
        print(user.email)
        if user.is_authenticated:
            cart_items = CartItem.objects.filter(user=user)

            email_subject = 'Your Order'
            email_body = f"Thank you for your order, {user.first_name}! Here are the items in your order:\n\n"

            for cart_item in cart_items:
                email_body += f"- {cart_item.product.title} - Quantity: {cart_item.quantity}\n"

            send_mail(email_subject, email_body, settings.EMAIL_HOST_USER, [user.email], fail_silently=False)

            cart_items.delete()
            return Response({'message': 'Checkout successful'}, status=status.HTTP_200_OK)
        else:
            return Response({'message': 'Authentication required'}, status=status.HTTP_401_UNAUTHORIZED)

class WishlistItemViewSet(viewsets.ModelViewSet):
    queryset = WishlistItem.objects.all()
    serializer_class = WishlistItemSerializer

    @action(detail=False, methods=['POST'])
    def add_to_wishlist(self, request):
        user = request.user
        product_id = request.data.get('product_id')
        if not product_id:
            return Response({'error': 'Product ID is required.'}, status=status.HTTP_400_BAD_REQUEST)

        if WishlistItem.objects.filter(user=user, product_id=product_id).exists():
            return Response({'message': 'Product is already in the wishlist.'}, status=status.HTTP_200_OK)

        wishlist_item = WishlistItem.objects.create(user=user, product_id=product_id)
        serializer = WishlistItemSerializer(wishlist_item)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    @action(detail=False, methods=['DELETE'])
    def remove_from_wishlist(self, request):
        user = request.user
        product_id = request.data.get('product_id')
        if not product_id:
            return Response({'error': 'Product ID is required.'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            wishlist_item = WishlistItem.objects.get(user=user, product_id=product_id)
        except WishlistItem.DoesNotExist:
            return Response({'message': 'Product does not exist in the wishlist.'}, status=status.HTTP_200_OK)

        wishlist_item.delete()
        return Response({'message': 'Product removed from the wishlist.'}, status=status.HTTP_204_NO_CONTENT)

    @action(detail=False, methods=['GET'])
    def get_user_wishlist(self, request):
        user_id = request.GET.get('user_id')
        user = get_object_or_404(User, id=user_id)
        wishlist_items = WishlistItem.objects.filter(user=user)
        serializer = WishlistItemSerializer(wishlist_items, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)



@api_view(['POST'])
@permission_classes([IsAdminUser])  # Allow only admin users to access this view
def block_user(request, user_id):
    try:
        user = User.objects.get(id=user_id)
        user.blocked = True
        user.save()
        return Response({'message': 'User blocked successfully'})
    except User.DoesNotExist:
        return Response({'error': 'User not found'}, status=404)