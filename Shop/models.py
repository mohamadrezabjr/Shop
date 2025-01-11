from django.db import models
from django.contrib.auth.models import User

class Category(models.Model):
    name = models.CharField(max_length=50 )
    slug = models.SlugField(max_length=50, default="", null=True, blank=True)
    def __str__(self):
        return self.name
class Product(models.Model):

    name = models.CharField(max_length=100)
    price = models.FloatField()
    condition = models.BooleanField(default=True)
    image = models.ImageField(null =True , blank=True)
    description = models.TextField(null=True, blank=True)
    extra_details = models.TextField(null=True, blank=True, default=None)
    category = models.ForeignKey(Category, on_delete=models.CASCADE, null=True, blank=True)
    slug = models.SlugField(max_length=50, default="", null=True, blank=True)
    def __str__(self):
        return self.name
class Cart(models.Model):

    product = models.ForeignKey(Product, on_delete=models.CASCADE, null=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    num = models.IntegerField(default=1)


    def __str__(self):
        return (f"{self.num} of {self.product.name}  ")

# Create your models here.
