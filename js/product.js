document.addEventListener('DOMContentLoaded', function () {
    createFilterEvent();
    
    const urlParams = new URLSearchParams(window.location.search);
    const filter = urlParams.get('filter');
    
    if (filter) {
        document.querySelector('button')
        const button = document.querySelector(`button[data-filter=${filter}]`);
        button.click();
    }
});

function createFilterEvent() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const productItems = document.querySelectorAll('.product-item');

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            tabButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');            

            const category = button.dataset.filter;
            const language = category.substring(0, 3);
            filterProducts(language, button.dataset.filter);
        });
    });

    function filterProducts(language, category) {
        productItems.forEach(item => {
            const filter = item.dataset.filter;
            const quantumKeywords = [language + 'UKC', language + 'UPR', language + 'PbS', language + 'CIS'];
            const bioQuantumKeywords = [language + 'UWC', language + 'UWR', language + 'QD'];
            const crossLinkingKeywords = [language + 'UQP'];
            const otherKeywords = [language + 'Customizing'];

            const show = (
                category === language + 'All' ||
                (category === language + 'Quantum' && new RegExp(quantumKeywords.join('|')).test(filter)) ||
                (category === language + 'BioQuantum' && new RegExp(bioQuantumKeywords.join('|')).test(filter)) ||
                (category === language + 'CrossLinking' && new RegExp(crossLinkingKeywords.join('|')).test(filter)) ||
                (category === language + 'Other' && new RegExp(otherKeywords.join('|')).test(filter))
            );

            show ? fadeIn(item) : fadeOut(item);
        });
    }
}

function fadeIn(element) {
    element.style.opacity = '0';
    element.style.display = 'block';
    setTimeout(() => {
        element.style.opacity = '1';
    }, 10);
}

function fadeOut(element) {
    element.style.opacity = '0';
    setTimeout(() => {
        element.style.display = 'none';
    }, 300);
}

// 모달 열기 기능
document.addEventListener('DOMContentLoaded', function() {
    // 모달 열기
    // document.querySelectorAll('.detail-btn').forEach(button => {
    //     button.addEventListener('click', function(e) {
    //         e.preventDefault();
    //         const filter = button.dataset.filter;
            
    //         if (filter) {
    //             window.location.href = `./${filter}.html`;
    //         }
    //     });
    // });

    // 모달 닫기
    // document.querySelectorAll('.close-modal').forEach(closeButton => {
    //     closeButton.addEventListener('click', function() {
    //         this.closest('.product-modal').style.display = 'none';
    //     });
    // });

    // 모달 외부 클릭시 닫기
    // window.addEventListener('click', function(e) {
    //     if (e.target.classList.contains('product-modal')) {
    //         e.target.style.display = 'none';
    //     }
    // });
});

// ESC 키로 모달 닫기
// document.addEventListener('keydown', function (e) {
//     if (e.key === 'Escape') {
//         const openModals = document.querySelectorAll('.product-modal[style*="display: block"]');
//         openModals.forEach(modal => {
//             modal.style.display = 'none';
//             document.body.style.overflow = '';
//         });
//     }
// });

// 이미지 에러 대응 (SVG 대체 이미지 출력)
const productImages = document.querySelectorAll('.product-image img');
productImages.forEach(img => {
    img.onerror = function () {
        this.src = '../img/no_image.gif';
    };
});