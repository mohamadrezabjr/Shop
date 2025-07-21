from django.contrib.staticfiles.views import serve
from django.db import IntegrityError
from django.shortcuts import render, get_object_or_404
from django.db.models import Q
from django.contrib.auth import authenticate, logout, login
from django.shortcuts import render, redirect
from .models import *
from django.contrib import messages
from .forms import *

def cart_num(r):
    n = 0
    if r.user.is_authenticated:
        cart = Cart.objects.filter(user=r.user, ordered=False)
        for x in cart:
            n += x.num
    return n


def register(request):
    if request.method == "POST":
        first_name = request.POST.get("first_name")
        last_name = request.POST.get("last_name")
        username = request.POST.get("username")
        email = request.POST.get("email")
        password = request.POST.get("password1")
        try:
            user = User.objects.create_user(username=username, email=email, first_name=first_name, last_name=last_name)
            user.set_password(password)
            user.save()
        except IntegrityError:
            messages.error(request, "نام کاربری قبلا انتخاب شده است")
        else:
            messages.success(request, "ثبت نام با موفقبت انجام شد")

    return render(request, 'registration/register.html',)


def logout_view(request):
    logout(request)
    return redirect("/")

def index(request):
    n = cart_num(request)
    products = Product.objects.all()
    categories = Category.objects.all()
    context = {"products" : products, 'n': n, "categories": categories }
    return render(request, 'index.html', context)


def products(request):
    n = cart_num(request)
    min_price = request.GET.get('min_price')
    max_price = request.GET.get('max_price')
    has_discount = request.GET.get('has_discount')
    search = request.GET.get('search')
    sort = request.GET.get('sort')

    if not min_price :
        min_price = 0
    if not max_price :
        max_price = 999999999999999

    products = Product.objects.filter(Q(price__gte=min_price, price__lte=max_price)| Q(sale_price__gte=min_price, sale_price__lte=max_price))

    if has_discount :
        products =products.filter(discount__gt= 0)
    if search :
        products = products.filter(name__icontains=search)

    # Sorting
    if sort == "price_high" :
        products = products.order_by('-sale_price')
    elif sort == "price_low":
        products = products.order_by('sale_price')
    elif sort == "newest" :
        products = products.order_by('-date')
    elif sort == "oldest" :
        products = products.order_by('date')
    return render(request, 'products.html', {'products': products, 'n': n})


def categories(request):
    category = Category.objects.all()
    n = cart_num(request)
    context = {'category': category, 'n': n}
    return render(request, 'categories.html', context)


def category_products(request, name):
    category = Category.objects.filter(name__iexact=name).first()
    if not category:
        return redirect('categories')

    products = Product.objects.filter(category=category)

    min_price = request.GET.get('min_price')
    max_price = request.GET.get('max_price')
    has_discount = request.GET.get('has_discount')
    search = request.GET.get('search')
    sort = request.GET.get('sort')
    in_stock = request.GET.get('in_stock')

    if not min_price :
        min_price = 0
    if not max_price :
        max_price = 9999999999999999
    products = products.filter(Q(price__gte=min_price, price__lte=max_price) | Q(sale_price__gte=min_price, sale_price__lte=max_price))

    if search :
        products = products.filter(name__icontains=search)

    if has_discount :
        products =products.filter(discount__gt= 0)

    if in_stock :
        products = products.filter(stock__gte=1)

    # Sorting
    if sort == "price_high" :
        products = products.order_by('-sale_price')
    elif sort == "price_low":
        products = products.order_by('sale_price')
    elif sort == "newest" :
        products = products.order_by('-date')
    elif sort == "oldest" :
        products = products.order_by('date')
    n = cart_num(request)
    context = {'products': products, 'category': category, 'n': n}
    return render(request, 'category_products.html', context)


def details(request, token):

    if request.method == 'POST':
        new_num = int(request.POST['quantity'])
        if request.user.is_authenticated:
            this_product = get_object_or_404(Product, token=request.POST['token'])
            in_cart = Cart.objects.filter(product=this_product, user=request.user, oredered=False)

            if in_cart.exists():
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
    context = {'product': this_product, 'n': n,  'extra': extra}

    return render(request, "product_detail.html", context=context)

def add_to_cart(request, token):
    if request.user.is_authenticated:
        referer = request.META.get('HTTP_REFERER')
        this_product = get_object_or_404(Product, token=token)
        try:
            quantity = int(request.POST['quantity'])
        except:
            quantity = None
        this_cart = Cart.objects.filter(product=this_product, user=request.user, ordered=False).last()

        if this_product.stock == 0 :
            messages.error(request, 'موجودی این محصول تمام شده است . ')
            return redirect(referer)

        if request.method == 'POST':
            if this_cart:
                if quantity :
                    if quantity <= this_product.stock:
                        this_cart.num = quantity
                        this_cart.save()
                        messages.success(request, f'محصول {this_product.name} به سبد خرید اضافه شد')
                    else:
                        messages.error(request, f' موجودی این محصول تنها {this_product.stock} عدد است ')
                else:
                    if this_cart.num < this_product.stock:
                        this_cart.num += 1
                        this_cart.save()
                        messages.success(request, f'محصول {this_product.name} به سبد خرید اضافه شد')
                    else:
                        messages.error(request, f' موجودی این محصول تنها {this_product.stock} عدد است ')

            else:
                if quantity:
                    if quantity <= this_product.stock:
                        new_cart = Cart.objects.create(user=request.user, product=this_product, num = quantity, ordered=False)
                        new_cart.save()
                        messages.success(request, f'محصول {this_product.name} به سبد خرید اضافه شد')
                    else :
                        messages.error(request, f' موجودی این محصول تنها {this_product.stock} عدد است ')
                else:
                    if this_product.stock != 0:
                        new_cart = Cart.objects.create(user=request.user, product=this_product, num = 1, ordered=False)
                        new_cart.save()
                        messages.success(request, f'محصول {this_product.name} به سبد خرید اضافه شد')
                    else:
                        messages.error(request, 'موجودی تمام شده است . ')

        return redirect(referer)
    return redirect('login')
def cart(request, token):
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
