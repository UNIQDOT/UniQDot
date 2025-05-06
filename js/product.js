document.addEventListener('DOMContentLoaded', function () {
    createFilterEvent();
    createNoneImageEvent();
    
    const urlParams = new URLSearchParams(window.location.search);
    const filter = urlParams.get('filter');
    
    if (filter) {
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
            filterProducts(button.dataset.filter);
        });
    });

    function filterProducts(category) {
        productItems.forEach(item => {
            const filter = item.dataset.filter;
            const quantumKeywords = ['UKC', 'UPR', 'PbS', 'CIS'];
            const bioQuantumKeywords = ['UWC', 'UWR', 'QD'];
            const crossLinkingKeywords = ['UQP'];
            const otherKeywords = ['Customizing'];

            const show = (
                category === 'All' ||
                (category === 'Quantum' && new RegExp(quantumKeywords.join('|')).test(filter)) ||
                (category === 'BioQuantum' && new RegExp(bioQuantumKeywords.join('|')).test(filter)) ||
                (category === 'CrossLinking' && new RegExp(crossLinkingKeywords.join('|')).test(filter)) ||
                (category === 'Other' && new RegExp(otherKeywords.join('|')).test(filter))
            );

            show ? fadeIn(item) : fadeOut(item);
        });

        function fadeIn(element) {
            element.style.opacity = '0';
            element.style.display = 'block';
            setTimeout(() => {
                element.style.opacity = '1';
            }, 300);
        }
        
        function fadeOut(element) {
            element.style.opacity = '0';
            setTimeout(() => {
                element.style.display = 'none';
            }, 300);
        }
    }
}

// 이미지 에러 대응 (SVG 대체 이미지 출력)
function createNoneImageEvent() {
    const productImages = document.querySelectorAll('.product-image img');
    productImages.forEach(img => {
        img.onerror = function () {
            this.src = '../img/no_image.gif';
        };
    });
}
