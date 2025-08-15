from datetime import datetime
from django.core.validators import MaxValueValidator, MinValueValidator
from django.db import models
from django.contrib.auth.models import User
import string ,random
from django_resized import ResizedImageField

def code_generator(type = 'P' , length = 7):  # Default for products
        code = type + '-'+''.join(random.choices(string.digits, k = length))
        return code

class Category(models.Model):
    name = models.CharField(max_length=50)
    description = models.TextField(null=True, blank=True)
    icon = ResizedImageField(size=[800,800], quality=85,default='images/no_image.png', upload_to='images/categories')

    def __str__(self):
        return self.name

class Image(models.Model):
    image = models.ImageField(upload_to='images/products')

    def __str__(self):
        if self.product.first():
            return f'{self.product.first().name or "product"}`s image : {self.image} '
        return f'product`s image : {self.image} '


class Product(models.Model):
    name = models.CharField(max_length=100)
    price = models.IntegerField()
    sale_price = models.IntegerField(auto_created=True, null=True, blank=True)
    date = models.DateTimeField(auto_now_add=True, null = True, blank = True)
    stock = models.IntegerField(default=5)
    condition = models.BooleanField(default=True)
    image = ResizedImageField(size=[800,800], quality=85,default='images/no_image.png',null=True, blank=True,upload_to='images/products')
    gallery_images = models.ManyToManyField(Image, related_name='product', blank=True)
    description = models.TextField(null=True, blank=True)
    extra_details = models.TextField(null=True, blank=True, default=None)
    discount = models.IntegerField(default=0, validators=[MinValueValidator(0.0), MaxValueValidator(100.0)])
    category = models.ForeignKey(Category, on_delete=models.CASCADE, null=True, blank=True)
    rating = models.FloatField(default=0)
    token= models.CharField( blank= True, max_length=10,null= True  )

    def save(self, *args, **kwargs):
        if not self.token:
            self.token = code_generator()

        self.sale_price = int(self.price - self.price * (self.discount/100))

        super().save(*args, **kwargs)

    def __str__(self):
        return '{} - {}'.format(self.name, self.category)


class ProductReview(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='reviews')
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    comment = models.TextField()
    star_choices = [
        (1, 1),
        (2, 2),
        (3, 3),
        (4, 4),
        (5, 5)
    ]
    star = models.IntegerField(choices=star_choices)

    def __str__(self):
        return f'{self.user} - {self.star} Stars'


class Cart(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE, null=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    num = models.IntegerField(default=1)
    total_price = models.IntegerField(null=True, blank=True)
    ordered = models.BooleanField(default=False)
    def save(self, *args, **kwargs):
        self.total_price = self.product.sale_price * self.num
        super().save(*args, **kwargs)
    def __str__(self):
        return (f"{self.num} of {self.product.name} for {self.user.username} ")

class Order(models.Model):
    STATUS_CHOICES = (
        ('pending', 'درحال پردازش'),
        ('confirmed', 'تایید شده'),
        ('ontheway', 'در حال ارسال'),
        ('cancelled', 'لغو شده'),
        ('completed', 'سفارش کامل شده'),
    )
    status = models.CharField(max_length=30, choices=STATUS_CHOICES, default='pending')
    products = models.ManyToManyField(Cart)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    address = models.ForeignKey('Profile.Address', on_delete=models.CASCADE)
    price = models.IntegerField()
    date = models.DateTimeField(default=datetime.now)
    phone_number = models.CharField(max_length=11, null=True, blank=True)
    notes = models.TextField(null=True, blank=True)
    token= models.CharField( blank= True,max_length=10,unique =True)

    def save(self, *args, **kwargs):
        if not self.token:
            self.token = code_generator('O' , 7)
        super().save(*args, **kwargs)

    def __str__(self):
        return f"Order of {self.user} is {self.status}. -- in : {self.date.ctime()}"
