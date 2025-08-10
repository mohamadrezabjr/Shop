document.addEventListener('DOMContentLoaded', () => {
    console.log('password-reset.js loaded at ' + new Date().toLocaleString('fa-IR'));

    const form = document.querySelector('.auth-form');
    if (form) {
        form.addEventListener('submit', (e) => {
            console.log('Form submitted at ' + new Date().toLocaleString('fa-IR'));
            // می‌توانید اینجا اعتبارسنجی اضافه کنید
        });
    }
});