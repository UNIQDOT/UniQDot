(async () => {
    const BASE_ = '../';
    const data = await (await fetch(BASE_ + 'data/products.json')).json();
    const grid = document.getElementById('grid'), chips = document.getElementById('chips');
    const q = document.getElementById('q'), fab = document.getElementById('fab');
    const lang = () => (document.documentElement.lang === 'en' ? 'en' : 'ko');
    let dict = {}, toast;
    let cat = new URLSearchParams(location.search).get('filter') || 'All';
    if (cat !== 'All' && !data.products.some(p => p.category === cat)) cat = 'All';
    const fmt = n => '₩' + n.toLocaleString('ko-KR');
    const T = k => k.split('.').reduce((o, x) => (o == null ? o : o[x]), dict) ?? '';

    function renderChips() {
        const cats = ['All', ...new Set(data.products.map(p => p.category))];
        chips.innerHTML = cats.map(c =>
            `<button type="button" class="chip${c === cat ? ' on' : ''}" data-c="${c}" role="tab" aria-selected="${c === cat}">${c === 'All' ? T('shop.all') : T('shop.cats.' + c)}</button>`).join('');
    }
    function render() {
        const term = q.value.trim().toLowerCase();
        const list = data.products.filter(p => (cat === 'All' || p.category === cat) &&
            (!term || (p.name + ' ' + p.desc + ' ' + T('shop.cats.' + p.category)).toLowerCase().includes(term)));
        grid.innerHTML = list.length ? list.map(p => `
            <article class="pcard" data-id="${p.id}">
                <div class="im"><img src="../${p.image}" alt="${p.name}" loading="lazy" onerror="this.style.opacity=.15"></div>
                <div class="bd">
                    <span class="tag">${T('shop.cats.' + p.category)}</span>
                    <h3>${p.name}</h3>
                    <p>${p.desc}</p>
                    <div class="price">${p.price != null ? fmt(p.price) + (p.unit ? ' / ' + p.unit : '') + ' <small>' + T('shop.price_note') + '</small>' : T('shop.price_rfq')}</div>
                    <div class="row">
                        <div class="qty"><button type="button" data-d="-1" aria-label="-">−</button><input type="number" min="1" max="999" value="1" aria-label="${T('shop.qty')}"><button type="button" data-d="1" aria-label="+">+</button></div>
                        <button type="button" class="btn2 add">${T('shop.add')}</button>
                    </div>
                    <a class="link" href="${p.detail}">${T('shop.detail')}</a>
                </div>
            </article>`).join('') : `<p class="empty">${T('shop.noresult')}</p>`;
    }
    function updateFab() {
        const n = UQCart.count();
        document.getElementById('fab-n').textContent = n;
        fab.classList.toggle('show', n > 0);
    }
    async function refreshLang() { dict = await loadDict(lang()); renderChips(); render(); }

    chips.addEventListener('click', e => { const b = e.target.closest('.chip'); if (b) { cat = b.dataset.c; renderChips(); render(); } });
    q.addEventListener('input', render);
    grid.addEventListener('click', e => {
        const card = e.target.closest('.pcard'); if (!card) return;
        const inp = card.querySelector('input');
        const step = e.target.closest('[data-d]');
        if (step) { inp.value = Math.max(1, Math.min(999, (+inp.value || 1) + +step.dataset.d)); return; }
        const add = e.target.closest('.add');
        if (add) {
            UQCart.add(card.dataset.id, Math.max(1, +inp.value || 1));
            const old = add.textContent; add.textContent = '✓ ' + T('shop.added');
            setTimeout(() => (add.textContent = old), 1200);
        }
    });
    document.addEventListener('uq-cart', updateFab);
    document.addEventListener('uq-lang', refreshLang);
    updateFab();
    await refreshLang();
})();
