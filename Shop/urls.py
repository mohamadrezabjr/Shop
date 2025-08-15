from django.urls import path
from . import views
from Profile.views import ResetPassword
urlpatterns = [
    path ('' , views.index, name='index'),

    path ('products/', views.products, name='products'),
    path ('products/<str:token>/' , views.details, name='detail'),
    path('products/<str:token>/make_review/' , views.make_review, name='make_review'),
    path('categories/', views.categories, name='categories'),
    path('categories/<str:name>/', views.category_products, name='category_products'),

    #Auth
    path ('register/' ,views.register,name = 'register' ),
    path ('logout/' , views.logout_view, name='log_out'),
    path('check-username/', views.check_username, name='check_username'),
    path('password_reset/', ResetPassword.as_view(), name='password_reset'),

    path ('cart/' ,views.cart, name='cart'),
    path('cart/add/<str:token>/', views.add_to_cart, name='add_to_cart'),

    path ('checkout/' , views.checkout, name='checkout'),
 ]