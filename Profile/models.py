from django.contrib.auth.models import User
from django.db import models

from Shop.models import Product


class Address(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    address = models.TextField()
    city = models.CharField(max_length=120)
    unit = models.IntegerField()
    postal_code = models.CharField(max_length=120, null=True, blank=True)
    save_address = models.BooleanField(default=False)

    def __str__(self):
        return f'{self.user.username} - {self.city} '

class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    phone_number = models.CharField(max_length=120,null=True, blank=True)
    address = models.ManyToManyField(Address,related_name='profile',blank=True)
    wishlist = models.ManyToManyField(Product,related_name='wishlist',blank=True)

    def __str__(self):
        return f'{self.user.username}`s profile'

# Create your models here.
