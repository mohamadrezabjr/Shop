document.addEventListener('DOMContentLoaded', () => {
    console.log('password-reset-confirm.js loaded');

    const password1 = document.querySelector('#new_password1');
    const password2 = document.querySelector('#new_password2');
    const strengthFill = document.querySelector('.strength-fill');
    const strengthText = document.querySelector('.strength-text');
    const matchText = document.querySelector('.password-match');

    function updateStrength() {
        const value = password1.value;
        let strength = 0;
        if (value.length >= 8) strength++;
        if (/[A-Z]/.test(value)) strength++;
        if (/[a-z]/.test(value)) strength++;
        if (/\d/.test(value)) strength++;
        if (/[^A-Za-z0-9]/.test(value)) strength++;

        strengthFill.className = 'strength-fill';
        strengthText.textContent = '';
        if (strength <= 1) {
            strengthFill.classList.add('weak');
            strengthText.textContent = 'ضعیف';
        } else if (strength <= 2) {
            strengthFill.classList.add('fair');
            strengthText.textContent = 'متوسط';
        } else if (strength <= 3) {
            strengthFill.classList.add('good');
            strengthText.textContent = 'خوب';
        } else {
            strengthFill.classList.add('strong');
            strengthText.textContent = 'قوی';
        }
    }

    function updateMatch() {
        if (password2.value === '') {
            matchText.textContent = '';
            matchText.className = 'password-match';
            return;
        }
        if (password1.value === password2.value) {
            matchText.textContent = '';
            matchText.classList.add('match');
        } else {
            matchText.textContent = 'رمزها تطبیق ندارند';
            matchText.classList.add('no-match');
        }
    }

    password1.addEventListener('input', updateStrength);
    password2.addEventListener('input', updateMatch);

    function togglePassword(id) {
        const input = document.querySelector(`#${id}`);
        const type = input.type === 'password' ? 'text' : 'password';
        input.type = type;
    }

    window.togglePassword = togglePassword;
});