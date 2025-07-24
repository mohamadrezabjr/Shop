from django.contrib.auth.models import User
from django.db import models

class Address(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    address = models.TextField()
    city = models.CharField(max_length=120)
    unit = models.IntegerField()
    postal_code = models.CharField(max_length=120, null=True, blank=True)
    save_address = models.BooleanField(default=False)

class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    phone_number = models.CharField(max_length=120)
    address = models.ManyToManyField(Address)

# Create your models here.
