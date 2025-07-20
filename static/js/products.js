// Products page functionality
document.addEventListener("DOMContentLoaded", () => {
  initializeProductsPage()
})

function initializeProductsPage() {
  // Initialize view toggle
  initializeViewToggle()

  // Initialize auto-submit for filters
  initializeAutoSubmit()

  // Initialize mobile filters
  initializeMobileFilters()
}

// View Toggle (Grid/List)
function initializeViewToggle() {
  const viewButtons = document.querySelectorAll(".view-btn")
  const productsGrid = document.getElementById("productsGrid")

  viewButtons.forEach((btn) => {
    btn.addEventListener("click", function () {
      // Remove active class from all buttons
      viewButtons.forEach((b) => b.classList.remove("active"))

      // Add active class to clicked button
      this.classList.add("active")

      // Toggle grid view
      const view = this.dataset.view
      if (view === "list") {
        productsGrid.classList.add("list-view")
      } else {
        productsGrid.classList.remove("list-view")
      }

      // Save preference
      localStorage.setItem("productsView", view)
    })
  })

  // Load saved preference
  const savedView = localStorage.getItem("productsView")
  if (savedView === "list") {
    document.querySelector('[data-view="list"]').click()
  }
}

// Auto-submit filters
function initializeAutoSubmit() {
  const form = document.getElementById("filtersForm")
  const checkboxes = form.querySelectorAll('input[type="checkbox"]')
  const radios = form.querySelectorAll('input[type="radio"]')

  // Auto-submit on checkbox/radio change
  ;[...checkboxes, ...radios].forEach((input) => {
    input.addEventListener("change", () => {
      form.submit()
    })
  })

  // Auto-submit on price range change (with delay)
  const priceInputs = form.querySelectorAll('input[type="number"]')
  priceInputs.forEach((input) => {
    let timeout
    input.addEventListener("input", () => {
      clearTimeout(timeout)
      timeout = setTimeout(() => {
        form.submit()
      }, 1000) // 1 second delay
    })
  })
}

// Mobile filters
function initializeMobileFilters() {
  const sidebar = document.querySelector(".filters-sidebar")
  const overlay = document.getElementById("mobileFiltersOverlay")
  const content = overlay.querySelector(".mobile-filters-content")

  // Clone sidebar content to mobile overlay
  if (sidebar && content) {
    const clonedContent = sidebar.cloneNode(true)
    clonedContent.classList.add("mobile-filters")
    content.appendChild(clonedContent)
  }
}

// Toggle mobile filters
function toggleMobileFilters() {
  const overlay = document.getElementById("mobileFiltersOverlay")
  if (overlay.style.display === "block") {
    overlay.style.display = "none"
    document.body.style.overflow = ""
  } else {
    overlay.style.display = "block"
    document.body.style.overflow = "hidden"
  }
}

// Sort products
function sortProducts(sortValue) {
  const url = new URL(window.location)
  if (sortValue) {
    url.searchParams.set("sort", sortValue)
  } else {
    url.searchParams.delete("sort")
  }
  url.searchParams.delete("page") // Reset to first page
  window.location.href = url.toString()
}

// Set price range
function setPriceRange(min, max) {
  const minInput = document.querySelector('input[name="min_price"]')
  const maxInput = document.querySelector('input[name="max_price"]')

  minInput.value = min || ""
  maxInput.value = max || ""

  // Submit form
  document.getElementById("filtersForm").submit()
}

// Clear all filters
function clearAllFilters() {
  const url = new URL(window.location)
  // Keep only the base URL
  window.location.href = url.pathname
}

// Remove specific filter
function removeFilter(param, value) {
  const url = new URL(window.location)
  const currentValues = url.searchParams.getAll(param)

  // Remove the specific value
  const newValues = currentValues.filter((v) => v !== value)

  // Update URL
  url.searchParams.delete(param)
  newValues.forEach((v) => url.searchParams.append(param, v))

  url.searchParams.delete("page") // Reset to first page
  window.location.href = url.toString()
}

// Toggle wishlist
function toggleWishlist(productId) {
  // This would typically make an AJAX call to Django
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
        const btn = event.target.closest(".wishlist-btn")
        const icon = btn.querySelector("i")

        if (data.added) {
          icon.classList.remove("far")
          icon.classList.add("fas")
          btn.style.color = "#e74c3c"
          alert("به لیست علاقه‌مندی‌ها اضافه شد") // Temporary solution for showNotification
        } else {
          icon.classList.remove("fas")
          icon.classList.add("far")
          btn.style.color = ""
          alert("از لیست علاقه‌مندی‌ها حذف شد") // Temporary solution for showNotification
        }
      }
    })
    .catch((error) => {
      alert("خطا در عملیات") // Temporary solution for showNotification
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

// Temporary function to simulate showNotification
function showNotification(message, type) {
  alert(message) // This is a placeholder for demonstration purposes
}
