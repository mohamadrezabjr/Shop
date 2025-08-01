// Checkout Page Functionality
document.addEventListener("DOMContentLoaded", () => {
  initializeCheckout()
})

function initializeCheckout() {
  // Initialize form validation
  initializeFormValidation()

  // Initialize shipping method changes
  initializeShippingMethods()

  // Initialize payment method changes
  initializePaymentMethods()

  // Initialize city loading
  initializeCityLoading()

  // Initialize postal code formatting
  initializePostalCodeFormatting()

  // Initialize phone formatting
  initializePhoneFormatting()

  console.log("[DEBUG] Checkout initialized")
}

// Form Validation
function initializeFormValidation() {
  const form = document.getElementById("checkoutForm")
  if (!form) return

  form.addEventListener("submit", (e) => {
    if (!validateCheckoutForm()) {
      e.preventDefault()
    } else {
      // Show loading state
      const submitBtn = document.getElementById("submitOrder")
      submitBtn.classList.add("loading")
      submitBtn.disabled = true
    }
  })
}

function validateCheckoutForm() {
  let isValid = true

  // Check if address is selected or form is filled
  const selectedAddressId = document.getElementById("selectedAddressId").value
  const addressFormSection = document.getElementById("addressFormSection")

  if (!selectedAddressId && addressFormSection.style.display !== "none") {
    // Validate address form fields
    const requiredAddressFields = addressFormSection.querySelectorAll(
      "input[required], select[required], textarea[required]",
    )

    requiredAddressFields.forEach((field) => {
      if (!field.value.trim()) {
        showFieldError(field, "این فیلد الزامی است")
        isValid = false
      } else {
        clearFieldError(field)
      }
    })
  }

  // Validate personal information
  const requiredPersonalFields = document.querySelectorAll("#first_name, #last_name, #email, #phone")

  requiredPersonalFields.forEach((field) => {
    if (!field.value.trim()) {
      showFieldError(field, "این فیلد الزامی است")
      isValid = false
    } else {
      clearFieldError(field)
    }
  })

  // Validate email
  const emailField = document.getElementById("email")
  if (emailField.value && !isValidEmail(emailField.value)) {
    showFieldError(emailField, "فرمت ایمیل صحیح نیست")
    isValid = false
  }

  // Validate phone
  const phoneField = document.getElementById("phone")
  if (phoneField.value && !isValidPhone(phoneField.value)) {
    showFieldError(phoneField, "شماره موبایل صحیح نیست")
    isValid = false
  }

  // Validate postal code (only if address form is visible)
  if (!selectedAddressId) {
    const postalCodeField = document.getElementById("postal_code")
    if (postalCodeField.value && postalCodeField.value.length !== 10) {
      showFieldError(postalCodeField, "کد پستی باید 10 رقم باشد")
      isValid = false
    }
  }

  // Check terms acceptance
  const termsCheckbox = document.getElementById("terms")
  if (!termsCheckbox.checked) {
    showNotification("لطفاً شرایط و قوانین را بپذیرید", "warning")
    isValid = false
  }

  return isValid
}

function showFieldError(field, message) {
  clearFieldError(field)

  field.style.borderColor = "#e74c3c"

  const errorDiv = document.createElement("div")
  errorDiv.className = "field-error"
  errorDiv.style.cssText = `
    color: #e74c3c;
    font-size: 0.8rem;
    margin-top: 0.25rem;
    display: flex;
    align-items: center;
    gap: 0.25rem;
  `
  errorDiv.innerHTML = `<i class="fas fa-exclamation-circle"></i> ${message}`

  field.parentNode.appendChild(errorDiv)
}

function clearFieldError(field) {
  field.style.borderColor = "#e1e5e9"
  const existingError = field.parentNode.querySelector(".field-error")
  if (existingError) {
    existingError.remove()
  }
}

function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

function isValidPhone(phone) {
  const phoneRegex = /^09[0-9]{9}$/
  return phoneRegex.test(phone)
}

// Shipping Methods
function initializeShippingMethods() {
  const shippingMethods = document.querySelectorAll('input[name="shipping_method"]')

  shippingMethods.forEach((method) => {
    method.addEventListener("change", function () {
      updateShippingCost(this.value)
    })
  })
}

function updateShippingCost(method) {
  const shippingCostElement = document.getElementById("shippingCost")
  const finalTotalElement = document.getElementById("finalTotal")

  let shippingCost = 0
  let shippingText = ""

  switch (method) {
    case "standard":
      const subtotalText = document.getElementById("subtotal").textContent
      const subtotalValue = Number.parseInt(subtotalText.replace(/[^\d]/g, ""))
      if (subtotalValue >= 500000) {
        shippingCost = 0
        shippingText = "رایگان"
      } else {
        shippingCost = 30000
        shippingText = `${shippingCost.toLocaleString()} تومان`
      }
      break
    case "express":
      shippingCost = 50000
      shippingText = `${shippingCost.toLocaleString()} تومان`
      break
    case "pickup":
      shippingCost = 0
      shippingText = "رایگان"
      break
  }

  shippingCostElement.textContent = shippingText
  updateFinalTotal()

  console.log(`[DEBUG] Shipping method changed to: ${method}, cost: ${shippingCost}`)
}

// Payment Methods
function initializePaymentMethods() {
  const paymentMethods = document.querySelectorAll('input[name="payment_method"]')

  paymentMethods.forEach((method) => {
    method.addEventListener("change", function () {
      updatePaymentFee(this.value)
    })
  })
}

function updatePaymentFee(method) {
  const codFeeRow = document.getElementById("codFeeRow")

  if (method === "cod") {
    codFeeRow.style.display = "flex"
  } else {
    codFeeRow.style.display = "none"
  }

  updateFinalTotal()

  console.log(`[DEBUG] Payment method changed to: ${method}`)
}

// Update Final Total
function updateFinalTotal() {
  const subtotalText = document.getElementById("subtotal").textContent
  const shippingText = document.getElementById("shippingCost").textContent
  const discountText = document.getElementById("discountAmount").textContent
  const finalTotalElement = document.getElementById("finalTotal")

  const subtotal = Number.parseInt(subtotalText.replace(/[^\d]/g, ""))
  const shipping = shippingText === "رایگان" ? 0 : Number.parseInt(shippingText.replace(/[^\d]/g, ""))
  const discount = Number.parseInt(discountText.replace(/[^\d]/g, ""))

  // Add COD fee if selected
  const codFeeRow = document.getElementById("codFeeRow")
  let codFee = 0
  if (codFeeRow.style.display !== "none") {
    codFee = 10000
  }

  const finalTotal = subtotal + shipping + codFee - discount

  finalTotalElement.textContent = `${finalTotal.toLocaleString()} تومان`

  console.log(`[DEBUG] Final total updated: ${finalTotal}`)
}

// City Loading
function initializeCityLoading() {
  // This would typically load cities from a database
  // For now, we'll use static data
}

function loadCities(state) {
  const citySelect = document.getElementById("city")
  citySelect.innerHTML = '<option value="">انتخاب شهر</option>'
  citySelect.disabled = false

  // Static city data - in real app, this would come from API
  const cities = {
    tehran: ["تهران", "کرج", "ورامین", "شهریار"],
    isfahan: ["اصفهان", "کاشان", "نجف‌آباد", "خمینی‌شهر"],
    shiraz: ["شیراز", "مرودشت", "کازرون", "لار"],
    mashhad: ["مشهد", "نیشابور", "سبزوار", "تربت حیدریه"],
    tabriz: ["تبریز", "مراغه", "میانه", "اهر"],
  }

  if (cities[state]) {
    cities[state].forEach((city) => {
      const option = document.createElement("option")
      option.value = city
      option.textContent = city
      citySelect.appendChild(option)
    })
  }
}

// Postal Code Formatting
function initializePostalCodeFormatting() {
  const postalCodeInput = document.getElementById("postal_code")
  if (!postalCodeInput) return

  postalCodeInput.addEventListener("input", function () {
    // Remove non-digits
    let value = this.value.replace(/\D/g, "")

    // Limit to 10 digits
    if (value.length > 10) {
      value = value.slice(0, 10)
    }

    this.value = value
  })
}

// Phone Formatting
function initializePhoneFormatting() {
  const phoneInput = document.getElementById("phone")
  if (!phoneInput) return

  phoneInput.addEventListener("input", function () {
    // Remove non-digits
    let value = this.value.replace(/\D/g, "")

    // Limit to 11 digits
    if (value.length > 11) {
      value = value.slice(0, 11)
    }

    this.value = value
  })
}

// Address Management Functions
function selectSavedAddress(element) {
  console.log("[DEBUG] Selecting saved address")

  // Extract address data
  const addressData = {
    id: element.dataset.id,
    title: element.dataset.title,
    state: element.dataset.state,
    city: element.dataset.city,
    address: element.dataset.address,
    postal_code: element.dataset.postalCode,
    unit: element.dataset.unit || "",
  }

  // Set selected address ID
  document.getElementById("selectedAddressId").value = addressData.id

  // Hide saved addresses section and show selected address
  const savedAddressesSection = document.getElementById("savedAddressesSection")
  const selectedAddressDisplay = document.getElementById("selectedAddressDisplay")
  const addressFormSection = document.getElementById("addressFormSection")

  savedAddressesSection.style.display = "none"
  selectedAddressDisplay.style.display = "block"
  addressFormSection.style.display = "none"

  // Display selected address
  document.getElementById("selectedAddressTitle").textContent = addressData.title
  document.getElementById("selectedAddressDetails").innerHTML = `
        <div class="address-detail-row">
            <strong>آدرس:</strong> ${addressData.address}
        </div>
        <div class="address-detail-row">
            <strong>شهر:</strong> ${addressData.city}
        </div>
        ${addressData.postal_code ? `<div class="address-detail-row"><strong>کد پستی:</strong> ${addressData.postal_code}</div>` : ""}
        ${addressData.unit ? `<div class="address-detail-row"><strong>واحد:</strong> ${addressData.unit}</div>` : ""}
    `

  // Remove required attributes from address form fields
  removeAddressFormRequirements()

  showNotification(`آدرس "${addressData.title}" انتخاب شد`, "success")

  console.log("[DEBUG] Address selected:", addressData)
}

function changeSelectedAddress() {
  console.log("[DEBUG] Changing selected address")
  showSavedAddresses()
}

function showSavedAddresses() {
  console.log("[DEBUG] Showing saved addresses")

  // Clear selected address
  document.getElementById("selectedAddressId").value = ""

  // Show saved addresses section and hide others
  const savedAddressesSection = document.getElementById("savedAddressesSection")
  const selectedAddressDisplay = document.getElementById("selectedAddressDisplay")
  const addressFormSection = document.getElementById("addressFormSection")

  if (savedAddressesSection) {
    savedAddressesSection.style.display = "block"
  }
  selectedAddressDisplay.style.display = "none"
  addressFormSection.style.display = "none"

  // Add required attributes back to address form fields
  addAddressFormRequirements()

  showNotification("آدرس‌های ذخیره شده نمایش داده شد", "info")
}

function showNewAddressForm() {
  console.log("[DEBUG] Showing new address form")

  // Clear selected address
  document.getElementById("selectedAddressId").value = ""

  // Hide saved addresses and selected address, show form
  const savedAddressesSection = document.getElementById("savedAddressesSection")
  const selectedAddressDisplay = document.getElementById("selectedAddressDisplay")
  const addressFormSection = document.getElementById("addressFormSection")

  if (savedAddressesSection) {
    savedAddressesSection.style.display = "none"
  }
  selectedAddressDisplay.style.display = "none"
  addressFormSection.style.display = "block"

  // Add required attributes back to address form fields
  addAddressFormRequirements()

  // Clear address form
  clearAddressForm()

  // Focus on first field
  const stateSelect = document.getElementById("state")
  if (stateSelect) {
    stateSelect.focus()
  }

  showNotification("فرم آدرس جدید آماده است", "info")
}

// Remove required attributes from address form
function removeAddressFormRequirements() {
  const addressFields = document.querySelectorAll(
    "#addressFormSection input[required], #addressFormSection select[required], #addressFormSection textarea[required]",
  )

  addressFields.forEach((field) => {
    field.removeAttribute("required")
    field.dataset.wasRequired = "true"
  })
}

// Add required attributes back to address form
function addAddressFormRequirements() {
  const addressFields = document.querySelectorAll(
    "#addressFormSection input[data-was-required], #addressFormSection select[data-was-required], #addressFormSection textarea[data-was-required]",
  )

  addressFields.forEach((field) => {
    field.setAttribute("required", "")
    field.removeAttribute("data-was-required")
  })

  // Also add required to fields that should always be required
  const alwaysRequiredFields = document.querySelectorAll("#state, #city, #address, #postal_code")

  alwaysRequiredFields.forEach((field) => {
    if (field) {
      field.setAttribute("required", "")
    }
  })
}

function clearAddressForm() {
  console.log("[DEBUG] Clearing address form")

  const stateSelect = document.getElementById("state")
  const citySelect = document.getElementById("city")
  const addressTextarea = document.getElementById("address")
  const postalCodeInput = document.getElementById("postal_code")
  const unitInput = document.getElementById("unit")

  if (stateSelect) stateSelect.value = ""

  if (addressTextarea) addressTextarea.value = ""
  if (postalCodeInput) postalCodeInput.value = ""
  if (unitInput) unitInput.value = ""
}

// Remove old modal functions and replace with empty functions to avoid errors
function showAddressModal() {
  console.log("[DEBUG] showAddressModal called but modal is removed")
}

function closeAddressModal() {
  console.log("[DEBUG] closeAddressModal called but modal is removed")
}

function selectAddressWithData() {
  console.log("[DEBUG] selectAddressWithData called but modal is removed")
}

function createNewAddress() {
  console.log("[DEBUG] createNewAddress called - redirecting to showNewAddressForm")
  showNewAddressForm()
}

// Coupon Functions
function applyCoupon() {
  const couponCode = document.getElementById("couponCode").value.trim()

  if (!couponCode) {
    showNotification("لطفاً کد تخفیف را وارد کنید", "warning")
    return
  }

  console.log(`[DEBUG] Applying coupon: ${couponCode}`)

  // Show loading state
  const couponButton = document.querySelector(".coupon-input button")
  const originalText = couponButton.textContent
  couponButton.textContent = "در حال بررسی..."
  couponButton.disabled = true

  // Simulate API call
  fetch("/apply-coupon/", {
    method: "POST",
    headers: {
      "X-CSRFToken": getCookie("csrftoken"),
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      coupon_code: couponCode,
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.success) {
        // Update discount amount
        const discountRow = document.getElementById("discountRow")
        const discountAmount = document.getElementById("discountAmount")

        discountRow.style.display = "flex"
        discountAmount.textContent = `${data.discount_amount.toLocaleString()} تومان`

        updateFinalTotal()
        showNotification("کد تخفیف با موفقیت اعمال شد", "success")

        // Clear coupon input
        document.getElementById("couponCode").value = ""
      } else {
        showNotification(data.message || "کد تخفیف نامعتبر است", "error")
      }
    })
    .catch((error) => {
      console.error("[DEBUG] Coupon error:", error)
      showNotification("خطا در اعمال کد تخفیف", "error")
    })
    .finally(() => {
      couponButton.textContent = originalText
      couponButton.disabled = false
    })
}

// Real-time field validation
document.addEventListener("DOMContentLoaded", () => {
  const inputs = document.querySelectorAll("#checkoutForm input, #checkoutForm select, #checkoutForm textarea")

  inputs.forEach((input) => {
    input.addEventListener("blur", function () {
      if (this.hasAttribute("required") && !this.value.trim()) {
        showFieldError(this, "این فیلد الزامی است")
      } else {
        clearFieldError(this)
      }
    })

    input.addEventListener("input", function () {
      clearFieldError(this)
    })
  })
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
