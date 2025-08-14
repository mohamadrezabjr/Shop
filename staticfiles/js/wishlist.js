function removeWishlist(productId, event) {
  if (confirm("آیا از حذف این کالا از لیست علاقمندی‌ها اطمینان دارید؟")) {
    // This would typically make an AJAX call to Django
    fetch(`/profile/wishlist/remove/${productId}/`, {
      method: "POST",
      headers: {
        "X-CSRFToken": getCookie("csrftoken"),
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.authenticated){
          if (data.success) {
            const product = event.target.closest(".product-card")

            if (data.removed) {
              product.remove()
              showNotification("از لیست علاقه‌مندی‌ها حذف شد", 'info')
            } else {

            }
          }

        }
        else {
          showNotification('لطفا وارد حساب خود شوید.', 'error')
        }
      })
      .catch((error) => {
        showNotification("خطا در عملیات", 'error') // Temporary solution for showNotification
      })
    }
  }