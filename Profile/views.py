from django.shortcuts import render, redirect, get_object_or_404
from Shop.models import *
from django.http import Http404
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
