from datetime import datetime
from django.db import models
from django.contrib.auth.models import User
import string ,random

def code_generator(type = 'P' , length = 7):  # Default for products

        code = type + '-'+''.join(random.choices(string.digits, k = length))
        return code


class Category(models.Model):
    name = models.CharField(max_length=50)
    slug = models.SlugField(max_length=50, default="", null=True, blank=True)
    image = models.ImageField(default='images/no_image.jpg')

    def __str__(self):
        return self.name


class Product(models.Model):
    name = models.CharField(max_length=100)
    price = models.FloatField()
    condition = models.BooleanField(default=True)
    image = models.ImageField(null=True, blank=True)
    description = models.TextField(null=True, blank=True)
    extra_details = models.TextField(null=True, blank=True, default=None)
    category = models.ForeignKey(Category, on_delete=models.CASCADE, null=True, blank=True)
    token= models.CharField( blank= True, max_length=10,null= True  )

    def save(self, *args, **kwargs):
        if not self.token:
            self.token = code_generator()
        super().save(*args, **kwargs)

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
        ('Pending', 'Pending'),
        ('Confirmed', 'Confirmed'),
        ('OnTheWay', 'OnThWway'),
        ('Canceled', 'Canceled'),
        ('Completed', 'Completed')
    )
    status = models.CharField(max_length=10, choices=status_choices, default='pending')
    products = models.ManyToManyField(Cart)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    address = models.TextField()
    number = models.IntegerField()
    city = models.TextField()
    price = models.FloatField()
    date = models.DateTimeField(default=datetime.now)
    token= models.CharField( blank= True,max_length=10,unique =True  )

    def save(self, *args, **kwargs):
        if not self.token:
            self.token = code_generator('O' , 7)
        super().save(*args, **kwargs)

    def __str__(self):
        return f"Order of {self.user} is {self.status}. -- in : {self.date.ctime()}"
