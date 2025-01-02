from django.db import models

class Product(models.Model):
    name = models.CharField(max_length=100)
    price = models.FloatField()
    condition = models.BooleanField(default=True)
    # image = models.ImageField(upload_to='products/')
    description = models.TextField(null=True, blank=True)
    def __str__(self):
        return self.name
# Create your models here.
