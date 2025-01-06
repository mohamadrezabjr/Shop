from tempfile import template
from django.shortcuts import render
from django.contrib.auth.models import auth
from django.contrib.auth import authenticate , logout
from django.shortcuts import render , redirect
from .models import *
from django.http import HttpResponse
from django.template import loader
from django.views.decorators.csrf import csrf_exempt
from datetime import datetime

def logout_view(request):
    logout(request)
    return redirect('/')
def index(request):

    log= False
    n= 0
    if request.user.is_authenticated:
        log = True
        cart = Cart.objects.filter(user=request.user)

        for x in cart:
            n += x.num



    context = {'log':log ,'user':request.user, 'n':n}
    return render(request, 'index.html', context)

def product(request):
    log = False
    products = Product.objects.all()
    n= 0
    if request.user.is_authenticated:
        log = True
        cart = Cart.objects.filter(user=request.user)

        for x in cart:
            n+= x.num

    context = {'products': products , 'n':n , 'log':log}
    return render (request, 'products.html', context=context)

def details(request , id):
    log = False
    this_product = Product.objects.get(id=id)

    n = 0
    if request.user.is_authenticated:
        log = True
        cart = Cart.objects.filter(user=request.user)

        for x in cart:
            n += x.num

    context = {'this_product': this_product ,  'n':n , 'log':log}

    return render(request , "details.html", context=context)

def add_cart(request,id):

    if request.user.is_authenticated:
        this_product = Product.objects.get(id=id)
        in_cart = Cart.objects.filter(product = this_product , user = request.user)

        if in_cart.exists():
            in_cart = in_cart.first()
            in_cart.num += 1
            in_cart.save()
            return redirect('purchase', id)
        else:
            cart_object=Cart.objects.create(user = request.user, product = this_product)
            return redirect('purchase', id)
    else:
        return redirect('login')
def cart(request):

    lst = []

    if request.user.is_authenticated:
        cart = Cart.objects.filter(user=request.user)
        for x in cart:
            total = 0
            total += x.num * x.product.price
            lst.append(total)
        all_total = sum(lst)
        len_lst = range(len(lst))

        context = {'cart':cart , 'all':all_total, 'lst':lst , 'len':len_lst}
        return render(request, 'cart.html', context)

# TODO
# 1- register
# 2- profile
# 3- discount
# 4- more images for details
# 5- admin panel *
# 6- in order
# 7- ordered *