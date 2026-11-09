(async () => {
    const data = await (await fetch('../data/products.json')).json();
    const byId = Object.fromEntries(data.products.map(p => [p.id, p]));
    const root = document.getElementById('qroot');
    const lang = () => (document.documentElement.lang === 'en' ? 'en' : 'ko');
    let dict = {};
    const T = k => k.split('.').reduce((o, x) => (o == null ? o : o[x]), dict) ?? '';
    const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
    const fmt = n => '₩' + n.toLocaleString('ko-KR');
    const publicKey = '7JHc5RipdDSfd_W40', serviceId = 'service_94x1pfa', templateId = 'template_3ecfu1u';
    let done = null;

    const lines = () => UQCart.get().filter(i => byId[i.id]).map(i => ({ ...byId[i.id], qty: i.qty }));
    const payable = ls => ls.length && ls.every(l => l.price != null && l.price > 0);

    function draw() {
        const keep = document.getElementById('qf') ? Object.fromEntries(new FormData(document.getElementById('qf')).entries()) : null;
        render_();
        if (keep) document.querySelectorAll('#qf [name]').forEach(el => { if (el.type === 'checkbox') el.checked = !!keep[el.name]; else if (keep[el.name] != null) el.value = keep[el.name]; });
    }
    function render_() {
        if (done) {
            root.innerHTML = `<div class="panel done"><div class="ck">✓</div><h2>${T('quote.ok_title')}</h2><p>${T('quote.ok_lead')}</p>
                <div>${T('quote.ref')}</div><code>${esc(done)}</code><div><a class="btn2" href="product.html">${T('quote.browse')}</a></div></div>`;
            return;
        }
        const ls = lines();
        if (!ls.length) {
            root.innerHTML = `<div class="panel empty"><p>${T('quote.empty')}</p><a class="btn2" href="product.html">${T('quote.browse')}</a></div>`;
            return;
        }
        const total = payable(ls) ? ls.reduce((a, l) => a + l.price * l.qty, 0) : null;
        root.innerHTML = `<div class="qgrid">
          <div class="panel"><h2>${T('quote.items')} (${ls.length})</h2>
            ${ls.map(l => `<div class="qitem" data-id="${l.id}">
                <img src="../${l.image}" alt="" onerror="this.style.opacity=.15">
                <div><b>${l.name}</b><span>${l.price != null ? fmt(l.price) : T('shop.price_rfq')}</span></div>
                <div class="ctl"><div class="qty"><button type="button" data-d="-1">−</button><input type="number" min="1" max="999" value="${l.qty}" aria-label="${T('shop.qty')}"><button type="button" data-d="1">+</button></div>
                <button type="button" class="rm">${T('quote.remove')}</button></div></div>`).join('')}
            <div style="margin-top:14px"><button type="button" class="rm" id="clr">${T('quote.clear')}</button></div>
            ${total != null ? `<p class="price" style="margin-top:14px">${T('quote.pay_total')}: ${fmt(total)} <small>${T('shop.price_note')}</small></p>` : ''}
            <div class="pay"><h3>${T('quote.pay_title')}</h3>
              ${total != null && PAYMENT_CONFIG.enabled ? `<p>${T('quote.pay_lead')}</p><button type="button" class="btn2" id="paybtn">${T('quote.pay_btn')}</button>` : `<p>${T('quote.pay_off')}</p>`}
            </div>
          </div>
          <form class="panel f" id="qf" novalidate><h2>${T('quote.title')}</h2>
            <label><span>${T('quote.company')} <i>*</i></span><input name="company" required autocomplete="organization"></label>
            <div class="two"><label><span>${T('quote.name')} <i>*</i></span><input name="name" required autocomplete="name"></label>
            <label><span>${T('quote.phone')}</span><input name="phone" type="tel" autocomplete="tel"></label></div>
            <label><span>${T('quote.email')} <i>*</i></span><input name="email" type="email" required autocomplete="email"></label>
            <label><span>${T('quote.purpose')}</span><input name="purpose" placeholder="${esc(T('quote.purpose_ph'))}"></label>
            <label><span>${T('quote.message')}</span><textarea name="message" placeholder="${esc(T('quote.message_ph'))}"></textarea></label>
            <label class="chk"><input type="checkbox" name="agree" required><span>${T('quote.agree')}</span></label>
            <button class="btn2" type="submit">${T('quote.submit')}</button>
            <p id="qstatus" role="status" aria-live="polite"></p>
          </form></div>`;
    }

    root.addEventListener('click', e => {
        const row = e.target.closest('.qitem');
        const st = e.target.closest('[data-d]');
        if (row && st) { const inp = row.querySelector('input'); UQCart.set(row.dataset.id, (+inp.value || 1) + +st.dataset.d); }
        else if (row && e.target.closest('.rm')) UQCart.remove(row.dataset.id);
        else if (e.target.id === 'clr') UQCart.clear();
        else if (e.target.id === 'paybtn') pay();
    });
    root.addEventListener('change', e => {
        const row = e.target.closest('.qitem');
        if (row && e.target.type === 'number') UQCart.set(row.dataset.id, +e.target.value || 1);
    });

    function formData() {
        const f = Object.fromEntries(new FormData(document.getElementById('qf')).entries());
        return f;
    }
    function buildText(ref, f, ls) {
        const items = ls.map(l => `- ${l.name} x ${l.qty}${l.price != null ? ' (' + fmt(l.price) + ')' : ''}`).join('\n');
        return `[견적 요청 ${ref}]\n회사/기관: ${f.company}\n담당자: ${f.name}\n연락처: ${f.phone || '-'}\n이메일: ${f.email}\n사용 목적: ${f.purpose || '-'}\n\n요청 품목\n${items}\n\n요청사항\n${f.message || '-'}`;
    }
    async function pay() {
        const ls = lines(), f = formData();
        const st = document.getElementById('qstatus');
        if (!f.company || !f.name || !f.email) { st.style.color = '#c62828'; st.textContent = '* ' + T('quote.company') + ' / ' + T('quote.name') + ' / ' + T('quote.email'); return; }
        try {
            const total = ls.reduce((a, l) => a + l.price * l.qty, 0);
            const r = await payByCard({ orderName: ls.map(l => l.name).join(', ').slice(0, 60), totalAmount: total, buyer: { name: f.name, email: f.email, phone: f.phone }, items: ls.map(l => ({ id: l.id, qty: l.qty })) });
            done = r.paymentId; UQCart.clear(); draw();
        } catch (err) { st.style.color = '#c62828'; st.textContent = T('quote.fail'); }
    }

    root.addEventListener('submit', async e => {
        e.preventDefault();
        const form = e.target, st = document.getElementById('qstatus'), btn = form.querySelector('button[type=submit]');
        const ls = lines();
        if (!ls.length) { st.style.color = '#c62828'; st.textContent = T('quote.need_items'); return; }
        if (!form.checkValidity()) { form.reportValidity(); return; }
        const f = formData();
        const ref = 'UQ-' + new Date().toISOString().slice(2, 10).replace(/-/g, '') + '-' + Math.random().toString(36).slice(2, 6).toUpperCase();
        const text = buildText(ref, f, ls);
        btn.disabled = true; st.style.color = ''; st.textContent = T('quote.sending');
        try {
            if (!window.emailjs) throw new Error('no-emailjs');
            emailjs.init(publicKey);
            await emailjs.send(serviceId, templateId, { email_id: f.email, message: text, to_name: 'uniq-dot', from_name: `${f.name} (${f.company})` });
            done = ref; UQCart.clear(); draw();
        } catch (err) {
            st.style.color = '#c62828';
            st.innerHTML = esc(T('quote.fail')) + ` <a href="mailto:uniqdotup@gmail.com?subject=${encodeURIComponent('견적 요청 ' + ref)}&body=${encodeURIComponent(text)}">${T('quote.mailto')}</a>`;
            btn.disabled = false;
        }
    });

    async function refresh() { dict = await loadDict(lang()); draw(); }
    document.addEventListener('uq-cart', () => { if (!done) draw(); });
    document.addEventListener('uq-lang', refresh);
    await refresh();
})();
