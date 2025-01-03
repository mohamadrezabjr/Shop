from django.urls import path
from . import views

urlpatterns = [
    path ('' , views.index, name='index'),
    path('products' , views.product, name='products'),
    path ('products/purchase/<int:id>' , views.details, name='purchase'),
    path ('logout/' , views.logout_view, name='log_out'),
 ]