from django.urls import path
from . import views

urlpatterns = [
    path('', views.profile ,name='profile'),
    path('wishlist/toggle/<int:product_id>/', views.wishlist_toggle, name='wishlist_toggle'),
    path('order/<str:token>/', views.order_detail, name='order_detail'),
    path('order_cancel/<str:token>/', views.order_cancel, name='order_cancel'),
    path('addresses/', views.addresses, name='addresses'),
]