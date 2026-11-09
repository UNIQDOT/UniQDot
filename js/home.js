const io = 'IntersectionObserver' in window ? new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
}), { threshold: .12 }) : null;
document.querySelectorAll('.rv').forEach(el => io ? io.observe(el) : el.classList.add('in'));
