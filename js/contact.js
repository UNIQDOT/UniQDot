// EmailJS 공개키/ID (EmailJS 대시보드에서 발급한 공개용 값)
const publicKey = '7JHc5RipdDSfd_W40';
const serviceId = 'service_94x1pfa';
const templateId = 'template_3ecfu1u';
const emailForm = document.getElementById('contact-form');
const statusEl = document.getElementById('form-status');
const MSG = {
    ko: { sending: '보내는 중…', ok: '문의가 접수되었습니다. 빠르게 답변드리겠습니다.', fail: '전송에 실패했습니다. 잠시 후 다시 시도하시거나 uniqdotup@gmail.com 으로 보내주세요.' },
    en: { sending: 'Sending…', ok: 'Your message has been sent. We will get back to you soon.', fail: 'Sending failed. Please try again later or email uniqdotup@gmail.com.' }
};
const t = () => MSG[document.documentElement.lang === 'en' ? 'en' : 'ko'];

if (window.emailjs) emailjs.init(publicKey);

emailForm.addEventListener('submit', function (event) {
    event.preventDefault();
    const btn = emailForm.querySelector('button[type="submit"]');
    if (!window.emailjs) { statusEl.textContent = t().fail; return; }
    btn.disabled = true;
    statusEl.style.color = '';
    statusEl.textContent = t().sending;
    emailjs.send(serviceId, templateId, {
        email_id: document.getElementById('email').value,
        message: document.getElementById('message').value,
        to_name: 'uniq-dot',
        from_name: document.getElementById('name').value
    }).then(function () {
        statusEl.style.color = '#1a7f37';
        statusEl.textContent = t().ok;
        emailForm.reset();
    }).catch(function () {
        statusEl.style.color = '#c62828';
        statusEl.textContent = t().fail;
    }).finally(function () { btn.disabled = false; });
});
