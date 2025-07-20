// فقط قابلیت‌های UI و تعاملی فرانت‌اند
document.addEventListener("DOMContentLoaded", () => {
  initializeAnimations()
  initializeSearch()
  initializeMobileMenu()
  initializeModal()
  initializeSmoothScroll()
})

// DOM Elements
const menuToggle = document.getElementById("menuToggle")
const navMenu = document.getElementById("navMenu")
const cartModal = document.getElementById("cartModal")
const closeCart = document.getElementById("closeCart")
const searchInput = document.getElementById("searchInput")
const newsletterForm = document.getElementById("newsletterForm")

// Mobile menu toggle
function initializeMobileMenu() {
  if (menuToggle && navMenu) {
    menuToggle.addEventListener("click", () => {
      navMenu.classList.toggle("active")
    })
  }
}

// Modal functionality
function initializeModal() {
  // Cart modal
  const cartIcon = document.querySelector(".cart-icon")
  if (cartIcon && cartModal) {
    cartIcon.addEventListener("click", () => {
      cartModal.style.display = "block"
    })
  }

  if (closeCart) {
    closeCart.addEventListener("click", () => {
      cartModal.style.display = "none"
    })
  }

  // Close modal when clicking outside
  window.addEventListener("click", (event) => {
    if (event.target === cartModal) {
      cartModal.style.display = "none"
    }
  })
}

// Search functionality (فقط فیلتر کردن محصولات موجود در صفحه)
function initializeSearch() {
  if (searchInput) {
    searchInput.addEventListener("input", function () {
      const searchTerm = this.value.toLowerCase()
      const productCards = document.querySelectorAll(".product-card")

      productCards.forEach((card) => {
        const title = card.querySelector(".product-title")
        if (title) {
          const titleText = title.textContent.toLowerCase()
          if (titleText.includes(searchTerm)) {
            card.style.display = "block"
          } else {
            card.style.display = "none"
          }
        }
      })
    })
  }
}

// Newsletter form
if (newsletterForm) {
  newsletterForm.addEventListener("submit", function (e) {
    e.preventDefault()
    const email = this.querySelector('input[type="email"]').value

    // ارسال به Django
    fetch("/newsletter/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": getCookie("csrftoken"),
      },
      body: JSON.stringify({ email: email }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          showNotification("ایمیل شما با موفقیت ثبت شد")
          this.reset()
        } else {
          showNotification("خطا در ثبت ایمیل")
        }
      })
      .catch((error) => {
        showNotification("خطا در ثبت ایمیل")
      })
  })
}

// Smooth scrolling for navigation links
function initializeSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault()
      const target = document.querySelector(this.getAttribute("href"))
      if (target) {
        target.scrollIntoView({
          behavior: "smooth",
          block: "start",
        })
      }
    })
  })
}

// Initialize animations
function initializeAnimations() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible")
      }
    })
  }, observerOptions)

  // Observe all fade-in elements
  document.querySelectorAll(".fade-in").forEach((el) => {
    observer.observe(el)
  })

  // اطمینان از نمایش محصولات
  setTimeout(() => {
    document.querySelectorAll(".product-card").forEach((card) => {
      card.style.opacity = "1"
      card.style.transform = "translateY(0)"
    })
  }, 100)
}

// Show notification
function showNotification(message) {
  const notification = document.createElement("div")
  notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: #2c5aa0;
        color: white;
        padding: 1rem 2rem;
        border-radius: 8px;
        z-index: 3000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
    `
  notification.textContent = message

  document.body.appendChild(notification)

  setTimeout(() => {
    notification.style.transform = "translateX(0)"
  }, 100)

  setTimeout(() => {
    notification.style.transform = "translateX(100%)"
    setTimeout(() => {
      document.body.removeChild(notification)
    }, 300)
  }, 3000)
}

// CTA button functionality
document.addEventListener("DOMContentLoaded", () => {
  const ctaButton = document.querySelector(".cta-button")
  if (ctaButton) {
    ctaButton.addEventListener("click", () => {
      const productsSection = document.querySelector("#products")
      if (productsSection) {
        productsSection.scrollIntoView({
          behavior: "smooth",
        })
      }
    })
  }
})

// Category cards click functionality
document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".category-card").forEach((card) => {
    card.addEventListener("click", () => {
      const productsSection = document.querySelector("#products")
      if (productsSection) {
        productsSection.scrollIntoView({
          behavior: "smooth",
        })
      }
    })
  })
})

// Get CSRF token for Django
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
