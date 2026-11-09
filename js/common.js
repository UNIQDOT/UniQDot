// Shared header/footer + language switch (no jQuery needed)
const BASE = location.pathname.includes('/page/') ? '../' : '';
let dictCache = {};

async function loadDict(lang) {
    if (!dictCache[lang]) {
        const res = await fetch(`${BASE}lang/${lang}.json`);
        dictCache[lang] = await res.json();
    }
    return dictCache[lang];
}

async function setLanguage(lang) {
    try { localStorage.setItem('language', lang); } catch (e) {}
    document.documentElement.lang = lang;
    document.querySelectorAll('.lang-btn').forEach(b =>
        b.classList.toggle('active', b.dataset.language === lang));
    const dict = await loadDict(lang);
    document.querySelectorAll('[data-i18n]').forEach(el => {
        let v = dict;
        for (const k of el.dataset.i18n.split('.')) {
            v = v == null ? undefined : v[k];
        }
        if (typeof v === 'string') el.innerText = v;
    });
    document.querySelectorAll('[data-i18n-ph]').forEach(el => {
        let v = dict;
        for (const k of el.dataset.i18nPh.split('.')) v = v == null ? undefined : v[k];
        if (typeof v === 'string') el.placeholder = v;
    });
    document.dispatchEvent(new CustomEvent('uq-lang', { detail: lang }));
}

async function inject(id, path) {
    const host = document.getElementById(id);
    if (!host) return;
    const html = (await (await fetch(BASE + path)).text()).replaceAll('@/', BASE);
    host.innerHTML = html;
}

document.addEventListener('DOMContentLoaded', async () => {
    await Promise.all([inject('header', 'common/header.html'), inject('footer', 'common/footer.html')]);
    let lang = 'ko';
    try { lang = localStorage.getItem('language') || 'ko'; } catch (e) {}
    await setLanguage(lang);

    document.addEventListener('click', e => {
        const b = e.target.closest('.lang-btn');
        if (b) setLanguage(b.dataset.language);
    });

    const header = document.getElementById('site-header');
    const burger = document.getElementById('sh-burger');
    burger?.addEventListener('click', () => {
        const open = header.classList.toggle('open');
        burger.setAttribute('aria-expanded', open);
    });
    // mobile: tap parent to expand submenu
    document.querySelectorAll('.sh-nav .has-sub > a').forEach(a => {
        a.addEventListener('click', e => {
            if (window.innerWidth < 992) {
                const li = a.parentElement;
                if (!li.classList.contains('sub-open')) { e.preventDefault(); li.classList.add('sub-open'); }
            }
        });
    });

    const badge = () => {
        let n = 0;
        try { n = (JSON.parse(localStorage.getItem('uq.cart.v1')) || []).reduce((a, i) => a + (i.qty || 0), 0); } catch (e) {}
        const el = document.getElementById('cart-count');
        if (el) { el.textContent = n; el.hidden = !n; }
    };
    badge();
    addEventListener('storage', badge);
    document.addEventListener('uq-cart', badge);

    const top = document.getElementById('top_btn');
    const onScroll = () => {
        header?.classList.toggle('scrolled', scrollY > 30);
        top?.classList.toggle('show', scrollY > 300);
    };
    addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    top?.addEventListener('click', () => scrollTo({ top: 0, behavior: 'smooth' }));
});
