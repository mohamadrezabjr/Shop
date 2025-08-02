document.addEventListener('DOMContentLoaded', () => {
    const editProfileBtn = document.querySelector('.edit-profile-btn');
    const modal = document.querySelector('#edit-profile-modal');
    const closeModal = document.querySelector('.modal .close');

    // Open modal
    editProfileBtn.addEventListener('click', () => {
        modal.style.display = 'block';
    });

    // Close modal
    closeModal.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    // Close modal when clicking outside
    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });
});