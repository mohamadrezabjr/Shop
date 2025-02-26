from django.contrib import admin
from .models import *

# class CategoryAdmin(admin.ModelAdmin):
#     prepopulated_fields = {"slug": ["name"]}
#
# class ProductAdmin(admin.ModelAdmin):
#     prepopulated_fields = {"slug": ["name"]}

admin.site.register(Product)
admin.site.register(Cart)
admin.site.register(Order)
admin.site.register(Category)
# Register your models here.
