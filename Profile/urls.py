from django.urls import path
from . import views

urlpatterns = [
    path('', views.profile ,name='profile'),

    path('wishlist/', views.wishlist, name='wishlist'),
    path('wishlist/remove/<int:product_id>/', views.wishlist_remove, name='wishlist_remove'),
    path('wishlist/toggle/<int:product_id>/', views.wishlist_toggle, name='wishlist_toggle'),

    path('order/<str:token>/', views.order_detail, name='order_detail'),
    path('order_cancel/<str:token>/', views.order_cancel, name='order_cancel'),

    path('addresses/', views.addresses, name='addresses'),
    path('addresses/edit/<int:address_id>/', views.address_edit, name='address_edit'),
    path('addresses/remove/<int:address_id>/', views.address_remove, name='address_remove'),
]