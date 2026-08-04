/**
 * POST /api/publish
 * Body JSON:
 * {
 *   galleryId: 'jazz',
 *   pairs: [
 *     { thumbBase64: '...', fullBase64: '...' }  // webp senza data-url prefix
 *   ]
 * }
 * Max 5 coppie per richiesta (limite body Vercel).
 */
const auth = require('../lib/cms/auth');
const { getGallery, formatPhotoName } = require('../lib/cms/galleries');
const github = require('../lib/cms/github');
const helpers = require('../lib/cms/publish-helpers');

const MAX_PAIRS = 5;

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
        const galleryId = body.galleryId;
        const pairs = Array.isArray(body.pairs) ? body.pairs : [];
        const g = getGallery(galleryId);

        if (!g) {
            return auth.sendJson(res, 400, { ok: false, error: 'Gallery non valida' });
        }
        if (pairs.length === 0) {
            return auth.sendJson(res, 400, { ok: false, error: 'Nessuna foto da pubblicare' });
        }
        if (pairs.length > MAX_PAIRS) {
            return auth.sendJson(res, 400, {
                ok: false,
                error: 'Massimo ' + MAX_PAIRS + ' coppie per pubblicazione'
            });
        }

        const thumbsDir = 'assets/images/' + g.folder + '/thumbs';
        const names = await github.listWebpNames(thumbsDir);
        let next = github.nextNumberFromNames(names);
        const startNext = next;
        const addCount = pairs.length;
        const newTotal = names.length + addCount;

        const files = [];
        const masonryBits = [];

        for (let i = 0; i < pairs.length; i++) {
            const thumbB64 = stripDataUrl(pairs[i].thumbBase64);
            const fullB64 = stripDataUrl(pairs[i].fullBase64);
            if (!thumbB64 || !fullB64) {
                return auth.sendJson(res, 400, {
                    ok: false,
                    error: 'Coppie incomplete: servono thumb e full WebP'
                });
            }
            const num = next++;
            const fileName = formatPhotoName(num, g.pad) + '.webp';
            const dataIndex = num - 1;

            files.push({
                path: thumbsDir + '/' + fileName,
                content: thumbB64,
                encoding: 'base64'
            });
            files.push({
                path: 'assets/images/' + g.folder + '/full/' + fileName,
                content: fullB64,
                encoding: 'base64'
            });
            masonryBits.push(helpers.buildMasonryItem(g, num, dataIndex));
        }

        const galleryPage = await github.getFileText(g.htmlFile);
        let galleryHtml = helpers.insertAfterLastMasonryItem(
            galleryPage.text,
            masonryBits.join('\n')
        );

        const indexPage = await github.getFileText('index.html');
        let indexHtml = helpers.updateIndexCount(indexPage.text, g, newTotal);

        const novitaPage = await github.getFileText('novita-foto.js');
        const publishedAt = helpers.italyNowIso();
        let novitaJs = helpers.updateNovitaJs(
            novitaPage.text,
            g.id,
            addCount,
            publishedAt
        );

        const cacheVer = helpers.nextCacheVersion(indexHtml);
        galleryHtml = helpers.ensureNovitaScript(galleryHtml, cacheVer);
        indexHtml = helpers.bumpNovitaQuery(indexHtml, cacheVer);

        files.push({ path: g.htmlFile, content: galleryHtml, encoding: 'utf-8' });
        files.push({ path: 'index.html', content: indexHtml, encoding: 'utf-8' });
        files.push({ path: 'novita-foto.js', content: novitaJs, encoding: 'utf-8' });

        const msg =
            'cms: +' +
            addCount +
            ' ' +
            g.id +
            ' (' +
            formatPhotoName(startNext, g.pad) +
            '–' +
            formatPhotoName(next - 1, g.pad) +
            ')';

        const result = await github.commitFiles(msg, files);

        return auth.sendJson(res, 200, {
            ok: true,
            galleryId: g.id,
            added: addCount,
            newTotal: newTotal,
            from: formatPhotoName(startNext, g.pad),
            to: formatPhotoName(next - 1, g.pad),
            commitSha: result.commitSha,
            message: 'Pubblicato. Tra 1–2 minuti le foto saranno online.'
        });
    } catch (e) {
        return auth.sendJson(res, 500, {
            ok: false,
            error: e.message || 'Errore pubblicazione'
        });
    }
};
