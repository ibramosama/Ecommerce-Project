from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

from .models import CartItem, WishlistItem
from rest_framework import serializers
from .models import User, Product, Category, Order
from django.contrib.auth.hashers import make_password
from django.contrib.auth import authenticate
from django.contrib.auth.tokens import default_token_generator
from django.core.files.base import ContentFile


class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    registration_token = serializers.SerializerMethodField(read_only=True)
    image = serializers.ImageField(write_only=True, required=False)

    def get_registration_token(self, user):
        return default_token_generator.make_token(user)

    def create(self, validated_data):
        image_data = validated_data.pop('image', None)
        validated_data['password'] = make_password(validated_data['password'])
        registration_token = validated_data.pop('registration_token', None)
        user = super().create(validated_data)
        if registration_token:
            user.registration_token = registration_token
            user.save()
        if image_data:
            image = self.get_image_from_data(image_data)
            user.image.save(image.name, image, save=True)
        return user

    def update(self, instance, validated_data):
        image_data = validated_data.pop('image', None)
        instance = super().update(instance, validated_data)
        if image_data:
            image = self.get_image_from_data(image_data)
            instance.image.save(image.name, image, save=True)
        return instance

    def get_image_from_data(self, image_data):
        image_name = image_data.name
        image_content = image_data.read()
        return ContentFile(image_content, name=image_name)

    class Meta:
        model = User
        fields = ['id', 'email', 'first_name', 'last_name', 'password', 'registration_token', 'image']


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    def get_token(cls, user):
        token = super().get_token(user)
        token['email'] = user.email
        token['is_admin'] = user.is_staff and user.is_superuser
        print(user)

        return token

class UserLoginSerializer(serializers.Serializer):
    email = serializers.EmailField(required=True)
    password = serializers.CharField(write_only=True, required=True)

    def validate(self, attrs):
        email = attrs.get('email')
        password = attrs.get('password')

        if email and password:
            user = authenticate(request=self.context.get('request'), email=email, password=password)
            if user is None:
                raise serializers.ValidationError({'non_field_errors': ['Unable to log in with provided credentials.']}, code='authorization')

            if not user.is_active:
                raise serializers.ValidationError({'non_field_errors': ['User account is disabled.']}, code='authorization')

            attrs['user'] = user
        else:
            raise serializers.ValidationError('Must include "email" and "password".', code='authorization')

        return attrs


class WishlistItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = WishlistItem
        fields = '__all__'


class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = '__all__'


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = '__all__'


class OrderSerializer(serializers.ModelSerializer):
    class Meta:
        model = Order
        fields = '__all__'


class CategoryProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = ['id', 'title', 'price', 'image_url', 'description']


class CartItemSerializer(serializers.ModelSerializer):
    total_price = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)

    class Meta:
        model = CartItem
        fields = ['id', 'user', 'product', 'quantity', 'total_price']