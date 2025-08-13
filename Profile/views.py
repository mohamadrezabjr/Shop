from django.shortcuts import render, redirect, get_object_or_404
from Shop.models import *
from .models import *
from Shop.views import cart_num
from django.http import Http404, JsonResponse
from django.urls import reverse_lazy
from django.contrib.auth.views import PasswordResetView
from django.contrib.messages.views import SuccessMessageMixin


class ResetPassword(PasswordResetView , SuccessMessageMixin):
    template_name = 'password_reset_form.html'
    email_template_name = 'password_reset_email.html'
    subject_template_name = 'password_reset_subject.txt'
    success_message = "We've emailed you instructions for setting your password, " \
                      "if an account exists with the email you entered. You should receive them shortly." \
                      " If you don't receive an email, " \
                      "please make sure you've entered the address you registered with, and check your spam folder."
    success_url = reverse_lazy('password_reset_done')


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


def order_detail(request, token):
    this_order = get_object_or_404(Order,token=token)
    if this_order.user != request.user:
        raise Http404
    cart_items = Cart.objects.filter(order =this_order)
    products = Product.objects.filter(cart__order= this_order)
    context = {'order': this_order, 'products': products , 'cart_items': cart_items}

    return render(request, 'order_detail.html', context)
def order_cancel(request, token):
    this_order = get_object_or_404(Order,token=token)
    if this_order.user != request.user:
        raise Http404
    this_order.status = 'cancelled'
    this_order.save()
    return redirect('order_detail', token=token)

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
            profile.add(new_address)
            profile.save()
            return redirect('addresses')

    n = cart_num(request)
    addresses = request.user.profile.address.all()
    context = {'addresses': addresses, 'n':n}
    return render(request, 'addresses.html', context=context)










