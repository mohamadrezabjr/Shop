from django.shortcuts import render, redirect, get_object_or_404
from Shop.models import *
from django.http import Http404

def profile(request):
    if not request.user.is_authenticated:
        return redirect('login')
    n = 0
    if request.user.is_authenticated:

        cart = Cart.objects.filter(user=request.user, ordered=False)
        for x in cart:
            n += x.num
    order = Order.objects.filter(user=request.user).order_by('-date')

    name = request.user.username
    email = request.user.email

    context = {'order': order, 'name': name, 'email': email, 'n': n}
    return render (request , 'profile.html',context)


def order(request, token):
    this_order = get_object_or_404(Order,token=token)
    if this_order.user != request.user:
        raise Http404
    cart = Cart.objects.filter(order =this_order)
    products = Product.objects.filter(cart__order= this_order)
    context = {'order': this_order, 'products': products , 'cart': cart}

    return render(request,'order.html', context)
# Create your views here.
