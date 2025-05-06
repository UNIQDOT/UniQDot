const savedLanguage = localStorage.getItem('language') || 'ko';
const isIndexPage = window.location.pathname.endsWith("index.html") || window.location.pathname.endsWith("/");
const headerPath = isIndexPage ? 'common/header.html' : '../common/header.html';
const footerPath = isIndexPage ? 'common/footer.html' : '../common/footer.html';
const langPath = isIndexPage ? 'lang' : '../lang';

//Common
document.addEventListener("DOMContentLoaded", function () {
    setHeaderAndFooter();
    clickTopButtonEvent();
});
function setHeaderAndFooter() {
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
    function createLanguageEvent() {
        $(document).on("click", ".lang-btn", function(event) {
            const language = $(event.currentTarget).data('language');
    
            setLanguage(language);
        });
    }

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
function clickTopButtonEvent() {
    $(document).on("click", "#top_btn", function () {    
        $("html, body").animate({ scrollTop: 0 }, 500);
        return false;
    });
}

//Header
async function setLanguage(language) {
    localStorage.setItem('language', language);
    $(".lang-btn").removeClass('active');
    $(`[data-language="${language}"]`).addClass('active');

    const res = await fetch(`${langPath}/${language}.json`);
    const dict = await res.json();
  
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const keys = el.dataset.i18n.split('.');
      let text = dict;

      for (const key of keys) {
        text = text[key];
        if (text === undefined) return;
      }
      
      el.innerText = text;
    });
}

//Footer
$(window).ready(function () {
    $(window).scroll(function () {
        displayTopButton();
    });
});
function displayTopButton() {
    $(window).scrollTop() > 100 ? $("#top_btn").fadeIn() : $("#top_btn").fadeOut();
}



