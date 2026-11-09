// 온라인 카드 결제 (PortOne V2 예시). 기본값은 비활성(PAYMENT_CONFIG.enabled=false).
// 활성화 방법은 docs/PAYMENT_SETUP.md 참고. 가격(price)이 data/products.json 에 있는 품목만 결제 대상.
const PAYMENT_CONFIG = {
    enabled: false,              // 결제 계약·서버 준비 후 true
    storeId: '',                 // PortOne 콘솔의 Store ID (공개값)
    channelKey: '',              // PortOne 콘솔의 채널 키 (공개값)
    verifyEndpoint: ''           // 결제 검증 서버리스 함수 URL (예: https://xxx.workers.dev/verify)
};

async function payByCard({ orderName, totalAmount, buyer, items }) {
    if (!PAYMENT_CONFIG.enabled) throw new Error('payment-disabled');
    if (!window.PortOne) {
        await new Promise((res, rej) => {
            const s = document.createElement('script');
            s.src = 'https://cdn.portone.io/v2/browser-sdk.js'; s.onload = res; s.onerror = rej;
            document.head.appendChild(s);
        });
    }
    const paymentId = 'uq-' + Date.now() + '-' + Math.random().toString(36).slice(2, 8);
    const res = await PortOne.requestPayment({
        storeId: PAYMENT_CONFIG.storeId,
        channelKey: PAYMENT_CONFIG.channelKey,
        paymentId, orderName, totalAmount, currency: 'KRW', payMethod: 'CARD',
        customer: { fullName: buyer.name, email: buyer.email, phoneNumber: buyer.phone }
    });
    if (res.code) throw new Error(res.message || 'payment-failed');
    // 금액 위변조 방지: 반드시 서버에서 결제 건을 조회·검증해야 주문이 확정됨
    const v = await fetch(PAYMENT_CONFIG.verifyEndpoint, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ paymentId, items })
    });
    if (!v.ok) throw new Error('verify-failed');
    return { paymentId };
}
