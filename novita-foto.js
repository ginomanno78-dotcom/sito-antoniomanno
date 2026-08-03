/**
 * Novità foto — config unica + UI (hero, portfolio, gallery)
 * Quando Antonio pubblica: aggiorna solo NOVITA_CONFIG qui sotto.
 */
(function () {
    /* ===== CONFIG — modificare solo questo blocco ===== */
    var NOVITA_CONFIG = {
        batchId: '2026-08-03-street-portraits',
        /* Data/ora pubblicazione (ISO). Dopo ttlHours i segnali spariscono da soli. */
        publishedAt: '2026-08-03T08:00:00+02:00',
        ttlHours: 48,
        items: [
            { id: 'street', count: 3 },
            { id: 'portraits', count: 1 }
        ]
    };
    /* ===== fine config ===== */

    var STORAGE_KEY = 'antoniomanno_novita_seen_v1';

    function getSeenMap() {
        try {
            var raw = localStorage.getItem(STORAGE_KEY);
            if (!raw) return {};
            var data = JSON.parse(raw);
            return data && typeof data === 'object' ? data : {};
        } catch (e) {
            return {};
        }
    }

    function setSeenMap(map) {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(map));
        } catch (e) { /* ignore */ }
    }

    function isBatchActive() {
        var start = Date.parse(NOVITA_CONFIG.publishedAt);
        if (isNaN(start)) return false;
        var end = start + (NOVITA_CONFIG.ttlHours || 48) * 60 * 60 * 1000;
        return Date.now() < end;
    }

    function isGallerySeen(galleryId) {
        var map = getSeenMap();
        var batch = map[NOVITA_CONFIG.batchId];
        return !!(batch && batch[galleryId]);
    }

    function markGallerySeen(galleryId) {
        var map = getSeenMap();
        if (!map[NOVITA_CONFIG.batchId]) map[NOVITA_CONFIG.batchId] = {};
        map[NOVITA_CONFIG.batchId][galleryId] = true;
        setSeenMap(map);
    }

    function getActiveUnseenItems() {
        if (!isBatchActive()) return [];
        return (NOVITA_CONFIG.items || []).filter(function (item) {
            return item && item.id && item.count > 0 && !isGallerySeen(item.id);
        });
    }

    function getItemById(id) {
        var list = NOVITA_CONFIG.items || [];
        for (var i = 0; i < list.length; i++) {
            if (list[i].id === id) return list[i];
        }
        return null;
    }

    function detectPage() {
        var path = (window.location.pathname || '').toLowerCase();
        if (path.indexOf('street.html') !== -1) return 'street';
        if (path.indexOf('portraits.html') !== -1) return 'portraits';
        if (path === '/' || path.indexOf('index.html') !== -1 || /\/$/.test(path)) return 'home';
        /* home spesso è solo / sul dominio */
        if (!path.split('/').pop()) return 'home';
        return 'other';
    }

    function prefersReducedMotion() {
        return window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    }

    /* ----- HOME: CTA + badge portfolio ----- */
    function initHome() {
        var unseen = getActiveUnseenItems();
        if (unseen.length === 0) return;

        var cta = document.querySelector('#hero > a.cta-button');
        if (cta) {
            cta.classList.add('cta-button--has-novita');

            /* Testo interno + sizer invisibile (tiene fissa la larghezza sul testo più lungo) */
            var labelEl = document.createElement('span');
            labelEl.className = 'cta-button__label';
            labelEl.textContent = 'scopri il portfolio';

            var sizerEl = document.createElement('span');
            sizerEl.className = 'cta-button__sizer';
            sizerEl.setAttribute('aria-hidden', 'true');
            sizerEl.textContent = 'scopri il portfolio';

            cta.textContent = '';
            cta.appendChild(sizerEl);
            cta.appendChild(labelEl);

            var showingNovita = false;
            function swapCtaLabel() {
                showingNovita = !showingNovita;
                labelEl.textContent = showingNovita ? 'nuove foto' : 'scopri il portfolio';
            }

            if (!prefersReducedMotion()) {
                cta.classList.add('cta-button--bounce');
                /* Ad ogni ciclo di rimbalzo alterna la scritta */
                cta.addEventListener('animationiteration', function (e) {
                    if (e.animationName.indexOf('cta-novita-bounce') === -1) return;
                    swapCtaLabel();
                });
            } else {
                /* Senza animazione: alternanza lenta via timer */
                var altTimer = setInterval(swapCtaLabel, 2000);
            }

            /* Al click: stop molleggio e testo stabile */
            cta.addEventListener('click', function () {
                cta.classList.remove('cta-button--bounce');
                labelEl.textContent = 'scopri il portfolio';
                if (typeof altTimer !== 'undefined') clearInterval(altTimer);
            });
        }

        unseen.forEach(function (item) {
            var card = document.querySelector('#portfolio a.portfolio-item[data-novita="' + item.id + '"]');
            if (!card) return;
            var imgWrap = card.querySelector('.portfolio-item-img');
            if (!imgWrap) return;
            if (imgWrap.querySelector('.portfolio-novita-badge')) return;
            var badge = document.createElement('span');
            badge.className = 'portfolio-novita-badge';
            badge.textContent = '+' + String(item.count);
            badge.setAttribute('aria-label', item.count + ' nuove foto');
            imgWrap.appendChild(badge);
        });
    }

    /* ----- GALLERY: banner + bordo rosso ultime N ----- */
    function initGallery(galleryId) {
        var item = getItemById(galleryId);
        if (!item || !isBatchActive()) return;

        var alreadySeen = isGallerySeen(galleryId);
        var gallery =
            document.getElementById('galleryStreet') ||
            document.getElementById('galleryPortraits') ||
            document.querySelector('.masonry-gallery');
        if (!gallery) return;

        var items = gallery.querySelectorAll('.masonry-item');
        var count = Math.min(item.count, items.length);
        if (count <= 0) return;

        var firstNew = items[items.length - count];
        if (firstNew) firstNew.id = 'novita-foto-ancora';

        /* Prima visita del batch: evidenzia in rosso + banner + atterraggio automatico in coda */
        if (!alreadySeen) {
            for (var i = items.length - count; i < items.length; i++) {
                items[i].classList.add('masonry-item--novita');
            }

            var intro = document.querySelector('.gallery-intro');
            if (intro && !document.querySelector('.gallery-novita-banner')) {
                var banner = document.createElement('button');
                banner.type = 'button';
                banner.className = 'gallery-novita-banner';
                banner.textContent = count === 1 ? '1 nuova foto' : count + ' nuove foto';
                banner.addEventListener('click', function () {
                    scrollToNovita();
                });
                intro.insertAdjacentElement('afterend', banner);
            }

            /* Atterraggio automatico sulle nuove foto in coda */
            function scrollToNovita() {
                var target = document.getElementById('novita-foto-ancora');
                if (!target) return;
                target.scrollIntoView({
                    behavior: prefersReducedMotion() ? 'auto' : 'smooth',
                    block: 'center'
                });
            }

            /* Attende il layout delle immagini poi scorre in coda */
            requestAnimationFrame(function () {
                setTimeout(scrollToNovita, 120);
            });

            markGallerySeen(galleryId);
        }
    }

    var page = detectPage();
    if (page === 'home') initHome();
    else if (page === 'street' || page === 'portraits') initGallery(page);
})();
