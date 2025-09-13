from django.shortcuts import render, redirect, get_object_or_404
from django_ratelimit.decorators import ratelimit
from Shop.models import *
from .models import *
from Shop.views import cart_num
from django.http import Http404, JsonResponse
from django.urls import reverse_lazy
from django.contrib.auth.views import PasswordResetView
from django.contrib.messages.views import SuccessMessageMixin
from django.db.models import Q

class ResetPassword(PasswordResetView , SuccessMessageMixin):
    template_name = 'password_reset_form.html'
    email_template_name = 'password_reset_email.html'
    subject_template_name = 'password_reset_subject.txt'
    success_message = "We've emailed you instructions for setting your password, " \
                      "if an account exists with the email you entered. You should receive them shortly." \
                      " If you don't receive an email, " \
                      "please make sure you've entered the address you registered with, and check your spam folder."
    success_url = reverse_lazy('password_reset_done')

@ratelimit(key='ip', rate='10/s', block=True)
def profile(request):
    if not request.user.is_authenticated:
        return redirect('login')
    if request.method == "POST":
        first_name = request.POST.get('first_name')
        last_name = request.POST.get('last_name')
        email = request.POST.get('email')
        phone_number = request.POST.get('phone_number')

        profile = request.user.profile
        profile.phone_number = phone_number
        profile.save()

        user = request.user
        user.first_name = first_name
        user.last_name = last_name
        user.email = email
        user.save()

        return redirect('profile')

    n = cart_num(request)
    orders = Order.objects.filter(user=request.user).order_by('-date')
    user = request.user

    context = {'orders': orders, 'user': user, 'n': n}
    return render (request , 'profile.html',context)

@ratelimit(key='ip', rate='10/s', block=True)
def order_detail(request, token):
    this_order = get_object_or_404(Order,token=token)
    if this_order.user != request.user:
        raise Http404
    cart_items = Cart.objects.filter(order =this_order)
    products = Product.objects.filter(cart__order= this_order)
    context = {'order': this_order, 'products': products , 'cart_items': cart_items}

    return render(request, 'order_detail.html', context)
@ratelimit(key='ip', rate='10/s', block=True)
def order_cancel(request, token):
    this_order = get_object_or_404(Order,token=token)
    if this_order.user != request.user:
        raise Http404
    carts = this_order.products.all()
    for cart in carts:
        product = cart.product
        quantity = cart.num
        product.stock += quantity
        product.save()

    this_order.status = 'cancelled'
    this_order.save()
    return redirect('order_detail', token=token)

@ratelimit(key='ip', rate='10/s', block=True)
def wishlist(request):
    if not request.user.is_authenticated:
        return redirect('login')

    n = cart_num(request)
    wishlist_products = request.user.profile.wishlist.all()
    if wishlist_products.exists():
        empty = False
    else:
        empty = True
    min_price = request.GET.get('min_price') or 0
    max_price = request.GET.get('max_price') or 99999999999999
    has_discount = request.GET.get('has_discount')
    in_stock = request.GET.get('in_stock')
    search = request.GET.get('search')
    sort = request.GET.get('sort')
    min_rating = request.GET.get('min_rating')

    wishlist_products = wishlist_products.filter(
        Q(price__gte=min_price, price__lte=max_price) | Q(sale_price__gte=min_price, sale_price__lte=max_price))
    if min_rating :
        wishlist_products = wishlist_products.filter(rating__gte = min_rating)
    if has_discount:
        wishlist_products = wishlist_products.filter(discount__gt=0)
    if search:
        wishlist_products = wishlist_products.filter(name__icontains=search)
    if in_stock :
        wishlist_products = wishlist_products.filter(stock__gte=1)

    # Sorting
    if sort == "price_high":
        wishlist_products = wishlist_products.order_by('-sale_price')
    elif sort == "price_low":
        wishlist_products = wishlist_products.order_by('sale_price')
    elif sort == "newest":
        wishlist_products = wishlist_products.order_by('-date')
    elif sort == "oldest":
        wishlist_products = wishlist_products.order_by('date')
    elif sort == "rating":
        wishlist_products = wishlist_products.order_by('-rating')

    context = {'wishlist_products': wishlist_products, 'empty': empty,'n':n}
    return render(request, 'wishlist.html', context)
@ratelimit(key='ip', rate='10/s', block=True)
def wishlist_toggle(request, product_id):
    if not request.user.is_authenticated:
        return JsonResponse({
                    'authenticated': False,
                    'success': False
                   })
    if request.method == "POST":
        product= Product.objects.get(id=product_id)
        profile = request.user.profile
        wishlist = profile.wishlist.all()
        if product in wishlist:
            profile.wishlist.remove(product)
            profile.save()
            return JsonResponse({
                'authenticated': True,
                'success': True,
                'added':False
                })

        profile.wishlist.add(product)
        profile.save()
        return JsonResponse({
            'authenticated': True,
            'success': True,
            'added':True
        })
    return redirect('index')
@ratelimit(key='ip', rate='10/s', block=True)
def wishlist_remove(request, product_id):
    if not request.user.is_authenticated:
        return redirect('login')
    if request.method == "POST":
        product = Product.objects.get(id=product_id)
        profile = request.user.profile
        profile.wishlist.remove(product)
        profile.save()
        return JsonResponse({
            'success': True,
            'authenticated': True,
            'removed': True
        })
    return redirect('index')
@ratelimit(key='ip', rate='10/s', block=True)
def addresses(request):
    if not request.user.is_authenticated:
        return redirect('login')

    if request.method == 'POST':
        address_text = request.POST.get('address')
        unit = request.POST.get('unit') or 0
        city = request.POST.get('city')
        postal_code = request.POST.get('postal_code')

        try :
            new_address = Address.objects.create(user=request.user,
                                                address=address_text,
                                                city=city,
                                                unit=unit,
                                                postal_code=postal_code,
                                                save_address=True)
            new_address.save()
        except:
            return redirect('addresses')
        else:
            profile = request.user.profile
            profile.address.add(new_address)
            profile.save()
            return redirect('addresses')

    n = cart_num(request)
    addresses = request.user.profile.address.all().filter(save_address=True)
    context = {'addresses': addresses, 'n':n}
    return render(request, 'addresses.html', context=context)


def address_edit(request, address_id):
    if not request.user.is_authenticated:
        return redirect('login')
    if request.method == 'POST':
        address_text = request.POST.get('address')
        unit = request.POST.get('unit') or 0
        city = request.POST.get('city')
        postal_code = request.POST.get('postal_code')
        address = Address.objects.get(id=address_id)

        if address.user != request.user:
            return redirect('addresses')

        address.address = address_text
        address.unit = unit
        address.city = city
        address.postal_code = postal_code
        address.save()

    return redirect('addresses')
def address_remove(request, address_id):
    if not request.user.is_authenticated:
        return redirect('login')
    if request.method == 'POST':
        address = Address.objects.get(id=address_id)
        if address.user != request.user:
            return redirect('addresses')
        address.save_address = False
        address.save()
    return redirect('addresses')
