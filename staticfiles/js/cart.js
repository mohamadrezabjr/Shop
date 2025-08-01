// Cart Page Functionality - اصلاح شده
document.addEventListener("DOMContentLoaded", () => {
  console.log("[DEBUG] Cart page loaded")
  initializeCart()
})

function initializeCart() {
  // Initialize quantity controls
  initializeQuantityControls()
  console.log("[DEBUG] Cart initialized")
}

// Quantity Controls
function initializeQuantityControls() {
  const quantityInputs = document.querySelectorAll(".quantity-input")
  console.log(`[DEBUG] Found ${quantityInputs.length} quantity inputs`)

  quantityInputs.forEach((input) => {
    input.addEventListener("change", function () {
      const itemId = this.closest(".cart-item").dataset.itemId
      const newQuantity = Number.parseInt(this.value)
      const maxStock = Number.parseInt(this.getAttribute("max"))

      console.log(`[DEBUG] Input changed - Item: ${itemId}, Quantity: ${newQuantity}, Max: ${maxStock}`)

      if (newQuantity > maxStock) {
        this.value = maxStock
        showNotification(`حداکثر موجودی این محصول ${maxStock} عدد است`, "warning")
        return
      }

      if (newQuantity < 1) {
        this.value = 1
        return
      }

      updateQuantity(itemId, "set", newQuantity)
    })
  })
}

// Update Quantity - اصلاح شده برای به‌روزرسانی قیمت محصول
function updateQuantity(itemId, action, value = null) {
  console.log(`[DEBUG] updateQuantity called - Item: ${itemId}, Action: ${action}, Value: ${value}`)

  const cartItem = document.querySelector(`[data-item-id="${itemId}"]`)
  if (!cartItem) {
    console.error(`[DEBUG] Cart item not found: ${itemId}`)
    return
  }

  const quantityInput = cartItem.querySelector(".quantity-input")
  if (!quantityInput) {
    console.error("[DEBUG] Quantity input not found")
    return
  }

  const currentQuantity = Number.parseInt(quantityInput.value) || 1
  const maxStock = Number.parseInt(quantityInput.getAttribute("max")) || 999

  let newQuantity = currentQuantity

  switch (action) {
    case "increase":
      if (currentQuantity < maxStock) {
        newQuantity = currentQuantity + 1
      } else {
        showNotification(`حداکثر موجودی این محصول ${maxStock} عدد است`, "warning")
        return
      }
      break
    case "decrease":
      if (currentQuantity > 1) {
        newQuantity = currentQuantity - 1
      } else {
        return
      }
      break
    case "set":
      newQuantity = Number.parseInt(value) || 1
      if (newQuantity < 1) newQuantity = 1
      if (newQuantity > maxStock) newQuantity = maxStock
      break
  }

  console.log(`[DEBUG] Updating quantity from ${currentQuantity} to ${newQuantity}`)

  // نمایش loading state
  cartItem.classList.add("updating")
  const actionButtons = cartItem.querySelectorAll(".quantity-btn")
  actionButtons.forEach((btn) => (btn.disabled = true))

  // ابتدا UI رو به‌روزرسانی کن
  quantityInput.value = newQuantity

  // محاسبه و نمایش قیمت جدید فوری (قبل از درخواست سرور)
  updateItemTotalInstantly(cartItem, newQuantity)

  // سپس درخواست به سرور بفرست
  fetch("/cart/", {
    method: "POST",
    headers: {
      "X-CSRFToken": getCookie("csrftoken"),
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      item_id: Number.parseInt(itemId),
      quantity: newQuantity,
    }),
  })
    .then((response) => {
      console.log(`[DEBUG] Response status: ${response.status}`)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      return response.json()
    })
    .then((data) => {
      console.log("[DEBUG] Response data:", data)

      if (data.success) {
        // به‌روزرسانی قیمت کل آیتم با مقدار دقیق از سرور
        updateItemTotal(cartItem, data.item_total)

        // به‌روزرسانی مجموع سبد خرید
        if (data.cart_totals) {
          updateCartTotals(data.cart_totals)
        }

        showNotification("تعداد به‌روزرسانی شد", "success")
      } else {
        console.error("[DEBUG] Server returned error:", data.message)
        showNotification(data.message || "خطا در به‌روزرسانی", "error")
        // بازگردانی مقدار قبلی
        quantityInput.value = currentQuantity
        updateItemTotalInstantly(cartItem, currentQuantity)
      }
    })
    .catch((error) => {
      console.error("[DEBUG] Fetch error:", error)
      showNotification("خطا در اتصال به سرور", "error")
      // بازگردانی مقدار قبلی
      quantityInput.value = currentQuantity
      updateItemTotalInstantly(cartItem, currentQuantity)
    })
    .finally(() => {
      // حذف loading state
      cartItem.classList.remove("updating")
      actionButtons.forEach((btn) => (btn.disabled = false))
    })
}

// Update Item Total - اصلاح شده
function updateItemTotal(cartItem, newTotal) {
  const totalElement = cartItem.querySelector(".total-price")
  if (totalElement && newTotal) {
    totalElement.textContent = `${newTotal.toLocaleString()} تومان`
    console.log(`[DEBUG] Updated item total to: ${newTotal}`)
  }
}

// تابع جدید برای به‌روزرسانی فوری قیمت محصول
function updateItemTotalInstantly(cartItem, quantity) {
  // پیدا کردن قیمت واحد محصول
  const currentPriceElement = cartItem.querySelector(".current-price")
  const itemPriceElement = cartItem.querySelector(".item-price")

  let unitPrice = 0

  if (currentPriceElement) {
    // محصول تخفیف‌دار
    const priceText = currentPriceElement.textContent.replace(/[^\d]/g, "")
    unitPrice = Number.parseInt(priceText) || 0
  } else if (itemPriceElement) {
    // محصول بدون تخفیف
    const priceText = itemPriceElement.textContent.replace(/[^\d]/g, "")
    unitPrice = Number.parseInt(priceText) || 0
  }

  if (unitPrice > 0) {
    const newTotal = unitPrice * quantity
    const totalElement = cartItem.querySelector(".total-price")
    if (totalElement) {
      totalElement.textContent = `${newTotal.toLocaleString()} تومان`
      console.log(`[DEBUG] Instantly updated item total to: ${newTotal}`)
    }
  }
}

// Update Cart Totals
function updateCartTotals(totals) {
  console.log("[DEBUG] Updating cart totals:", totals)

  // به‌روزرسانی خلاصه سبد خرید
  const subtotalElement = document.querySelector(".summary-row:nth-child(2) span:last-child")
  const shippingElement = document.querySelector(".summary-row:nth-child(4) span:last-child")
  const totalElement = document.querySelector(".summary-row.total span:last-child")

  if (subtotalElement) {
    subtotalElement.textContent = `${totals.subtotal.toLocaleString()} تومان`
  }

  if (shippingElement) {
    if (totals.subtotal >= 500000) {
      shippingElement.innerHTML = '<span class="free-shipping">رایگان</span>'
    } else {
      shippingElement.textContent = `${totals.shipping.toLocaleString()} تومان`
    }
  }

  if (totalElement) {
    totalElement.textContent = `${totals.total.toLocaleString()} تومان`
  }

  // به‌روزرسانی progress bar ارسال رایگان
  updateFreeShippingProgress(totals.subtotal)
}

// Update Free Shipping Progress
function updateFreeShippingProgress(subtotal) {
  const progressFill = document.querySelector(".progress-fill")
  const progressText = document.querySelector(".free-shipping-progress small")

  if (progressFill && progressText) {
    const freeShippingThreshold = 500000
    const progress = Math.min((subtotal / freeShippingThreshold) * 100, 100)

    progressFill.style.width = `${progress}%`

    if (subtotal < freeShippingThreshold) {
      const remaining = freeShippingThreshold - subtotal
      progressText.textContent = `${remaining.toLocaleString()} تومان تا ارسال رایگان`
    } else {
      progressText.textContent = "ارسال رایگان فعال است!"
    }
  }
}

// Remove Item
function removeItem(itemId) {
  if (!confirm("آیا از حذف این محصول اطمینان دارید؟")) {
    return
  }

  console.log(`[DEBUG] Removing item: ${itemId}`)

  const cartItem = document.querySelector(`[data-item-id="${itemId}"]`)
  cartItem.style.opacity = "0.5"
  cartItem.style.pointerEvents = "none"

  fetch("/cart/remove/", {
    method: "POST",
    headers: {
      "X-CSRFToken": getCookie("csrftoken"),
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      item_id: Number.parseInt(itemId),
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.success) {
        // حذف آیتم با انیمیشن
        cartItem.style.transform = "translateX(100%)"
        setTimeout(() => {
          cartItem.remove()
          if (data.cart_totals) {
            updateCartTotals(data.cart_totals)
          }

          // بررسی خالی بودن سبد خرید
          if (data.cart_count === 0) {
            location.reload()
          }
        }, 300)

        showNotification("محصول از سبد خرید حذف شد", "success")
      } else {
        // بازگردانی حالت آیتم
        cartItem.style.opacity = "1"
        cartItem.style.pointerEvents = "auto"
        showNotification(data.message || "خطا در حذف محصول", "error")
      }
    })
    .catch((error) => {
      console.error("[DEBUG] Remove error:", error)
      cartItem.style.opacity = "1"
      cartItem.style.pointerEvents = "auto"
      showNotification("خطا در حذف محصول", "error")
    })
}

// Clear Cart
function clearCart() {
  if (!confirm("آیا از پاک کردن کل سبد خرید اطمینان دارید؟")) {
    return
  }

  fetch("/cart/clear/", {
    method: "POST",
    headers: {
      "X-CSRFToken": getCookie("csrftoken"),
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.success) {
        location.reload()
      } else {
        showNotification(data.message || "خطا در پاک کردن سبد خرید", "error")
      }
    })
    .catch((error) => {
      console.error("[DEBUG] Clear cart error:", error)
      showNotification("خطا در پاک کردن سبد خرید", "error")
    })
}

// Get CSRF token
function getCookie(name) {
  let cookieValue = null
  if (document.cookie && document.cookie !== "") {
    const cookies = document.cookie.split(";")
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim()
      if (cookie.substring(0, name.length + 1) === name + "=") {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1))
        break
      }
    }
  }
  return cookieValue
}

// Show notification
function showNotification(message, type = "info") {
  console.log(`[DEBUG] Notification: ${message} (${type})`)

  // استفاده از سیستم notification موجود
  if (typeof window.showNotification === "function") {
    window.showNotification(message, type)
  } else {
    // Fallback notification
    const notification = document.createElement("div")

    let backgroundColor = "#2c5aa0"
    switch (type) {
      case "success":
        backgroundColor = "#28a745"
        break
      case "error":
        backgroundColor = "#dc3545"
        break
      case "warning":
        backgroundColor = "#ffc107"
        break
    }

    notification.style.cssText = `
      position: fixed;
      top: 100px;
      right: 20px;
      background: ${backgroundColor};
      color: ${type === "warning" ? "#000" : "#fff"};
      padding: 1rem 2rem;
      border-radius: 8px;
      z-index: 3000;
      transform: translateX(100%);
      transition: transform 0.3s ease;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      max-width: 300px;
      word-wrap: break-word;
    `
    notification.textContent = message

    document.body.appendChild(notification)

    setTimeout(() => {
      notification.style.transform = "translateX(0)"
    }, 100)

    setTimeout(() => {
      notification.style.transform = "translateX(100%)"
      setTimeout(() => {
        if (document.body.contains(notification)) {
          document.body.removeChild(notification)
        }
      }, 300)
    }, 3000)
  }
}
