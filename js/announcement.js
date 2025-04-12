// 네비게이션 바 스크롤 효과
document.addEventListener('DOMContentLoaded', function() {
    const nav = document.querySelector('.main-nav');
    
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
    });

    // 네비게이션 메뉴 활성화
    const currentPage = window.location.pathname.split('/').pop();
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPage || href.includes(currentPage)) {
            link.classList.add('active');
            
            // 부모가 드롭다운인 경우 부모도 활성화
            const parentLi = link.closest('.nav-item');
            if (parentLi.classList.contains('dropdown')) {
                parentLi.querySelector('.dropdown-toggle').classList.add('active');
            }
        }
    });

    // 페이지네이션 기능
    const pageNumbers = document.querySelectorAll('.page-number');
    const pageNavs = document.querySelectorAll('.page-nav');
    
    pageNumbers.forEach(number => {
        number.addEventListener('click', function(e) {
            e.preventDefault();
            
            // 이전에 활성화된 페이지 번호 비활성화
            document.querySelector('.page-number.active').classList.remove('active');
            
            // 클릭한 페이지 번호 활성화
            this.classList.add('active');
            
            // 여기에 실제 페이지 로드 로직 추가 (필요한 경우)
        });
    });

    // 첫 페이지, 마지막 페이지 등의 네비게이션 버튼 기능 (예시)
    pageNavs.forEach(nav => {
        nav.addEventListener('click', function(e) {
            e.preventDefault();
            
            // 현재 활성화된 페이지 번호
            const activePage = document.querySelector('.page-number.active');
            const currentPage = parseInt(activePage.textContent);
            
            if (this.classList.contains('first-page')) {
                // 첫 페이지로 이동 로직
                console.log('첫 페이지로 이동');
            } 
            else if (this.classList.contains('prev-page')) {
                // 이전 페이지로 이동 로직
                console.log('이전 페이지로 이동');
            }
            else if (this.classList.contains('next-page')) {
                // 다음 페이지로 이동 로직
                console.log('다음 페이지로 이동');
            }
            else if (this.classList.contains('last-page')) {
                // 마지막 페이지로 이동 로직
                console.log('마지막 페이지로 이동');
            }
            
            // 여기에 실제 페이지 로드 로직 추가 (필요한 경우)
        });
    });

    // 다운로드 버튼 기능
    const downloadBtns = document.querySelectorAll('.download-btn');
    
    downloadBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // 파일 다운로드 시작 로그 출력
            console.log('파일 다운로드 시작: ' + this.getAttribute('href'));
            
            // 다운로드 버튼 클릭 이벤트를 추적하거나 분석하는 코드를 추가할 수 있습니다.
            // 예: 다운로드 횟수 추적, 사용자 피드백 등
        });
    });
}); 