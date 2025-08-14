document.addEventListener('DOMContentLoaded', () => {
    console.log('addresses.js loaded');

    const addAddressBtn = document.querySelector('#add-address-btn');
    const modal = document.querySelector('#add-address-modal');
    const closeModal = document.querySelector('#add-address-modal .close');
    const addressForm = document.querySelector('#add-address-modal .auth-form');



    // باز کردن مودال
    addAddressBtn.addEventListener('click', (event) => {
        event.preventDefault();
        modal.style.display = 'block';
        modal.scrollIntoView({ behavior: 'smooth' });
    });

    // بستن مودال با دکمه بسته شدن
    closeModal.addEventListener('click', (event) => {
        event.stopPropagation();
        modal.style.display = 'none';
    });

    // بستن مودال با کلیک خارج از آن
    modal.addEventListener('click', (event) => {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });

    // بستن مودال با کلید Esc
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && modal.style.display === 'block') {
            modal.style.display = 'none';
        }
    });

    // اعتبارسنجی کد پستی
    addressForm.addEventListener('submit', (event) => {
        const postalCode = document.querySelector('#postal_code').value;
        if (!/^\d+$/.test(postalCode)) {
            event.preventDefault();
            alert('کد پستی باید فقط شامل اعداد باشد.');
        } else {
            modal.style.display = 'none';
        }
    });
});
document.addEventListener("DOMContentLoaded", () => {
    const editButtons = document.querySelectorAll("#edit-address-btn");
    const editModal = document.querySelector("#edit-address-modal");
    const editForm = document.getElementById("edit-address-form");


    // فیلدهای فرم ویرایش
    const cityInput = editModal.querySelector("input[name='city']");
    const addressInput = editModal.querySelector("textarea[name='address']");
    const unitInput = editModal.querySelector("input[name='unit']");
    const postalInput = editModal.querySelector("input[name='postal_code']");
    const form = editModal.querySelector('form')

    // بستن مدال‌ها
    document.querySelectorAll(".modal .close").forEach(closeBtn => {
        closeBtn.addEventListener("click", () => {
            closeBtn.closest(".modal").style.display = "none";
        });
    });

    // باز کردن مدال و پر کردن فیلدها
    editButtons.forEach(btn => {
        btn.addEventListener('click', (event) => {
            event.preventDefault();

            editForm.action = `/profile/addresses/edit/${btn.dataset.id}/`;
            cityInput.value = btn.dataset.city;
            addressInput.value = btn.dataset.address;
            unitInput.value = btn.dataset.unit || "";
            postalInput.value = btn.dataset.postal;

            editModal.style.display = 'block';
            editModal.scrollIntoView({ behavior: 'smooth' });
        });
    });
});


