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

/* Solo Samsung Galaxy S8 (codice modello SM-G950): classe per CSS hero due righe */
(function () {
    if (/SM-G950/i.test(navigator.userAgent)) {
        document.documentElement.classList.add('galaxy-s8-hero');
    }
})();

/* Lightbox portfolio: swipe tra foto e pinch-zoom su touch (chiusura solo da X, non dal backdrop) */
(function () {
    var LB_ROOTS = [
        '.lightbox-portraits',
        '.lightbox-auschwitz',
        '.lightbox-jazz',
        '.lightbox-city',
        '.lightbox-street',
        '.lightbox-landscapes',
        '.lightbox-weddings',
        '.lightbox-monuments',
        '.mostra-articolo-lightbox'
    ];

    function findOpenLightboxFrom(el) {
        if (!el || !el.closest) return null;
        for (var i = 0; i < LB_ROOTS.length; i++) {
            var r = el.closest(LB_ROOTS[i]);
            if (r && r.classList.contains('is-open')) return r;
        }
        return null;
    }

    function findAnyOpenLightbox() {
        for (var i = 0; i < LB_ROOTS.length; i++) {
            var n = document.querySelector(LB_ROOTS[i] + '.is-open');
            if (n) return n;
        }
        return null;
    }

    function getMainImg(root) {
        return root.querySelector('img[class$="__img"]');
    }

    function triggerNav(root, direction) {
        var prev = root.querySelector('[class$="__prev"]');
        var next = root.querySelector('[class$="__next"]');
        if (direction < 0 && prev) prev.click();
        if (direction > 0 && next) next.click();
    }

    function distance(a, b) {
        var dx = a.clientX - b.clientX;
        var dy = a.clientY - b.clientY;
        return Math.sqrt(dx * dx + dy * dy);
    }

    function getState(img) {
        if (!img._lbZoom) img._lbZoom = { scale: 1, tx: 0, ty: 0 };
        return img._lbZoom;
    }

    function applyTransform(img) {
        var st = getState(img);
        img.style.transform = 'translate(' + st.tx + 'px,' + st.ty + 'px) scale(' + st.scale + ')';
    }

    function resetTransform(img) {
        if (!img) return;
        img._lbZoom = { scale: 1, tx: 0, ty: 0 };
        img.style.transform = '';
    }

    var swipeStartX = 0;
    var swipeStartY = 0;
    var swipeActive = false;
    var twoFingerSession = false;
    var pinchInitialDist = 0;
    var pinchBaseScale = 1;
    var pinchReady = false;
    var pinchGesture = false;
    var panLastX = 0;
    var panLastY = 0;

    document.addEventListener('touchstart', function (e) {
        var root = findOpenLightboxFrom(e.target);
        if (!root) return;
        if (e.target.closest('button')) return;

        var img = getMainImg(root);
        if (!img) return;

        // Swipe e pinch solo se il gesto inizia sull'immagine o sul contenuto, non sul backdrop nero
        var bd = root.querySelector('[class$="__backdrop"]');
        if (bd && (e.target === bd || bd.contains(e.target))) return;

        if (e.touches.length === 2) {
            twoFingerSession = true;
            swipeActive = false;
            pinchReady = false;
            pinchGesture = false;
            pinchInitialDist = 0;
        } else if (e.touches.length === 1) {
            swipeStartX = e.touches[0].clientX;
            swipeStartY = e.touches[0].clientY;
            panLastX = swipeStartX;
            panLastY = swipeStartY;
            swipeActive = true;
            twoFingerSession = false;
            pinchReady = false;
            pinchGesture = false;
            pinchInitialDist = 0;
        }
    }, { passive: true });

    document.addEventListener('touchmove', function (e) {
        var root = findOpenLightboxFrom(e.target);
        if (!root) return;
        var img = getMainImg(root);
        if (!img) return;

        if (e.touches.length === 2) {
            twoFingerSession = true;
            swipeActive = false;
            var d = distance(e.touches[0], e.touches[1]);
            if (!pinchReady && d > 8) {
                pinchReady = true;
                pinchInitialDist = d;
                pinchBaseScale = getState(img).scale;
            }
            if (pinchReady && pinchInitialDist > 8) {
                var st = getState(img);
                st.scale = Math.min(4, Math.max(1, pinchBaseScale * (d / pinchInitialDist)));
                applyTransform(img);
                pinchGesture = true;
            }
        } else if (e.touches.length === 1 && swipeActive && !twoFingerSession) {
            var st = getState(img);
            var t = e.touches[0];
            if (st.scale > 1.05) {
                st.tx += t.clientX - panLastX;
                st.ty += t.clientY - panLastY;
                panLastX = t.clientX;
                panLastY = t.clientY;
                applyTransform(img);
            }
        }
    }, { passive: true });

    document.addEventListener('touchend', function (e) {
        var root = findAnyOpenLightbox();
        if (!root) {
            swipeActive = false;
            twoFingerSession = false;
            return;
        }

        var img = getMainImg(root);
        if (e.touches.length < 2) {
            twoFingerSession = false;
            pinchReady = false;
            pinchInitialDist = 0;
            pinchBaseScale = img ? getState(img).scale : 1;
        }

        if (e.touches.length !== 0) return;

        if (img) {
            panLastX = swipeStartX;
            panLastY = swipeStartY;
        }

        if (!swipeActive || !img) {
            swipeActive = false;
            pinchGesture = false;
            return;
        }

        var touch = e.changedTouches[0];
        var dx = touch.clientX - swipeStartX;
        var dy = touch.clientY - swipeStartY;
        swipeActive = false;

        var st = getState(img);
        if (pinchGesture) {
            pinchGesture = false;
            return;
        }
        if (st.scale > 1.05) return;
        if (Math.abs(dx) < 56 || Math.abs(dx) < Math.abs(dy)) return;

        triggerNav(root, dx > 0 ? -1 : 1);
    }, { passive: true });

    function observeImg(img) {
        if (!img || img._lbObserved) return;
        var obs = new MutationObserver(function () {
            resetTransform(img);
        });
        obs.observe(img, { attributes: true, attributeFilter: ['src'] });
        img._lbObserved = true;
    }

    function init() {
        document.querySelectorAll(
            '.lightbox-portraits__img, .lightbox-auschwitz__img, .lightbox-jazz__img, .lightbox-city__img, .lightbox-street__img, ' +
            '.lightbox-landscapes__img, .lightbox-weddings__img, .lightbox-monuments__img, .mostra-articolo-lightbox__img'
        ).forEach(observeImg);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
