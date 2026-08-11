/**
 * Novità foto — config unica + UI (hero, portfolio, gallery)
 * Quando Antonio pubblica: aggiorna solo NOVITA_CONFIG qui sotto (il CMS lo fa da solo).
 *
 * REGOLA:
 * - Le novità si possono sommare (più gallery in items).
 * - Ogni gallery ha il PROPRIO publishedAt: le 48h valgono per quella gallery.
 * - Pubblicare su Portraits NON rinnova i badge di Street/Jazz.
 * - Chi ha già visto una gallery non rivede quel badge (finché count non cresce).
 */
(function () {
    /* ===== CONFIG — modificare solo questo blocco ===== */
    var NOVITA_CONFIG = {
        /* Chiave localStorage “già visto” (non cambia a ogni foto) */
        batchId: '2026-08-03-street-portraits',
        ttlHours: 48,
        /* publishedAt per gallery: dopo ttlHours quel badge sparisce da solo */
        items: [
            { id: 'street', count: 3, publishedAt: '2026-08-03T08:00:00+02:00' },
            { id: 'portraits', count: 3, publishedAt: '2026-08-07T08:00:00+02:00' },
            { id: 'jazz', count: 4, publishedAt: '2026-08-04T20:00:00+02:00' },
            { id: 'arti-mestieri', count: 18, publishedAt: '2026-08-09T20:10:00+02:00' },
            { id: 'fulvio-vellone', count: 27, publishedAt: '2026-08-11T16:40:00+02:00' }
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

    /* Compat: se manca publishedAt sull’item, usa eventuale data globale legacy */
    function getItemPublishedAt(item) {
        if (item && item.publishedAt) return item.publishedAt;
        return NOVITA_CONFIG.publishedAt || '';
    }

    function isItemActive(item) {
        var start = Date.parse(getItemPublishedAt(item));
        if (isNaN(start)) return false;
        var end = start + (NOVITA_CONFIG.ttlHours || 48) * 60 * 60 * 1000;
        return Date.now() < end;
    }

    function getSeenCount(galleryId) {
        var map = getSeenMap();
        var batch = map[NOVITA_CONFIG.batchId];
        if (!batch || batch[galleryId] == null) return 0;
        var v = batch[galleryId];
        /* Vecchio formato true: rivaluta (così nuove foto sulla stessa gallery ripartono) */
        if (v === true) return 0;
        if (typeof v === 'object' && v && typeof v.count === 'number') return v.count;
        if (typeof v === 'number') return v;
        return 0;
    }

    function isGallerySeen(galleryId) {
        var item = getItemById(galleryId);
        if (!item) return true;
        return getSeenCount(galleryId) >= item.count;
    }

    function markGallerySeen(galleryId) {
        var item = getItemById(galleryId);
        if (!item) return;
        var map = getSeenMap();
        if (!map[NOVITA_CONFIG.batchId]) map[NOVITA_CONFIG.batchId] = {};
        map[NOVITA_CONFIG.batchId][galleryId] = { count: item.count };
        setSeenMap(map);
    }

    function getActiveUnseenItems() {
        return (NOVITA_CONFIG.items || []).filter(function (item) {
            return (
                item &&
                item.id &&
                item.count > 0 &&
                isItemActive(item) &&
                !isGallerySeen(item.id)
            );
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
        var file = path.split('/').pop() || '';
        if (path === '/' || file === '' || file === 'index.html' || /\/$/.test(path)) return 'home';
        var id = file.replace(/\.html$/, '');
        /* Qualsiasi gallery presente in NOVITA_CONFIG (anche aggiunta dal CMS) */
        if (id && getItemById(id)) return id;
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

    /* ----- GALLERY: bordo rosso ultime N + atterraggio in coda (niente pulsante banner) ----- */
    function initGallery(galleryId) {
        var item = getItemById(galleryId);
        if (!item || !isItemActive(item)) return;

        var alreadySeen = isGallerySeen(galleryId);
        var gallery = document.querySelector('.masonry-gallery');
        if (!gallery) return;

        var items = gallery.querySelectorAll('.masonry-item');
        var count = Math.min(item.count, items.length);
        if (count <= 0) return;

        var firstNew = items[items.length - count];
        if (firstNew) firstNew.id = 'novita-foto-ancora';

        /* Prima visita: evidenzia in rosso + scroll automatico in coda */
        if (!alreadySeen) {
            for (var i = items.length - count; i < items.length; i++) {
                items[i].classList.add('masonry-item--novita');
            }

            function scrollToNovita() {
                var target = document.getElementById('novita-foto-ancora');
                if (!target) return;
                target.scrollIntoView({
                    behavior: prefersReducedMotion() ? 'auto' : 'smooth',
                    block: 'center'
                });
            }

            requestAnimationFrame(function () {
                setTimeout(scrollToNovita, 120);
            });

            markGallerySeen(galleryId);
        }
    }

    var page = detectPage();
    if (page === 'home') initHome();
    else if (page !== 'other') initGallery(page);
})();
