from django.shortcuts import render, redirect
from Shop.models import *


def profile(request):
    if not request.user.is_authenticated:
        return redirect('login')
    order = Order.objects.filter(user=request.user).order_by('-date')

    name = request.user.username
    email = request.user.email

    context = {'order': order, 'name': name, 'email': email}
    return render (request , 'profile.html',context)


def order(request, token):
    this_order = Order.objects.get(token=token)
    cart = Cart.objects.filter(order =this_order)
    products = Product.objects.filter(cart__order= this_order)
    context = {'order': this_order, 'products': products , 'cart': cart}

    return render(request,'order.html', context)
# Create your views here.
