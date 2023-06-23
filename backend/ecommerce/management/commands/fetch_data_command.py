import requests
from django.core.management.base import BaseCommand
from ecommerce.models import Category, Product

class Command(BaseCommand):
    def handle(self, *args, **options):
        response = requests.get('https://fakestoreapi.com/products')
        if response.status_code == 200:
            data = response.json()
            category_names = set(item['category'] for item in data)
            for category_name in category_names:
                category, _ = Category.objects.get_or_create(title=category_name)
                category.save()

                products_in_category = [item for item in data if item['category'] == category_name]
                for item in products_in_category:
                    product = Product(
                        title=item['title'],
                        price=item['price'],
                        description=item['description'],
                        category=category,
                        image_url=item['image'],
                    )
                    product.save()

        self.stdout.write(self.style.SUCCESS('Successfully saved categories and products.'))
