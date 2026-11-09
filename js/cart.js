// 견적 목록(장바구니): localStorage 기반
const UQCart = (() => {
    const KEY = 'uq.cart.v1';
    const read = () => { try { return JSON.parse(localStorage.getItem(KEY)) || []; } catch (e) { return []; } };
    const write = list => {
        try { localStorage.setItem(KEY, JSON.stringify(list)); } catch (e) {}
        document.dispatchEvent(new CustomEvent('uq-cart'));
    };
    return {
        get: read,
        add(id, qty = 1) {
            const l = read(), it = l.find(i => i.id === id);
            it ? (it.qty = Math.min(999, it.qty + qty)) : l.push({ id, qty });
            write(l);
        },
        set(id, qty) { write(read().map(i => i.id === id ? { id, qty: Math.max(1, Math.min(999, qty | 0)) } : i)); },
        remove(id) { write(read().filter(i => i.id !== id)); },
        clear() { write([]); },
        count: () => read().reduce((a, i) => a + i.qty, 0)
    };
})();
