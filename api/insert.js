/**
 * POST /api/insert
 * Body: {
 *   galleryId: 'jazz',
 *   position: 29,           // numero file esistente: nuova diventa 29, 29→30, …
 *   thumbBase64, fullBase64
 * }
 */
const auth = require('../lib/cms/auth');
const { getGallery, formatPhotoName } = require('../lib/cms/galleries');
const github = require('../lib/cms/github');
const helpers = require('../lib/cms/publish-helpers');

function stripDataUrl(b64) {
    if (!b64 || typeof b64 !== 'string') return '';
    const i = b64.indexOf('base64,');
    if (i !== -1) return b64.slice(i + 7);
    return b64;
}

module.exports = async function handler(req, res) {
    auth.setCors(res, req);
    if (req.method === 'OPTIONS') {
        res.statusCode = 204;
        return res.end();
    }
    if (req.method !== 'POST') {
        return auth.sendJson(res, 405, { ok: false, error: 'Metodo non consentito' });
    }

    const session = auth.requireAuth(req);
    if (!session.ok) {
        return auth.sendJson(res, 401, { ok: false, error: session.error });
    }

    try {
        const body = await auth.readJsonBody(req);
        const g = getGallery(body.galleryId);
        if (!g) {
            return auth.sendJson(res, 400, { ok: false, error: 'Gallery non valida' });
        }

        const position = parseInt(body.position, 10);
        const thumbB64 = stripDataUrl(body.thumbBase64);
        const fullB64 = stripDataUrl(body.fullBase64);

        if (!Number.isFinite(position) || position < 1) {
            return auth.sendJson(res, 400, { ok: false, error: 'Posizione non valida' });
        }
        if (!thumbB64 || !fullB64) {
            return auth.sendJson(res, 400, {
                ok: false,
                error: 'Servono thumb e full WebP'
            });
        }

        const thumbsDir = 'assets/images/' + g.folder + '/thumbs';
        const fullDir = 'assets/images/' + g.folder + '/full';
        const thumbEntries = await github.listWebpEntries(thumbsDir);
        const fullEntries = await github.listWebpEntries(fullDir);

        const thumbByNum = {};
        const fullByNum = {};
        thumbEntries.forEach(function (e) {
            thumbByNum[e.num] = e;
        });
        fullEntries.forEach(function (e) {
            fullByNum[e.num] = e;
        });

        if (!thumbByNum[position]) {
            return auth.sendJson(res, 400, {
                ok: false,
                error:
                    'Non esiste la foto ' +
                    formatPhotoName(position, g.pad) +
                    '. Scegli un numero presente in gallery.'
            });
        }

        /* Numeri da spostare in avanti: position … max, dal più alto */
        const toShift = thumbEntries
            .map(function (e) {
                return e.num;
            })
            .filter(function (n) {
                return n >= position;
            })
            .sort(function (a, b) {
                return b - a;
            });

        const files = [];

        /* Solo stato finale: N → N+1 riusando lo stesso blob (niente delete, evita path duplicati) */
        toShift.forEach(function (num) {
            const next = num + 1;
            const newName = formatPhotoName(next, g.pad) + '.webp';
            const t = thumbByNum[num];
            const f = fullByNum[num];
            if (!t || !f) {
                throw new Error(
                    'Coppie thumb/full incomplete per ' + formatPhotoName(num, g.pad)
                );
            }
            files.push({ path: thumbsDir + '/' + newName, sha: t.sha });
            files.push({ path: fullDir + '/' + newName, sha: f.sha });
        });

        /* Nuova foto sovrascrive la posizione scelta */
        const posName = formatPhotoName(position, g.pad) + '.webp';
        files.push({
            path: thumbsDir + '/' + posName,
            content: thumbB64,
            encoding: 'base64'
        });
        files.push({
            path: fullDir + '/' + posName,
            content: fullB64,
            encoding: 'base64'
        });

        /* Elenco numeri finale (ordinato) */
        const finalNums = thumbEntries
            .map(function (e) {
                return e.num < position ? e.num : e.num + 1;
            })
            .concat([position])
            .sort(function (a, b) {
                return a - b;
            });

        /* Con i buchi: elimina i numeri vecchi che non restano nel set finale */
        const finalSet = {};
        finalNums.forEach(function (n) {
            finalSet[n] = true;
        });
        thumbEntries.forEach(function (e) {
            if (!finalSet[e.num]) {
                const orphan = formatPhotoName(e.num, g.pad) + '.webp';
                files.push({ path: thumbsDir + '/' + orphan, delete: true });
                files.push({ path: fullDir + '/' + orphan, delete: true });
            }
        });

        const galleryPage = await github.getFileText(g.htmlFile);
        let galleryHtml = helpers.replaceAllMasonryItems(galleryPage.text, g, finalNums);

        const newTotal = thumbEntries.length + 1;
        const indexPage = await github.getFileText('index.html');
        let indexHtml = helpers.updateIndexCount(indexPage.text, g, newTotal);

        const novitaPage = await github.getFileText('novita-foto.js');
        const publishedAt = helpers.italyNowIso();
        let novitaJs = helpers.updateNovitaJs(novitaPage.text, g.id, 1, publishedAt);

        const cacheVer = helpers.nextCacheVersion(indexHtml);
        galleryHtml = helpers.ensureNovitaScript(galleryHtml, cacheVer);
        indexHtml = helpers.bumpNovitaQuery(indexHtml, cacheVer);

        files.push({ path: g.htmlFile, content: galleryHtml, encoding: 'utf-8' });
        files.push({ path: 'index.html', content: indexHtml, encoding: 'utf-8' });
        files.push({ path: 'novita-foto.js', content: novitaJs, encoding: 'utf-8' });

        const result = await github.commitFiles(
            'cms: inserisci ' +
                g.id +
                ' @' +
                formatPhotoName(position, g.pad) +
                ' (shift +1)',
            files
        );

        return auth.sendJson(res, 200, {
            ok: true,
            galleryId: g.id,
            position: position,
            shifted: toShift.length,
            newTotal: newTotal,
            commitSha: result.commitSha,
            message:
                'Inserita in posizione ' +
                formatPhotoName(position, g.pad) +
                '. Tra 1–2 minuti sarà online.'
        });
    } catch (e) {
        return auth.sendJson(res, 500, {
            ok: false,
            error: e.message || 'Errore inserimento'
        });
    }
};
