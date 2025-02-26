from django.urls import path
from . import views

urlpatterns = [
    path('', views.profile ,name='profile'),
    path('order/<str:token>/', views.order, name='order_detail'),
]