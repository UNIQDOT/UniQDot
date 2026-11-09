// 양자점 입자 배경(원본 제너러티브 그래픽): 크기에 따라 발광색이 달라지는 양자점의 특성을 모티브로 함
(function () {
    const hosts = document.querySelectorAll('.hero, .pg-hero');
    if (!hosts.length) return;
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    // 크기(작음→큼) = 파랑→초록→주황→빨강 (QD 크기-발광색 관계)
    const COLORS = ['94,170,255', '90,220,190', '255,196,87', '255,125,60', '255,84,84'];
    hosts.forEach(host => {
        const cv = document.createElement('canvas');
        cv.className = 'qdbg'; cv.setAttribute('aria-hidden', 'true');
        host.insertBefore(cv, host.firstChild);
        const ctx = cv.getContext('2d');
        let w, h, dots = [], raf, visible = true;
        const dpr = Math.min(devicePixelRatio || 1, 2);
        function size() {
            w = host.clientWidth; h = host.clientHeight;
            cv.width = w * dpr; cv.height = h * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
            const n = Math.round(Math.min(70, Math.max(24, w * h / 16000)));
            dots = Array.from({ length: n }, () => {
                const s = Math.random();
                return { x: Math.random() * w, y: Math.random() * h, r: 1.2 + s * 3.2,
                    c: COLORS[Math.min(4, (s * 5) | 0)], vx: (Math.random() - .5) * .22, vy: (Math.random() - .5) * .22, p: Math.random() * 6.28 };
            });
        }
        function frame(t) {
            ctx.clearRect(0, 0, w, h);
            for (let i = 0; i < dots.length; i++) {
                const a = dots[i];
                if (!reduce) { a.x += a.vx; a.y += a.vy; if (a.x < -10) a.x = w + 10; if (a.x > w + 10) a.x = -10; if (a.y < -10) a.y = h + 10; if (a.y > h + 10) a.y = -10; }
                for (let j = i + 1; j < dots.length; j++) {
                    const b = dots[j], dx = a.x - b.x, dy = a.y - b.y, d = dx * dx + dy * dy;
                    if (d < 15000) { ctx.strokeStyle = `rgba(160,190,255,${.16 * (1 - d / 15000)})`; ctx.lineWidth = .6; ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke(); }
                }
                const pulse = reduce ? 1 : .75 + .25 * Math.sin(t / 900 + a.p);
                const g = ctx.createRadialGradient(a.x, a.y, 0, a.x, a.y, a.r * 7);
                g.addColorStop(0, `rgba(${a.c},${.9 * pulse})`); g.addColorStop(.25, `rgba(${a.c},${.28 * pulse})`); g.addColorStop(1, `rgba(${a.c},0)`);
                ctx.fillStyle = g; ctx.beginPath(); ctx.arc(a.x, a.y, a.r * 7, 0, 6.283); ctx.fill();
            }
            if (!reduce && visible) raf = requestAnimationFrame(frame);
        }
        size(); frame(0);
        addEventListener('resize', () => { size(); if (reduce) frame(0); });
        if ('IntersectionObserver' in window) new IntersectionObserver(es => {
            visible = es[0].isIntersecting; cancelAnimationFrame(raf); if (visible && !reduce) raf = requestAnimationFrame(frame);
        }).observe(host);
    });
})();
