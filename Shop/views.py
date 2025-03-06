from django.shortcuts import render, get_object_or_404
from django.db.models import Q
from django.contrib.auth import authenticate, logout, login
from django.shortcuts import render, redirect
from .models import *

from .forms import *

def cart_num(r):
    n = 0
    if r.user.is_authenticated:
        cart = Cart.objects.filter(user=r.user, ordered=False)
        for x in cart:
            n += x.num
    return n


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
    n = cart_num(request)
    context = {'user': request.user, 'n': n, }
    return render(request, 'index.html', context)


def products(request):
    n = cart_num(request)
    products = Product.objects.all()
    return render(request, 'products.html', {'products': products, 'n': n})


def details(request, token):

    if request.method == 'POST':
        new_num = int(request.POST['quantity'])
        if request.user.is_authenticated:
            this_product = get_object_or_404(Product, token=request.POST['token'])
            in_cart = Cart.objects.filter(product=this_product, user=request.user)

            if in_cart.exists() and in_cart.last().ordered == False:
                in_cart = in_cart.last()
                in_cart.num += new_num
                in_cart.save()
                return redirect('detail', token=token)
            else:
                cart_object = Cart.objects.create(user=request.user, product=this_product, num = new_num)
                cart_object.save()
                return redirect('detail', token=token)
        else:
            return redirect('login')

    this_product = get_object_or_404(Product, token=token)
    n = cart_num(request)
    extra = this_product.extra_details.split('\n')
    context = {'this_product': this_product, 'n': n,  'extra': extra}

    return render(request, "details.html", context=context)


def cart(request):
    if request.method == 'POST':
        this_cart = Cart.objects.filter(id=request.POST['id']).first()
        if request.POST['action'] == 'change':
            this_cart.num = request.POST['quantity']
            this_cart.save()
        elif request.POST['action'] == 'remove':
            this_cart.delete()
        return redirect('cart')

    total = 0

    if request.user.is_authenticated:
        cart = Cart.objects.filter(user=request.user, ordered=False)
        for x in cart:
            total += x.num * x.product.price

        context = {'cart': cart, 'total': total, }
        return render(request, 'cart.html', context)


def categories(request):
    category = Category.objects.all()
    n = cart_num(request)
    context = {'category': category, 'n': n}
    return render(request, 'categories.html', context)


def category_products(request, name):
    category = Category.objects.get(name=name)
    products = Product.objects.filter(category=category)
    n = cart_num(request)
    context = {'products': products, 'category': category, 'n': n}
    return render(request, 'products.html', context)


def checkout(request):
    total = 0
    products = Cart.objects.filter(user=request.user, ordered=False)
    for x in products:
        total += x.num * x.product.price
    if request.method == 'POST':
        post= request.POST
        order = Order.objects.create(user=request.user, address=post['address'],
                                     city=post['city'], number=post['number'], price=total)
        order.products.set(products)
        for y in products:
            y.ordered = True
            y.save()
        order.save()
        return redirect('index')

    context = {'total': total, 'products': products}
    return render(request, 'checkout.html', context)


def search(request):
    n = cart_num(request)
    products = []
    try:
        q = request.GET.get('q').replace(' ', '')
    except:
        q = request.GET.get('q')

    if q:
        products = Product.objects.filter(Q(name__icontains=q) | Q(description__icontains=q))

    context = {'products': products, 'n': n}

    return render(request, 'search.html', context)


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
