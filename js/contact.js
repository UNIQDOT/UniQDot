const publicKey = '7JHc5RipdDSfd_W40';
const serviceId = 'service_94x1pfa';
const templateId = 'template_3ecfu1u';
const emailForm = document.getElementById('contact-form');

emailjs.init(publicKey);

emailForm.addEventListener('submit', function(event) {
    event.preventDefault();

    let params = {
        email_id: document.getElementById('email').value,
        message: document.getElementById('message').value,
        to_name: 'uniq-dot',
        from_name: document.getElementById('name').value
    };

    emailjs
        .send(serviceId, templateId, params)
        .then(function (res) {
            alert(res);
        });
});


