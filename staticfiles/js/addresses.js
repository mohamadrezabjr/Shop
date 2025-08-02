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