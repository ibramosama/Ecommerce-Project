from django.contrib import admin

from django.contrib import admin
from .models import Product
from .models import User

def block_users(modeladmin, request, queryset):
    queryset.update(blocked=True)

block_users.short_description = "Block selected users"

class UserAdmin(admin.ModelAdmin):
    list_display = ( 'email', 'blocked')
    actions = [block_users]

admin.site.register(User, UserAdmin)
admin.site.register(Product)

