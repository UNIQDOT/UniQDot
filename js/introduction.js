document.addEventListener('DOMContentLoaded', function() {
    // 비디오 재생 기능
    const video = document.getElementById('promotion-video');
    const playButton = document.getElementById('play-button');
    const videoOverlay = document.querySelector('.video-overlay');
    
    if (video && playButton && videoOverlay) {
        // 비디오 클릭 이벤트
        playButton.addEventListener('click', function() {
            if (video.paused) {
                // 비디오 재생
                video.play();
                videoOverlay.classList.add('playing');
            } else {
                // 비디오 일시정지
                video.pause();
                videoOverlay.classList.remove('playing');
            }
        });
        
        // 비디오 영역 클릭 이벤트
        video.addEventListener('click', function() {
            if (video.paused) {
                // 비디오 재생
                video.play();
                videoOverlay.classList.add('playing');
            } else {
                // 비디오 일시정지
                video.pause();
                videoOverlay.classList.remove('playing');
            }
        });
        
        // 비디오 재생 종료 시 오버레이 다시 표시
        video.addEventListener('ended', function() {
            videoOverlay.classList.remove('playing');
            video.currentTime = 0; // 비디오를 처음으로 되감기
        });

        // 비디오 데이터 로딩 완료 이벤트
        video.addEventListener('loadeddata', function() {
            // 비디오 준비 완료
            console.log('비디오 로딩 완료');
        });
        
        // 비디오 로드 오류 처리
        video.addEventListener('error', function() {
            console.error('비디오 로딩 중 오류 발생');
            playButton.textContent = '영상 재생 불가';
            playButton.disabled = true;
        });
    }

    // 스크롤 애니메이션
    const sections = document.querySelectorAll('.section');
    
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.2,
    };
    
    const observer = new IntersectionObserver(function(entries, observer) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    sections.forEach(section => {
        observer.observe(section);
    });
}); 