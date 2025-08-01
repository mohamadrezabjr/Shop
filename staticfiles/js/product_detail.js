// Product Detail Page Functionality
document.addEventListener("DOMContentLoaded", () => {
  initializeProductDetail()
})

function initializeProductDetail() {
  // Initialize image gallery
  initializeImageGallery()

  // Initialize tabs
  initializeTabs()

  // Initialize quantity controls
  initializeQuantityControls()

  // Initialize image zoom
  initializeImageZoom()

  // Initialize star rating
  initializeStarRating()
}

// Image Gallery
function initializeImageGallery() {
  const thumbnails = document.querySelectorAll(".thumbnail")

  thumbnails.forEach((thumbnail) => {
    thumbnail.addEventListener("click", function () {
      // Remove active class from all thumbnails
      thumbnails.forEach((t) => t.classList.remove("active"))

      // Add active class to clicked thumbnail
      this.classList.add("active")
    })
  })
}

// Change main image
function changeMainImage(imageSrc) {
  const mainImage = document.getElementById("mainImage")
  const imageZoom = document.getElementById("imageZoom")

  mainImage.src = imageSrc
  imageZoom.style.backgroundImage = `url(${imageSrc})`
}

// Image Zoom
function initializeImageZoom() {
  const mainImage = document.getElementById("mainImage")
  const imageZoom = document.getElementById("imageZoom")

  if (mainImage && imageZoom) {
    // Set initial zoom background
    imageZoom.style.backgroundImage = `url(${mainImage.src})`

    mainImage.addEventListener("mousemove", function (e) {
      const rect = this.getBoundingClientRect()
      const x = ((e.clientX - rect.left) / rect.width) * 100
      const y = ((e.clientY - rect.top) / rect.height) * 100

      imageZoom.style.backgroundPosition = `${x}% ${y}%`
    })
  }
}

// Tabs
function initializeTabs() {
  const tabButtons = document.querySelectorAll(".tab-btn")
  const tabContents = document.querySelectorAll(".tab-content")

  tabButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const targetTab = this.dataset.tab

      // Remove active class from all buttons and contents
      tabButtons.forEach((btn) => btn.classList.remove("active"))
      tabContents.forEach((content) => content.classList.remove("active"))

      // Add active class to clicked button and corresponding content
      this.classList.add("active")
      document.getElementById(targetTab).classList.add("active")
    })
  })
}

// Quantity Controls
function initializeQuantityControls() {
  const quantityInput = document.getElementById("quantity")
  if (!quantityInput) return

  const maxStock = Number.parseInt(quantityInput.getAttribute("max")) || 999

  // Update quantity display
  function updateQuantity(newValue) {
    if (newValue >= 1 && newValue <= maxStock) {
      quantityInput.value = newValue
    }
  }

  // Quantity input validation
  quantityInput.addEventListener("input", function () {
    const value = Number.parseInt(this.value)
    if (isNaN(value) || value < 1) {
      this.value = 1
    } else if (value > maxStock) {
      this.value = maxStock
      if (typeof showNotification === "function") {
        showNotification(`حداکثر موجودی این محصول ${maxStock} عدد است`, "warning")
      }
    }
  })
}

// Increase quantity - اصلاح شده
function increaseQuantity() {
  const quantityInput = document.getElementById("quantity")
  if (!quantityInput) return

  const currentValue = Number.parseInt(quantityInput.value) || 1
  const maxStock = Number.parseInt(quantityInput.getAttribute("max")) || 999

  if (currentValue < maxStock) {
    quantityInput.value = currentValue + 1
  } else {
    if (typeof showNotification === "function") {
      showNotification(`حداکثر موجودی این محصول ${maxStock} عدد است`, "warning")
    } else {
      alert(`حداکثر موجودی این محصول ${maxStock} عدد است`)
    }
  }
}

// Decrease quantity - اصلاح شده
function decreaseQuantity() {
  const quantityInput = document.getElementById("quantity")
  if (!quantityInput) return

  const currentValue = Number.parseInt(quantityInput.value) || 1

  if (currentValue > 1) {
    quantityInput.value = currentValue - 1
  }
}

// Star Rating for Reviews
function initializeStarRating() {
  const starInputs = document.querySelectorAll('.star-rating input[type="radio"]')

  starInputs.forEach((input) => {
    input.addEventListener("change", function () {
      const rating = this.value
      console.log(`Selected rating: ${rating}`)
    })
  })
}

// Share Product
function shareProduct(platform) {
  const productTitle = document.querySelector(".product-title").textContent
  const productUrl = window.location.href

  switch (platform) {
    case "telegram":
      const telegramUrl = `https://t.me/share/url?url=${encodeURIComponent(
        productUrl,
      )}&text=${encodeURIComponent(productTitle)}`
      window.open(telegramUrl, "_blank")
      break

    case "whatsapp":
      const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(productTitle + " " + productUrl)}`
      window.open(whatsappUrl, "_blank")
      break

    case "copy":
      navigator.clipboard
        .writeText(productUrl)
        .then(() => {
          showNotification("لینک محصول کپی شد", "success")
        })
        .catch(() => {
          showNotification("خطا در کپی کردن لینک", "error")
        })
      break
  }
}

// Toggle Wishlist
function toggleWishlist(productId) {
  fetch(`/wishlist/toggle/${productId}/`, {
    method: "POST",
    headers: {
      "X-CSRFToken": getCookie("csrftoken"),
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.success) {
        const btn = document.querySelector(".wishlist-btn")
        const icon = btn.querySelector("i")

        if (data.added) {
          icon.classList.remove("far")
          icon.classList.add("fas")
          btn.style.borderColor = "#e74c3c"
          btn.style.color = "#e74c3c"
          showNotification("به لیست علاقه‌مندی‌ها اضافه شد", "success")
        } else {
          icon.classList.remove("fas")
          icon.classList.add("far")
          btn.style.borderColor = "#ddd"
          btn.style.color = "#666"
          showNotification("از لیست علاقه‌مندی‌ها حذف شد", "info")
        }
      }
    })
    .catch((error) => {
      showNotification("خطا در عملیات", "error")
    })
}

// Smooth scroll to reviews
document.addEventListener("DOMContentLoaded", () => {
  const reviewsLink = document.querySelector('a[href="#reviews"]')
  if (reviewsLink) {
    reviewsLink.addEventListener("click", (e) => {
      e.preventDefault()
      // Switch to reviews tab
      document.querySelector('[data-tab="reviews"]').click()
      // Scroll to tabs section
      document.querySelector(".product-tabs").scrollIntoView({
        behavior: "smooth",
      })
    })
  }
})

// Form submission handling
document.addEventListener("DOMContentLoaded", () => {
  const addToCartForm = document.querySelector(".add-to-cart-form")
  const reviewForm = document.querySelector(".review-form")

  if (addToCartForm) {
    addToCartForm.addEventListener("submit", (e) => {
      const quantity = document.getElementById("quantity").value
      console.log(`Adding ${quantity} items to cart`)
    })
  }

  if (reviewForm) {
    reviewForm.addEventListener("submit", (e) => {
      const rating = document.querySelector('.star-rating input[type="radio"]:checked')
      const comment = document.querySelector('textarea[name="comment"]')

      if (!rating) {
        e.preventDefault()
        showNotification("لطفاً امتیاز خود را انتخاب کنید", "warning")
        return
      }

      if (!comment.value.trim()) {
        e.preventDefault()
        showNotification("لطفاً نظر خود را بنویسید", "warning")
        return
      }
    })
  }
})

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

// بهبود تابع showNotification
function showNotification(message, type = "info") {
  // اگر تابع اصلی showNotification موجود است، از آن استفاده کن
  if (window.showNotification && typeof window.showNotification === "function") {
    window.showNotification(message, type)
    return
  }

  // در غیر این صورت notification ساده ایجاد کن
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
    case "info":
      backgroundColor = "#17a2b8"
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
