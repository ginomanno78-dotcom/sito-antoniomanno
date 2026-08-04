/**
 * Photo Admin — login, coppie thumb/full, publish
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

    var galleries = [];
    var thumbFiles = [];
    var fullFiles = [];

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

    function refreshPairsUi() {
        pairList.innerHTML = '';
        var n = Math.max(thumbFiles.length, fullFiles.length);
        var ready = thumbFiles.length > 0 && thumbFiles.length === fullFiles.length && thumbFiles.length <= MAX_PAIRS;

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
        var id = gallerySelect.value;
        var g = null;
        for (var i = 0; i < galleries.length; i++) {
            if (galleries[i].id === id) {
                g = galleries[i];
                break;
            }
        }
        if (!g) {
            galleryMeta.textContent = '';
            return;
        }
        galleryMeta.textContent =
            'Ora: ' + g.count + ' foto · prossimo file: ' + String(g.next).padStart(g.pad, '0') + '.webp';
    }

    async function loadGalleries() {
        var data = await api('/api/galleries');
        galleries = data.galleries || [];
        gallerySelect.innerHTML = '';
        galleries.forEach(function (g) {
            var opt = document.createElement('option');
            opt.value = g.id;
            opt.textContent = g.label;
            gallerySelect.appendChild(opt);
        });
        updateGalleryMeta();
    }

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
        inputThumbs.value = '';
        inputFulls.value = '';
        refreshPairsUi();
        showLogin();
    });

    gallerySelect.addEventListener('change', updateGalleryMeta);

    inputThumbs.addEventListener('change', function () {
        thumbFiles = Array.prototype.slice.call(inputThumbs.files || []);
        refreshPairsUi();
    });

    inputFulls.addEventListener('change', function () {
        fullFiles = Array.prototype.slice.call(inputFulls.files || []);
        refreshPairsUi();
    });

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

    /* Avvio: se c’è token, prova a caricare le gallery */
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
