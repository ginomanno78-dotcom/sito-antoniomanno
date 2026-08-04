/**
 * Auth CMS — token HMAC firmato (senza dipendenze esterne)
 */
const crypto = require('crypto');

const TOKEN_TTL_MS = 12 * 60 * 60 * 1000; /* 12 ore */

function getSecret() {
    return process.env.CMS_SECRET || '';
}

function getCredentials() {
    return {
        email: (process.env.CMS_EMAIL || '').trim().toLowerCase(),
        password: process.env.CMS_PASSWORD || ''
    };
}

function timingSafeEqualStr(a, b) {
    const bufA = Buffer.from(String(a));
    const bufB = Buffer.from(String(b));
    if (bufA.length !== bufB.length) return false;
    return crypto.timingSafeEqual(bufA, bufB);
}

function signToken(payload) {
    const secret = getSecret();
    if (!secret) throw new Error('CMS_SECRET mancante');
    const body = Buffer.from(JSON.stringify(payload)).toString('base64url');
    const sig = crypto.createHmac('sha256', secret).update(body).digest('base64url');
    return body + '.' + sig;
}

function verifyToken(token) {
    if (!token || typeof token !== 'string' || token.indexOf('.') === -1) return null;
    const secret = getSecret();
    if (!secret) return null;
    const parts = token.split('.');
    if (parts.length !== 2) return null;
    const body = parts[0];
    const sig = parts[1];
    const expected = crypto.createHmac('sha256', secret).update(body).digest('base64url');
    if (!timingSafeEqualStr(sig, expected)) return null;
    try {
        const payload = JSON.parse(Buffer.from(body, 'base64url').toString('utf8'));
        if (!payload || !payload.exp || Date.now() > payload.exp) return null;
        return payload;
    } catch (e) {
        return null;
    }
}

function createSessionToken(email) {
    return signToken({
        email: email,
        exp: Date.now() + TOKEN_TTL_MS
    });
}

function checkLogin(email, password) {
    const creds = getCredentials();
    if (!creds.email || !creds.password || !getSecret()) {
        return { ok: false, error: 'CMS non configurato (env mancanti)' };
    }
    const emailOk = timingSafeEqualStr(
        String(email || '').trim().toLowerCase(),
        creds.email
    );
    const passOk = timingSafeEqualStr(String(password || ''), creds.password);
    if (!emailOk || !passOk) {
        return { ok: false, error: 'Credenziali non valide' };
    }
    return { ok: true, token: createSessionToken(creds.email) };
}

function getBearerToken(req) {
    const h = req.headers.authorization || req.headers.Authorization || '';
    if (typeof h === 'string' && h.toLowerCase().indexOf('bearer ') === 0) {
        return h.slice(7).trim();
    }
    return null;
}

function requireAuth(req) {
    const token = getBearerToken(req);
    const payload = verifyToken(token);
    if (!payload) return { ok: false, error: 'Sessione non valida o scaduta' };
    return { ok: true, email: payload.email };
}

function setCors(res, req) {
    const origin = req.headers.origin || '';
    /* Stesso progetto Vercel: admin e API sullo stesso host */
    if (origin) {
        res.setHeader('Access-Control-Allow-Origin', origin);
        res.setHeader('Vary', 'Origin');
    }
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
}

function sendJson(res, status, data) {
    res.statusCode = status;
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.end(JSON.stringify(data));
}

function readJsonBody(req) {
    return new Promise(function (resolve, reject) {
        const chunks = [];
        req.on('data', function (c) {
            chunks.push(c);
        });
        req.on('end', function () {
            try {
                const raw = Buffer.concat(chunks).toString('utf8');
                if (!raw) return resolve({});
                resolve(JSON.parse(raw));
            } catch (e) {
                reject(new Error('JSON non valido'));
            }
        });
        req.on('error', reject);
    });
}

module.exports = {
    checkLogin: checkLogin,
    requireAuth: requireAuth,
    setCors: setCors,
    sendJson: sendJson,
    readJsonBody: readJsonBody
};
