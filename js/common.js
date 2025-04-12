const savedLanguage = localStorage.getItem('language') || 'ko';

document.addEventListener("DOMContentLoaded", function () {
    setHeaderAndFooter();
    clickTopButtonEvent();
});

//Common
function setHeaderAndFooter() {
    const isIndexPage = window.location.pathname.endsWith("index.html") || window.location.pathname.endsWith("/");
    const headerPath = isIndexPage ? 'common/header.html' : '../common/header.html';
    const footerPath = isIndexPage ? 'common/footer.html' : '../common/footer.html';

    fetch(headerPath)
    .then((response) => response.text())
    .then((data) => {
        document.getElementById("header").innerHTML = data;

        if (isIndexPage) {
            const header = document.getElementById("header");
            const links = header.querySelectorAll('a');
            const images = header.querySelectorAll('img');

            convertPath(links, images);
        }

        createLanguageEvent();
        setLanguage(savedLanguage);
    });

    fetch(footerPath)
    .then((response) => response.text())
    .then((data) => {
        document.getElementById("footer").innerHTML = data;

        if (isIndexPage) {
            const footer = document.getElementById("ft");
            const links = footer.querySelectorAll('a');
            const images = footer.querySelectorAll('img');

            convertPath(links, images);
        }

        displayTopButton();
        setLanguage(savedLanguage);
    });
}
function convertPath(links, images) {
    links.forEach(link => {
        let href = link.getAttribute('href');
        if (href) {
            link.setAttribute('href', href.replace(/^\.\.\//, ''));
        }
    });

    images.forEach(img => {
        let src = img.getAttribute('src');
        if (src) {
            img.setAttribute('src', src.replace(/^\.\.\//, ''));
        }
    });
}
function clickTopButtonEvent() {
    $(document).on("click", "#top_btn", function () {    
        $("html, body").animate({ scrollTop: 0 }, 500);
        return false;
    });
}

// Header
function createLanguageEvent() {
    $(document).on("click", ".lang-btn", function(event) {
        const language = $(event.currentTarget).data('language');

        setLanguage(language);
    });
}
function setLanguage(language) {
    localStorage.setItem('language', language);

    $(".ko, .en").hide();
    $(".lang-btn").removeClass('active');
    $(`.${language} [data-language="${language}"]`).addClass('active');
    language === 'ko' ? $(".ko").show() : $(".en").show();

    scrollToHashIfExists();
}
function scrollToHashIfExists() {
    const hash = window.location.hash;
    if (hash) {
        setTimeout(() => {
            const target = document.querySelector(hash);
            if (target) {
                target.scrollIntoView({ behavior: "smooth", block: "start" });
            }
        }, 10);
    }
}

// Footer
$(window).ready(function () {
    $(window).scroll(function () {
        displayTopButton();
    });
});
function displayTopButton() {
    $(window).scrollTop() > 100 ? $("#top_btn").fadeIn() : $("#top_btn").fadeOut();
}