// 제품 상세 페이지: 목록 링크 + 견적 담기 바
(function () {
    const MAP = { 'ukc-line': 'ukc-line', 'upr-line': 'upr-line', 'uwc-line': 'uwc-line', 'uwr-line': 'uwr-line', 'qd-microsphere': 'qd-microsphere',
        'pbs-qd': 'ulc-line', 'cis-qd': 'usc-line', 'uqp-line': 'uqp-line', 'custom-service': 'upen-line' };
    const key = location.pathname.split('/').pop().replace('.html', '');
    const id = MAP[key];
    const hero = document.querySelector('.pg-hero');
    if (!id || !hero) return;
    const L = () => (document.documentElement.lang === 'en' ? 'en' : 'ko');
    const TXT = { ko: ['← 제품 목록', '견적에 담기', '✓ 담았습니다', '견적서 보기 →'], en: ['← All products', 'Add to quote', '✓ Added', 'View quote →'] };
    const bar = document.createElement('div');
    bar.className = 'detail-bar';
    bar.innerHTML = '<a href="product.html" id="d-back"></a><div style="display:flex;gap:10px;align-items:center"><a href="quote.html" id="d-go" style="display:none"></a><button type="button" class="btn2" id="d-add"></button></div>';
    hero.insertAdjacentElement('afterend', bar);
    const paint = () => { const t = TXT[L()]; d('d-back').textContent = t[0]; d('d-add').textContent = t[1]; d('d-go').textContent = t[3]; };
    const d = i => document.getElementById(i);
    paint(); document.addEventListener('uq-lang', paint);
    d('d-add').addEventListener('click', () => {
        UQCart.add(id, 1);
        d('d-add').textContent = TXT[L()][2]; d('d-go').style.display = '';
        setTimeout(paint, 1500);
    });
})();
