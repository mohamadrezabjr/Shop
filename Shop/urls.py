from django.urls import path
from . import views
from Profile.views import ResetPassword
urlpatterns = [
    path ('' , views.index, name='index'),
    path('categories/', views.categories, name='categories'),
    path ('products/', views.products, name='products'),
    path ('products/<str:token>/' , views.details, name='detail'),
    # path ('products/add_to_cart/<str:token>' , views.add_cart, name='add_to_cart'),
    path ('logout/' , views.logout_view, name='log_out'),

    path ('cart/' ,views.cart, name='cart'),
    path('cart/add/<str:token>/', views.add_to_cart, name='add_to_cart'),
    path ('register/' ,views.register,name = 'register' ),
    path ('categories/<str:name>/', views.category_products, name='category_products'),
    path ('checkout/' , views.checkout, name='checkout'),
    path ('search/' , views.search, name='search'),
    path ('test/' , views.test),
    path ('password_reset/' ,ResetPassword.as_view() , name='password_reset' ),

 ]