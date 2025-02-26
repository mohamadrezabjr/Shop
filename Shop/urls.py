from django.urls import path
from . import views

urlpatterns = [
    path ('' , views.index, name='index'),
    path('products', views.categories, name='products'),
    path ('products/purchase/<str:token>' , views.details, name='purchase'),
    path ('logout/' , views.logout_view, name='log_out'),
    path ('products/purchase/add_to_cart/<str:token>' , views.add_cart, name='add_to_cart'),
    path ('cart/' ,views.cart, name='cart'),
    path ('register/' ,views.register,name = 'register' ),
    path ('products/category/<str:name>', views.product, name='category'),
    path ('checkout/' , views.checkout, name='checkout'),
    path ('test/' , views.test)

 ]