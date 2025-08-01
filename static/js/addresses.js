document.addEventListener('DOMContentLoaded', () => {
    console.log('addresses.js loaded');

    const addAddressBtn = document.querySelector('#add-address-btn');
    const modal = document.querySelector('#add-address-modal');
    const closeModal = document.querySelector('#add-address-modal .close');
    const messageModals = document.querySelectorAll('.modal:not(#add-address-modal)');

    // بررسی وجود عناصر
    if (!addAddressBtn) {
        console.error('Add address button not found!');
        return;
    }
    if (!modal) {
        console.error('Add address modal not found!');
        return;
    }
    if (!closeModal) {
        console.error('Close button for modal not found!');
        return;
    }

    // باز کردن مودال
    addAddressBtn.addEventListener('click', (event) => {
        event.preventDefault(); // جلوگیری از رفتار پیش‌فرض
        console.log('Add address button clicked');
        modal.style.display = 'block';
        modal.scrollIntoView({ behavior: 'smooth' });
    });

    // بستن مودال با دکمه بسته شدن
    closeModal.addEventListener('click', (event) => {
        event.stopPropagation(); // جلوگیری از انتشار رویداد
        console.log('Close button clicked');
        modal.style.display = 'none';
    });

    // بستن مودال با کلیک خارج از آن
    modal.addEventListener('click', (event) => {
        if (event.target === modal) {
            console.log('Clicked outside modal');
            modal.style.display = 'none';
        }
    });

    // بستن مودال‌های پیام
    messageModals.forEach((msgModal) => {
        const closeMsgModal = msgModal.querySelector('.close');
        if (closeMsgModal) {
            closeMsgModal.addEventListener('click', () => {
                console.log('Message modal close button clicked');
                msgModal.style.display = 'none';
            });
        }
        msgModal.addEventListener('click', (event) => {
            if (event.target === msgModal) {
                console.log('Clicked outside message modal');
                msgModal.style.display = 'none';
            }
        });
    });
});