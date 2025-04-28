
// 모달 열기 기능
document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('.image-box').forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const filter = button.dataset.filter;
            
            if (filter) {
                document.querySelector('#' + filter).style.display = 'block'; 
            }
        });
    });

    document.querySelectorAll('.close-modal').forEach(closeButton => {
        closeButton.addEventListener('click', function() {
            this.closest('.product-modal').style.display = 'none';
        });
    });

    window.addEventListener('click', function(e) {
        if (e.target.classList.contains('product-modal')) {
            e.target.style.display = 'none';
        }
    });
});

// ESC 키로 모달 닫기
document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
        const openModals = document.querySelectorAll('.product-modal[style*="display: block"]');
        openModals.forEach(modal => {
            modal.style.display = 'none';
            document.body.style.overflow = '';
        });
    }
});