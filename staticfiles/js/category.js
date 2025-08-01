// Category page specific functionality
document.addEventListener("DOMContentLoaded", () => {
  initializeCategoryPage()
})

function initializeCategoryPage() {
  // Initialize subcategory filters
  initializeSubcategoryFilters()

  // Initialize brand filters if available
  initializeBrandFilters()

  // Initialize stock filter
  initializeStockFilter()
}

// Subcategory filters
function initializeSubcategoryFilters() {
  const subcategoryCheckboxes = document.querySelectorAll('input[name="subcategory"]')

  subcategoryCheckboxes.forEach((checkbox) => {
    checkbox.addEventListener("change", () => {
      updateSubcategoryCount()
    })
  })
}

// Brand filters
function initializeBrandFilters() {
  const brandCheckboxes = document.querySelectorAll('input[name="brand"]')

  brandCheckboxes.forEach((checkbox) => {
    checkbox.addEventListener("change", () => {
      updateBrandCount()
    })
  })
}

// Stock filter
function initializeStockFilter() {
  const stockCheckbox = document.querySelector('input[name="in_stock"]')

  if (stockCheckbox) {
    stockCheckbox.addEventListener("change", () => {
      // Auto-submit form when stock filter changes
      document.getElementById("filtersForm").submit()
    })
  }
}

// Update subcategory count display
function updateSubcategoryCount() {
  const checkedSubcategories = document.querySelectorAll('input[name="subcategory"]:checked')
  const subcategoryGroup = document.querySelector(".filter-group h4")

  if (checkedSubcategories.length > 0) {
    subcategoryGroup.textContent = `زیردسته‌ها (${checkedSubcategories.length} انتخاب شده)`
  } else {
    subcategoryGroup.textContent = "زیردسته‌ها"
  }
}

// Update brand count display
function updateBrandCount() {
  const checkedBrands = document.querySelectorAll('input[name="brand"]:checked')
  const brandGroup = document.querySelector(".filter-group h4")

  if (checkedBrands.length > 0) {
    brandGroup.textContent = `برند (${checkedBrands.length} انتخاب شده)`
  } else {
    brandGroup.textContent = "برند"
  }
}

// Override sort function for category page
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

// Override clear filters for category page
function clearAllFilters() {
  const url = new URL(window.location)
  // Keep only the category path
  window.location.href = url.pathname
}

// Category-specific filter removal
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

// Subcategory card hover effects
document.addEventListener("DOMContentLoaded", () => {
  const subcategoryCards = document.querySelectorAll(".subcategory-card")

  subcategoryCards.forEach((card) => {
    card.addEventListener("mouseenter", function () {
      this.style.transform = "translateY(-5px) scale(1.02)"
    })

    card.addEventListener("mouseleave", function () {
      this.style.transform = "translateY(0) scale(1)"
    })
  })
})

// Related category tracking
function trackCategoryView(categoryName) {
  // This could send analytics data
  console.log(`Viewing category: ${categoryName}`)
}

// Initialize category view tracking
document.addEventListener("DOMContentLoaded", () => {
  const categoryName = document.querySelector(".category-text h1")?.textContent
  if (categoryName) {
    trackCategoryView(categoryName)
  }
})
