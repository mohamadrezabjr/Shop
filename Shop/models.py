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
        return '{} - {}'.format(self.name, self.category)
class Cart(models.Model):

    product = models.ForeignKey(Product, on_delete=models.CASCADE, null=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    num = models.IntegerField(default=1)
    ordered = models.BooleanField(default=False)
    def __str__(self):
        return (f"{self.num} of {self.product.name} for {self.user.username} ")


class Order(models.Model):
    status_choices = (
        ('pending', 'Pending'),
        ('confirmed', 'Confirmed'),
        ('ontheway', 'Ontheway'),
        ('canceled', 'Canceled'),
    )
    status = models.CharField(max_length=10, choices=status_choices, default='pending')
    products = models.ManyToManyField(Cart)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    address = models.TextField()
    number = models.IntegerField()
    city = models.TextField()
    price = models.FloatField()
    date = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Oreder of{self.user} is {self.status}."

# Create your models here.
