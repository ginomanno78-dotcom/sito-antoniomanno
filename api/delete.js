/**
 * POST /api/delete
 * Body: { galleryId, numbers: [12, 15] }
 * Elimina thumb+full e voci HTML. Lascia buchi nei numeri.
 */
const auth = require('../lib/cms/auth');
const { getGallery, formatPhotoName } = require('../lib/cms/galleries');
const github = require('../lib/cms/github');
const helpers = require('../lib/cms/publish-helpers');

const MAX_DELETE = 20;

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

        const raw = Array.isArray(body.numbers) ? body.numbers : [];
        const numbers = raw
            .map(function (n) {
                return parseInt(n, 10);
            })
            .filter(function (n) {
                return Number.isFinite(n) && n > 0;
            });
        const unique = Array.from(new Set(numbers)).sort(function (a, b) {
            return a - b;
        });

        if (unique.length === 0) {
            return auth.sendJson(res, 400, { ok: false, error: 'Nessuna foto da eliminare' });
        }
        if (unique.length > MAX_DELETE) {
            return auth.sendJson(res, 400, {
                ok: false,
                error: 'Massimo ' + MAX_DELETE + ' foto per eliminazione'
            });
        }

        const thumbsDir = 'assets/images/' + g.folder + '/thumbs';
        const fullDir = 'assets/images/' + g.folder + '/full';
        const thumbEntries = await github.listWebpEntries(thumbsDir);
        const byNum = {};
        thumbEntries.forEach(function (e) {
            byNum[e.num] = e;
        });

        for (let i = 0; i < unique.length; i++) {
            if (!byNum[unique[i]]) {
                return auth.sendJson(res, 400, {
                    ok: false,
                    error: 'Foto mancante: ' + formatPhotoName(unique[i], g.pad)
                });
            }
        }

        const files = [];
        unique.forEach(function (num) {
            const name = formatPhotoName(num, g.pad) + '.webp';
            files.push({ path: thumbsDir + '/' + name, delete: true });
            files.push({ path: fullDir + '/' + name, delete: true });
        });

        const galleryPage = await github.getFileText(g.htmlFile);
        let galleryHtml = helpers.removeMasonryItemsByNumbers(galleryPage.text, g, unique);

        const newTotal = thumbEntries.length - unique.length;
        const indexPage = await github.getFileText('index.html');
        const indexHtml = helpers.updateIndexCount(indexPage.text, g, newTotal);

        files.push({ path: g.htmlFile, content: galleryHtml, encoding: 'utf-8' });
        files.push({ path: 'index.html', content: indexHtml, encoding: 'utf-8' });

        const labels = unique.map(function (n) {
            return formatPhotoName(n, g.pad);
        });
        const result = await github.commitFiles(
            'cms: elimina ' + unique.length + ' ' + g.id + ' (' + labels.join(', ') + ')',
            files
        );

        return auth.sendJson(res, 200, {
            ok: true,
            galleryId: g.id,
            deleted: unique.length,
            numbers: unique,
            newTotal: newTotal,
            commitSha: result.commitSha,
            message: 'Eliminate. Tra 1–2 minuti il sito sarà aggiornato.'
        });
    } catch (e) {
        return auth.sendJson(res, 500, {
            ok: false,
            error: e.message || 'Errore eliminazione'
        });
    }
};
