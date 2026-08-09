/**
 * Photo Admin — aggiungi / elimina / inserisci
 */
(function () {
    var TOKEN_KEY = 'am_cms_token';
    var MAX_PAIRS = 5;

    var viewLogin = document.getElementById('viewLogin');
    var viewApp = document.getElementById('viewApp');
    var formLogin = document.getElementById('formLogin');
    var loginError = document.getElementById('loginError');
    var gallerySelect = document.getElementById('gallerySelect');
    var galleryMeta = document.getElementById('galleryMeta');
    var inputThumbs = document.getElementById('inputThumbs');
    var inputFulls = document.getElementById('inputFulls');
    var pairList = document.getElementById('pairList');
    var btnPublish = document.getElementById('btnPublish');
    var publishMsg = document.getElementById('publishMsg');
    var btnLogout = document.getElementById('btnLogout');
    var deleteGrid = document.getElementById('deleteGrid');
    var btnDelete = document.getElementById('btnDelete');
    var deleteMsg = document.getElementById('deleteMsg');
    var insertPosition = document.getElementById('insertPosition');
    var inputInsertThumb = document.getElementById('inputInsertThumb');
    var inputInsertFull = document.getElementById('inputInsertFull');
    var btnInsert = document.getElementById('btnInsert');
    var insertMsg = document.getElementById('insertMsg');

    var galleries = [];
    var thumbFiles = [];
    var fullFiles = [];
    var currentPhotos = [];
    var selectedDelete = {};
    var insertThumb = null;
    var insertFull = null;

    function getToken() {
        try {
            return sessionStorage.getItem(TOKEN_KEY) || '';
        } catch (e) {
            return '';
        }
    }

    function setToken(t) {
        try {
            if (t) sessionStorage.setItem(TOKEN_KEY, t);
            else sessionStorage.removeItem(TOKEN_KEY);
        } catch (e) { /* ignore */ }
    }

    function showLogin() {
        viewLogin.hidden = false;
        viewApp.hidden = true;
    }

    function showApp() {
        viewLogin.hidden = true;
        viewApp.hidden = false;
    }

    function setMsg(el, text, kind) {
        if (!text) {
            el.hidden = true;
            el.textContent = '';
            el.className = 'msg';
            return;
        }
        el.hidden = false;
        el.textContent = text;
        el.className = 'msg' + (kind ? ' msg--' + kind : '');
    }

    async function api(path, options) {
        var opts = options || {};
        var headers = opts.headers || {};
        headers['Content-Type'] = 'application/json';
        var token = getToken();
        if (token) headers.Authorization = 'Bearer ' + token;
        var res = await fetch(path, {
            method: opts.method || 'GET',
            headers: headers,
            body: opts.body ? JSON.stringify(opts.body) : undefined
        });
        var data = null;
        try {
            data = await res.json();
        } catch (e) {
            data = { ok: false, error: 'Risposta non valida' };
        }
        if (!res.ok || data.ok === false) {
            var err = new Error((data && data.error) || 'Errore ' + res.status);
            err.status = res.status;
            throw err;
        }
        return data;
    }

    function fileToBase64(file) {
        return new Promise(function (resolve, reject) {
            var reader = new FileReader();
            reader.onload = function () {
                var result = String(reader.result || '');
                var i = result.indexOf('base64,');
                resolve(i !== -1 ? result.slice(i + 7) : result);
            };
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    }

    function currentGallery() {
        var id = gallerySelect.value;
        for (var i = 0; i < galleries.length; i++) {
            if (galleries[i].id === id) return galleries[i];
        }
        return null;
    }

    function refreshPairsUi() {
        pairList.innerHTML = '';
        var n = Math.max(thumbFiles.length, fullFiles.length);
        var ready =
            thumbFiles.length > 0 &&
            thumbFiles.length === fullFiles.length &&
            thumbFiles.length <= MAX_PAIRS;

        for (var i = 0; i < n; i++) {
            var li = document.createElement('li');
            var t = thumbFiles[i] ? thumbFiles[i].name : '— manca thumb —';
            var f = fullFiles[i] ? fullFiles[i].name : '— manca full —';
            var ok = !!(thumbFiles[i] && fullFiles[i]);
            li.innerHTML =
                '<span class="' + (ok ? 'ok' : 'bad') + '">#' + (i + 1) + ' thumb: ' + t + '</span>' +
                '<span class="' + (ok ? 'ok' : 'bad') + '">full: ' + f + '</span>';
            pairList.appendChild(li);
        }

        if (thumbFiles.length > MAX_PAIRS || fullFiles.length > MAX_PAIRS) {
            ready = false;
            setMsg(publishMsg, 'Massimo ' + MAX_PAIRS + ' coppie per volta.', 'err');
        } else if (thumbFiles.length !== fullFiles.length && n > 0) {
            setMsg(publishMsg, 'Thumb e full devono essere lo stesso numero di file.', 'err');
        } else {
            setMsg(publishMsg, '', null);
        }

        btnPublish.disabled = !ready;
    }

    function updateGalleryMeta() {
        var g = currentGallery();
        if (!g) {
            galleryMeta.textContent = '';
            return;
        }
        galleryMeta.textContent =
            'Ora: ' +
            g.count +
            ' foto · prossimo in coda: ' +
            String(g.next).padStart(g.pad, '0') +
            '.webp';
    }

    function selectedDeleteCount() {
        return Object.keys(selectedDelete).filter(function (k) {
            return selectedDelete[k];
        }).length;
    }

    function refreshDeleteUi() {
        btnDelete.disabled = selectedDeleteCount() === 0;
    }

    function renderDeleteGrid() {
        deleteGrid.innerHTML = '';
        selectedDelete = {};
        if (!currentPhotos.length) {
            deleteGrid.innerHTML = '<p class="hint">Nessuna foto in questa gallery.</p>';
            refreshDeleteUi();
            return;
        }
        currentPhotos.forEach(function (p) {
            var label = document.createElement('label');
            label.className = 'photo-card';
            label.innerHTML =
                '<input type="checkbox" data-num="' +
                p.num +
                '">' +
                '<img src="' +
                p.thumbUrl +
                '?v=' +
                Date.now() +
                '" alt="' +
                p.name +
                '" loading="lazy">' +
                '<span>' +
                p.name +
                '</span>';
            var input = label.querySelector('input');
            input.addEventListener('change', function () {
                selectedDelete[p.num] = input.checked;
                if (input.checked) label.classList.add('is-selected');
                else label.classList.remove('is-selected');
                refreshDeleteUi();
            });
            deleteGrid.appendChild(label);
        });
        refreshDeleteUi();
    }

    function renderInsertPositions() {
        insertPosition.innerHTML = '';
        currentPhotos.forEach(function (p) {
            var opt = document.createElement('option');
            opt.value = String(p.num);
            opt.textContent = p.name + ' (diventa ' + p.name + ' → successiva +1)';
            insertPosition.appendChild(opt);
        });
        refreshInsertUi();
    }

    function refreshInsertUi() {
        btnInsert.disabled = !(insertThumb && insertFull && insertPosition.value);
    }

    async function loadGalleryPhotos() {
        var g = currentGallery();
        if (!g) return;
        setMsg(deleteMsg, 'Carico elenco foto…', null);
        setMsg(insertMsg, '', null);
        try {
            var data = await api('/api/galleries?id=' + encodeURIComponent(g.id));
            currentPhotos = (data.gallery && data.gallery.photos) || [];
            /* aggiorna count/next dalla risposta dettaglio */
            g.count = data.gallery.count;
            g.next = data.gallery.next;
            updateGalleryMeta();
            renderDeleteGrid();
            renderInsertPositions();
            setMsg(deleteMsg, '', null);
        } catch (err) {
            currentPhotos = [];
            renderDeleteGrid();
            renderInsertPositions();
            setMsg(deleteMsg, err.message || 'Errore caricamento foto', 'err');
        }
    }

    async function loadGalleries() {
        var data = await api('/api/galleries');
        galleries = data.galleries || [];
        var prev = gallerySelect.value;
        gallerySelect.innerHTML = '';
        galleries.forEach(function (g) {
            var opt = document.createElement('option');
            opt.value = g.id;
            opt.textContent = g.label;
            gallerySelect.appendChild(opt);
        });
        if (prev) gallerySelect.value = prev;
        updateGalleryMeta();
        await loadGalleryPhotos();
    }

    /* Tabs */
    document.querySelectorAll('.tab').forEach(function (btn) {
        btn.addEventListener('click', function () {
            var tab = btn.getAttribute('data-tab');
            document.querySelectorAll('.tab').forEach(function (b) {
                b.classList.toggle('is-active', b === btn);
            });
            document.getElementById('tabAdd').hidden = tab !== 'add';
            document.getElementById('tabDelete').hidden = tab !== 'delete';
            document.getElementById('tabInsert').hidden = tab !== 'insert';
        });
    });

    formLogin.addEventListener('submit', async function (e) {
        e.preventDefault();
        setMsg(loginError, '', null);
        try {
            var data = await api('/api/login', {
                method: 'POST',
                body: {
                    email: document.getElementById('loginEmail').value,
                    password: document.getElementById('loginPassword').value
                }
            });
            setToken(data.token);
            showApp();
            await loadGalleries();
        } catch (err) {
            setMsg(loginError, err.message || 'Accesso negato', 'err');
        }
    });

    btnLogout.addEventListener('click', function () {
        setToken('');
        thumbFiles = [];
        fullFiles = [];
        insertThumb = null;
        insertFull = null;
        inputThumbs.value = '';
        inputFulls.value = '';
        inputInsertThumb.value = '';
        inputInsertFull.value = '';
        refreshPairsUi();
        showLogin();
    });

    gallerySelect.addEventListener('change', async function () {
        updateGalleryMeta();
        await loadGalleryPhotos();
    });

    inputThumbs.addEventListener('change', function () {
        thumbFiles = Array.prototype.slice.call(inputThumbs.files || []);
        refreshPairsUi();
    });

    inputFulls.addEventListener('change', function () {
        fullFiles = Array.prototype.slice.call(inputFulls.files || []);
        refreshPairsUi();
    });

    inputInsertThumb.addEventListener('change', function () {
        insertThumb = (inputInsertThumb.files && inputInsertThumb.files[0]) || null;
        refreshInsertUi();
    });

    inputInsertFull.addEventListener('change', function () {
        insertFull = (inputInsertFull.files && inputInsertFull.files[0]) || null;
        refreshInsertUi();
    });

    insertPosition.addEventListener('change', refreshInsertUi);

    btnPublish.addEventListener('click', async function () {
        if (btnPublish.disabled) return;
        btnPublish.disabled = true;
        setMsg(publishMsg, 'Pubblicazione in corso… attendi.', null);
        try {
            var pairs = [];
            for (var i = 0; i < thumbFiles.length; i++) {
                pairs.push({
                    thumbBase64: await fileToBase64(thumbFiles[i]),
                    fullBase64: await fileToBase64(fullFiles[i])
                });
            }
            var data = await api('/api/publish', {
                method: 'POST',
                body: {
                    galleryId: gallerySelect.value,
                    pairs: pairs
                }
            });
            setMsg(
                publishMsg,
                data.message +
                    ' Aggiunte ' +
                    data.added +
                    ' foto (' +
                    data.from +
                    '–' +
                    data.to +
                    '). Totale: ' +
                    data.newTotal +
                    '.',
                'ok'
            );
            thumbFiles = [];
            fullFiles = [];
            inputThumbs.value = '';
            inputFulls.value = '';
            refreshPairsUi();
            await loadGalleries();
        } catch (err) {
            setMsg(publishMsg, err.message || 'Pubblicazione fallita', 'err');
            refreshPairsUi();
        }
    });

    btnDelete.addEventListener('click', async function () {
        var nums = Object.keys(selectedDelete)
            .filter(function (k) {
                return selectedDelete[k];
            })
            .map(function (k) {
                return parseInt(k, 10);
            });
        if (!nums.length) return;
        if (
            !window.confirm(
                'Eliminare ' + nums.length + ' foto? I numeri non verranno rinumerati.'
            )
        ) {
            return;
        }
        btnDelete.disabled = true;
        setMsg(deleteMsg, 'Eliminazione in corso…', null);
        try {
            var data = await api('/api/delete', {
                method: 'POST',
                body: {
                    galleryId: gallerySelect.value,
                    numbers: nums
                }
            });
            setMsg(
                deleteMsg,
                data.message + ' Rimosse: ' + data.numbers.join(', ') + '. Totale: ' + data.newTotal + '.',
                'ok'
            );
            await loadGalleries();
        } catch (err) {
            setMsg(deleteMsg, err.message || 'Eliminazione fallita', 'err');
            refreshDeleteUi();
        }
    });

    btnInsert.addEventListener('click', async function () {
        if (btnInsert.disabled) return;
        var pos = insertPosition.value;
        if (
            !window.confirm(
                'Inserire la nuova foto come ' +
                    pos +
                    '? Quella e tutte le successive verranno rinominate (+1).'
            )
        ) {
            return;
        }
        btnInsert.disabled = true;
        setMsg(insertMsg, 'Inserimento in corso… può richiedere un minuto.', null);
        try {
            var data = await api('/api/insert', {
                method: 'POST',
                body: {
                    galleryId: gallerySelect.value,
                    position: parseInt(pos, 10),
                    thumbBase64: await fileToBase64(insertThumb),
                    fullBase64: await fileToBase64(insertFull)
                }
            });
            setMsg(insertMsg, data.message + ' Totale: ' + data.newTotal + '.', 'ok');
            insertThumb = null;
            insertFull = null;
            inputInsertThumb.value = '';
            inputInsertFull.value = '';
            await loadGalleries();
        } catch (err) {
            setMsg(insertMsg, err.message || 'Inserimento fallito', 'err');
            refreshInsertUi();
        }
    });

    (async function boot() {
        if (!getToken()) {
            showLogin();
            return;
        }
        try {
            showApp();
            await loadGalleries();
        } catch (e) {
            setToken('');
            showLogin();
        }
    })();
})();
