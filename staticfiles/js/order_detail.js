document.addEventListener('DOMContentLoaded', () => {

    function cancelOrder(orderId) {
        if (confirm('آیا مطمئن هستید که می‌خواهید این سفارش را لغو کنید؟')) {
            alert('سفارش با موفقیت لغو شد.');

            return true;
        }
        return false;
    }

    window.cancelOrder = cancelOrder; // دسترسی سراسری برای onclick
});