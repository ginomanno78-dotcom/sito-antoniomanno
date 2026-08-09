/**
 * GET /api/galleries — elenco gallery + foto (numeri) + prossimo numero
 * GET /api/galleries?id=jazz — dettaglio foto di una gallery
 */
const auth = require('../lib/cms/auth');
const { GALLERIES, getGallery, formatPhotoName } = require('../lib/cms/galleries');
const github = require('../lib/cms/github');

module.exports = async function handler(req, res) {
    auth.setCors(res, req);
    if (req.method === 'OPTIONS') {
        res.statusCode = 204;
        return res.end();
    }
    if (req.method !== 'GET') {
        return auth.sendJson(res, 405, { ok: false, error: 'Metodo non consentito' });
    }
    const session = auth.requireAuth(req);
    if (!session.ok) {
        return auth.sendJson(res, 401, { ok: false, error: session.error });
    }

    try {
        const url = new URL(req.url, 'http://localhost');
        const onlyId = url.searchParams.get('id');

        if (onlyId) {
            const g = getGallery(onlyId);
            if (!g) {
                return auth.sendJson(res, 400, { ok: false, error: 'Gallery non valida' });
            }
            const thumbsDir = 'assets/images/' + g.folder + '/thumbs';
            const entries = await github.listWebpEntries(thumbsDir);
            const photos = entries.map(function (e) {
                return {
                    num: e.num,
                    name: formatPhotoName(e.num, g.pad),
                    thumbUrl: '/' + e.path
                };
            });
            return auth.sendJson(res, 200, {
                ok: true,
                gallery: {
                    id: g.id,
                    label: g.label,
                    count: photos.length,
                    next: github.nextNumberFromNames(entries.map(function (e) {
                        return e.name;
                    })),
                    pad: g.pad,
                    photos: photos
                }
            });
        }

        const out = [];
        for (let i = 0; i < GALLERIES.length; i++) {
            const g = GALLERIES[i];
            const dir = 'assets/images/' + g.folder + '/thumbs';
            let next = 1;
            let count = 0;
            try {
                const names = await github.listWebpNames(dir);
                count = names.length;
                next = github.nextNumberFromNames(names);
            } catch (e) {
                /* cartella assente */
            }
            out.push({
                id: g.id,
                label: g.label,
                count: count,
                next: next,
                pad: g.pad
            });
        }
        return auth.sendJson(res, 200, { ok: true, galleries: out });
    } catch (e) {
        return auth.sendJson(res, 500, { ok: false, error: e.message || 'Errore galleries' });
    }
};
