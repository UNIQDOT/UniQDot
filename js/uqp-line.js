
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
// 팝업 이미지: 클릭하면 원본 크기로 새 탭에서 보기, 모바일 안내 문구
document.addEventListener('DOMContentLoaded', function () {
    const ko = () => document.documentElement.lang !== 'en';
    document.querySelectorAll('.product-modal .UQP-modal-image').forEach(img => {
        img.title = ko() ? '클릭하면 원본 크기로 봅니다' : 'Click to view full size';
        img.addEventListener('click', () => window.open(img.src, '_blank', 'noopener'));
        const hint = document.createElement('p');
        hint.className = 'uqp-zoom-hint';
        hint.textContent = ko() ? '← 좌우로 밀어서 보거나, 이미지를 눌러 원본으로 보세요' : '← Swipe sideways, or tap the image to view full size';
        img.closest('.lixer-image-item').after(hint);
    });
});
