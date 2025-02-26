
from django.shortcuts import render, get_object_or_404
from django.contrib.auth.models import auth
from django.contrib.auth import authenticate, logout, login
from django.shortcuts import render, redirect
from .models import *
from django.http import HttpResponse
from django.template import loader

from datetime import datetime
from .forms import *
from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth.models import User


def register(request):
    form = RegisterForm()
    if request.method == "POST":
        form = RegisterForm(request.POST)
        if form.is_valid():
            form.save()
            username = form.cleaned_data.get('username')
            password = form.cleaned_data.get('password1')
            user = authenticate(username=username, password=password)
            login(request, user)

            return redirect('index')
        else:
            return redirect('register')
    return render(request, 'registration/register.html', {'form': form})


def logout_view(request):
    logout(request)
    return redirect("/")


def index(request):
    n = 0
    if request.user.is_authenticated:

        cart = Cart.objects.filter(user=request.user, ordered=False)
        for x in cart:
            n += x.num

    context = {'user': request.user, 'n': n, }
    return render(request, 'index.html', context)


def details(request, token):
    log = False
    this_product = get_object_or_404(Product, token=token)

    n = 0
    if request.user.is_authenticated:
        log = True
        cart = Cart.objects.filter(user=request.user, ordered=False)
        for x in cart:
            n += x.num
    extra = this_product.extra_details.split('\n')
    context = {'this_product': this_product, 'n': n, 'log': log, 'extra': extra}

    return render(request, "details.html", context=context)


def add_cart(request, token):
    if request.user.is_authenticated:
        this_product = get_object_or_404(Product,token=token)
        in_cart = Cart.objects.filter(product=this_product, user=request.user)

        if in_cart.exists() and in_cart.last().ordered == False:
            in_cart = in_cart.last()
            in_cart.num += 1
            in_cart.save()
            return redirect('purchase', token=token)
        else:
            cart_object = Cart.objects.create(user=request.user, product=this_product)
            cart_object.save()
            return redirect('purchase', token=token)
    else:
        return redirect('login')


def cart(request):
    if request.method == 'POST':
        this_cart = Cart.objects.filter(id=request.POST['id']).first()
        if this_cart.num > 1:
            this_cart.num -= 1
            this_cart.save()
        else:
            this_cart.delete()
        return redirect('cart')

    total = 0

    if request.user.is_authenticated:
        cart = Cart.objects.filter(user=request.user, ordered=False)
        for x in cart:
            total += x.num * x.product.price

        context = {'cart': cart, 'all': total, }
        return render(request, 'cart.html', context)


def categories(request):
    category = Category.objects.all()
    n = 0
    if request.user.is_authenticated:

        cart = Cart.objects.filter(user=request.user, ordered=False)
        for x in cart:
            n += x.num
    context = {'category': category, 'n': n}
    return render(request, 'categories.html', context)


def product(request, name):
    category = Category.objects.get(name=name)
    products = Product.objects.filter(category=category)
    n = 0
    if request.user.is_authenticated:
        cart = Cart.objects.filter(user=request.user, ordered=False)
        for x in cart:
            n += x.num
    context = {'products': products, 'category': category, 'n': n}
    return render(request, 'products.html', context)


def checkout(request):
    total = 0
    products = Cart.objects.filter(user=request.user, ordered=False)
    for x in products:
        total += x.num * x.product.price
    if request.method == 'POST':
        order = Order.objects.create(user=request.user, address=request.POST['address'],
                                     city=request.POST['city'], number=request.POST['number'], price=total)
        order.products.set(products)
        for y in products:
            y.ordered = True
            y.save()
        order.save()
        return redirect('index')

    context = {'total': total, 'products': products}
    return render(request, 'checkout.html', context)


def test(request):
    return render(request, 'test.html')
# TODO
# 1- register +
# 2- profile
# 3- discount
# 4- more images for details
# 5- admin panel *
# 6- in order
# 7- ordered *
