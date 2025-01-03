from django.db import models
from django.contrib.auth.models import User

class Product(models.Model):

    name = models.CharField(max_length=100)
    price = models.FloatField()
    condition = models.BooleanField(default=True)
    image = models.ImageField(null =True , blank=True)
    description = models.TextField(null=True, blank=True)
    extra_details = models.TextField(null=True, blank=True, default=None)
    def __str__(self):
        return self.name
class Cart(models.Model):

    name = models.CharField(max_length=100)
    price = models.FloatField()
    num = models.IntegerField(default=1)
    condition = models.BooleanField(default=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE)

    def __str__(self):
        return self.name

# Create your models here.
