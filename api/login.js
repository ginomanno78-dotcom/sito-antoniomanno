/**
 * POST /api/login — email + password → token
 */
const auth = require('../lib/cms/auth');

module.exports = async function handler(req, res) {
    auth.setCors(res, req);
    if (req.method === 'OPTIONS') {
        res.statusCode = 204;
        return res.end();
    }
    if (req.method !== 'POST') {
        return auth.sendJson(res, 405, { ok: false, error: 'Metodo non consentito' });
    }
    try {
        const body = await auth.readJsonBody(req);
        const result = auth.checkLogin(body.email, body.password);
        if (!result.ok) {
            return auth.sendJson(res, 401, { ok: false, error: result.error });
        }
        return auth.sendJson(res, 200, { ok: true, token: result.token });
    } catch (e) {
        return auth.sendJson(res, 400, { ok: false, error: e.message || 'Errore login' });
    }
};
