from django.contrib import admin
from .models import *

@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    readonly_fields = ('sale_price',)

admin.site.register(Cart)
admin.site.register(Order)
admin.site.register(Category)
admin.site.register(Image)
