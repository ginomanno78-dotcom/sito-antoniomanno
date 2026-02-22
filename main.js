/* Menu mobile: hamburger toggle e slide da destra */
(function () {
    var nav = document.getElementById('navbar');
    var hamburger = nav && nav.querySelector('.hamburger');
    var navMenu = nav && nav.querySelector('.nav-menu');
    var body = document.body;

    if (!hamburger || !navMenu) return;

    function openMenu() {
        navMenu.classList.add('nav-menu--open');
        hamburger.classList.add('hamburger--active');
        hamburger.setAttribute('aria-expanded', 'true');
        hamburger.setAttribute('aria-label', 'Chiudi menu');
        body.classList.add('nav-open');
    }

    function closeMenu() {
        navMenu.classList.remove('nav-menu--open');
        hamburger.classList.remove('hamburger--active');
        hamburger.setAttribute('aria-expanded', 'false');
        hamburger.setAttribute('aria-label', 'Apri menu');
        body.classList.remove('nav-open');
    }

    function toggleMenu() {
        if (navMenu.classList.contains('nav-menu--open')) {
            closeMenu();
        } else {
            openMenu();
        }
    }

    hamburger.addEventListener('click', toggleMenu);

    // Chiudi menu mobile al click su qualsiasi link, ESCLUSO il trigger \"Portfolio\"
    navMenu.querySelectorAll('.nav-menu a:not(.dropdown-trigger)').forEach(function (link) {
        link.addEventListener('click', function () {
            if (window.innerWidth <= 1024) closeMenu();
        });
    });

    // Su mobile il click su \"Portfolio\" apre/chiude il dropdown invece di seguire il link
    document.querySelectorAll('.nav-item-dropdown .dropdown-trigger').forEach(function (trigger) {
        trigger.addEventListener('click', function (e) {
            if (window.innerWidth > 1024) return;
            e.preventDefault();
            var li = this.closest('.nav-item-dropdown');
            li.classList.toggle('dropdown--open');
        });
    });
})();

/* Carousel testimonianze: prev/next + dots */
(function () {
    var carousel = document.querySelector('#dicono-di-me .carousel');
    if (!carousel) return;
    var slides = carousel.querySelectorAll('.carousel-slide');
    var dots = carousel.querySelectorAll('.carousel-dot');
    var total = slides.length;

    function goToSlide(index) {
        if (index < 0) index = total - 1;
        if (index >= total) index = 0;
        slides.forEach(function (s) { s.classList.remove('carousel-slide--active'); });
        dots.forEach(function (d) {
            d.classList.remove('carousel-dot--active');
            d.setAttribute('aria-selected', 'false');
        });
        slides[index].classList.add('carousel-slide--active');
        if (dots[index]) {
            dots[index].classList.add('carousel-dot--active');
            dots[index].setAttribute('aria-selected', 'true');
        }
        carousel.currentIndex = index;
    }

    carousel.currentIndex = 0;

    var btnPrev = carousel.querySelector('.carousel-prev');
    var btnNext = carousel.querySelector('.carousel-next');
    if (btnPrev) btnPrev.addEventListener('click', function () { goToSlide(carousel.currentIndex - 1); });
    if (btnNext) btnNext.addEventListener('click', function () { goToSlide(carousel.currentIndex + 1); });

    dots.forEach(function (dot) {
        dot.addEventListener('click', function () {
            var index = parseInt(this.getAttribute('data-index'), 10);
            if (!isNaN(index)) goToSlide(index);
        });
    });
})();
