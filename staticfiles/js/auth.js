// Auth Pages Functionality
document.addEventListener("DOMContentLoaded", () => {
  initializeAuth()
})

function initializeAuth() {
  // Initialize form validation
  initializeFormValidation()

  // Initialize password strength checker
  initializePasswordStrength()

  // Initialize password match checker
  initializePasswordMatch()

  // Initialize username/email validation
  initializeUsernameValidation()

  // Initialize phone validation
  initializePhoneValidation()
}

// Form Validation
function initializeFormValidation() {
  const forms = document.querySelectorAll(".auth-form")

  forms.forEach((form) => {
    form.addEventListener("submit", function (e) {
      if (!validateForm(this)) {
        e.preventDefault()
      } else {
        // Show loading state
        const submitBtn = this.querySelector(".auth-btn")
        submitBtn.classList.add("loading")
        submitBtn.disabled = true
      }
    })
  })
}

function validateForm(form) {
  let isValid = true
  const inputs = form.querySelectorAll("input[required]")

  inputs.forEach((input) => {
    if (!validateField(input)) {
      isValid = false
    }
  })

  return isValid
}

function validateField(input) {
  const value = input.value.trim()
  const type = input.type
  const name = input.name

  // Remove previous error states
  input.classList.remove("error", "success")

  let isValid = true
  let errorMessage = ""

  // Required field validation
  if (!value) {
    isValid = false
    errorMessage = "این فیلد الزامی است"
  } else {
    // Specific validations
    switch (type) {
      case "email":
        if (!isValidEmail(value)) {
          isValid = false
          errorMessage = "فرمت ایمیل صحیح نیست"
        }
        break
      case "tel":
        if (!isValidPhone(value)) {
          isValid = false
          errorMessage = "شماره موبایل صحیح نیست"
        }
        break
      case "password":
        if (value.length < 8) {
          isValid = false
          errorMessage = "رمز عبور باید حداقل 8 کاراکتر باشد"
        }
        break
    }

    // Username validation
    if (name === "username") {
      if (value.length < 3) {
        isValid = false
        errorMessage = "نام کاربری باید حداقل 3 کاراکتر باشد"
      } else if (!/^[a-zA-Z0-9_]+$/.test(value)) {
        isValid = false
        errorMessage = "نام کاربری فقط می‌تواند شامل حروف، اعداد و _ باشد"
      }
    }
  }

  // Apply validation state
  if (isValid) {
    input.classList.add("success")
  } else {
    input.classList.add("error")
    showFieldError(input, errorMessage)
  }

  return isValid
}

function showFieldError(input, message) {
  // Remove existing error message
  const existingError = input.parentNode.parentNode.querySelector(".field-error")
  if (existingError) {
    existingError.remove()
  }

  // Add new error message
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

  input.parentNode.parentNode.appendChild(errorDiv)
}

// Email validation
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// Phone validation
function isValidPhone(phone) {
  const phoneRegex = /^09[0-9]{9}$/
  return phoneRegex.test(phone)
}

// Password Strength Checker
function initializePasswordStrength() {
  const passwordInput = document.getElementById("password1")
  if (!passwordInput) return

  passwordInput.addEventListener("input", function () {
    checkPasswordStrength(this.value)
  })
}

function checkPasswordStrength(password) {
  const strengthBar = document.querySelector(".strength-fill")
  const strengthText = document.querySelector(".strength-text")

  if (!strengthBar || !strengthText) return

  let strength = 0
  let strengthLabel = ""

  // Length check
  if (password.length >= 8) strength += 1
  if (password.length >= 12) strength += 1

  // Character variety checks
  if (/[a-z]/.test(password)) strength += 1
  if (/[A-Z]/.test(password)) strength += 1
  if (/[0-9]/.test(password)) strength += 1
  if (/[^A-Za-z0-9]/.test(password)) strength += 1

  // Remove all strength classes
  strengthBar.className = "strength-fill"

  // Apply strength class and label
  if (strength <= 2) {
    strengthBar.classList.add("weak")
    strengthLabel = "ضعیف"
  } else if (strength <= 3) {
    strengthBar.classList.add("fair")
    strengthLabel = "متوسط"
  } else if (strength <= 4) {
    strengthBar.classList.add("good")
    strengthLabel = "خوب"
  } else {
    strengthBar.classList.add("strong")
    strengthLabel = "قوی"
  }

  strengthText.textContent = `قدرت رمز عبور: ${strengthLabel}`
}

// Password Match Checker
function initializePasswordMatch() {
  const password1 = document.getElementById("password1")
  const password2 = document.getElementById("password2")
  const matchDiv = document.getElementById("passwordMatch")

  if (!password1 || !password2 || !matchDiv) return

  function checkPasswordMatch() {
    const pass1 = password1.value
    const pass2 = password2.value

    if (pass2.length === 0) {
      matchDiv.textContent = ""
      matchDiv.className = "password-match"
      return
    }

    if (pass1 === pass2) {
      matchDiv.textContent = "✓ رمزهای عبور مطابقت دارند"
      matchDiv.className = "password-match match"
    } else {
      matchDiv.textContent = "✗ رمزهای عبور مطابقت ندارند"
      matchDiv.className = "password-match no-match"
    }
  }

  password1.addEventListener("input", checkPasswordMatch)
  password2.addEventListener("input", checkPasswordMatch)
}

// Username Validation
function initializeUsernameValidation() {
  const usernameInput = document.getElementById("username")
  const validationIcon = document.getElementById("usernameValidation")

  if (!usernameInput || !validationIcon) return

  let validationTimeout

  usernameInput.addEventListener("input", function () {
    const username = this.value.trim()

    // Clear previous timeout
    clearTimeout(validationTimeout)

    // Clear validation icon
    validationIcon.innerHTML = ""
    validationIcon.className = "validation-icon"

    if (username.length < 3) return

    // Show loading
    validationIcon.innerHTML = '<i class="fas fa-spinner fa-spin"></i>'

    // Simulate API call with timeout
    validationTimeout = setTimeout(() => {
      checkUsernameAvailability(username, validationIcon)
    }, 500)
  })
}

function checkUsernameAvailability(username, validationIcon) {
  // Simulate API call
  // In real implementation, make AJAX call to Django view
  fetch(`/check-username/?username=${encodeURIComponent(username)}`)
    .then((response) => response.json())
    .then((data) => {
      if (data.available) {
        validationIcon.innerHTML = '<i class="fas fa-check"></i>'
        validationIcon.className = "validation-icon success"
      } else {
        validationIcon.innerHTML = '<i class="fas fa-times"></i>'
        validationIcon.className = "validation-icon error"
      }
    })
    .catch(() => {
      // Fallback for demo - assume available
      validationIcon.innerHTML = '<i class="fas fa-check"></i>'
      validationIcon.className = "validation-icon success"
    })
}

// Phone Validation
function initializePhoneValidation() {
  const phoneInput = document.getElementById("phone")
  if (!phoneInput) return

  phoneInput.addEventListener("input", function () {
    // Remove non-digits
    let value = this.value.replace(/\D/g, "")

    // Limit to 11 digits
    if (value.length > 11) {
      value = value.slice(0, 11)
    }

    // Format: 09123456789
    this.value = value
  })
}

// Toggle Password Visibility
function togglePassword(inputId) {
  const input = document.getElementById(inputId)
  const button = input.parentNode.querySelector(".toggle-password")
  const icon = button.querySelector("i")

  if (input.type === "password") {
    input.type = "text"
    icon.classList.remove("fa-eye")
    icon.classList.add("fa-eye-slash")
  } else {
    input.type = "password"
    icon.classList.remove("fa-eye-slash")
    icon.classList.add("fa-eye")
  }
}

// Social Login
function socialLogin(provider) {
  // Show loading state
  const button = event.target.closest(".social-btn")
  const originalText = button.innerHTML

  button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> در حال اتصال...'
  button.disabled = true

  // Simulate social login
  setTimeout(() => {
    // In real implementation, redirect to social auth URL
    window.location.href = `/auth/${provider}/`
  }, 1000)
}

// Real-time field validation
document.addEventListener("DOMContentLoaded", () => {
  const inputs = document.querySelectorAll(".auth-form input")

  inputs.forEach((input) => {
    input.addEventListener("blur", function () {
      if (this.value.trim()) {
        validateField(this)
      }
    })

    input.addEventListener("input", function () {
      // Clear error state on input
      this.classList.remove("error")
      const errorMsg = this.parentNode.parentNode.querySelector(".field-error")
      if (errorMsg) {
        errorMsg.remove()
      }
    })
  })
})

// Form submission handling
document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("loginForm")
  const registerForm = document.getElementById("registerForm")

  if (loginForm) {
    loginForm.addEventListener("submit", (e) => {
      console.log("Login form submitted")
    })
  }

  if (registerForm) {
    registerForm.addEventListener("submit", (e) => {
      // Check terms acceptance
      const termsCheckbox = document.getElementById("terms")
      if (!termsCheckbox.checked) {
        e.preventDefault()
        showNotification("لطفاً شرایط و قوانین را بپذیرید", "warning")
        return
      }

      console.log("Register form submitted")
    })
  }
})

// Notification Functionality
function showNotification(message, type) {
  const notificationDiv = document.createElement("div")
  notificationDiv.className = `notification ${type}`
  notificationDiv.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    padding: 10px;
    border-radius: 5px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    z-index: 1000;
  `

  const icon = document.createElement("i")
  icon.className = `fas fa-${type === "warning" ? "exclamation-triangle" : "check"}`
  icon.style.cssText = `margin-right: 10px;`

  const text = document.createElement("span")
  text.textContent = message

  notificationDiv.appendChild(icon)
  notificationDiv.appendChild(text)

  document.body.appendChild(notificationDiv)

  // Remove notification after 3 seconds
  setTimeout(() => {
    document.body.removeChild(notificationDiv)
  }, 3000)
}
