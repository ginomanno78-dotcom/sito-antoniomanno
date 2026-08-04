/**
 * Helper: aggiorna HTML gallery, index, novita-foto.js
 */
const { formatPhotoName } = require('./galleries');

function buildMasonryItem(g, num, dataIndex) {
    const name = formatPhotoName(num, g.pad);
    const altNum = g.pad >= 3 ? name : String(num);
    const alt = g.altPrefix + ' ' + altNum;
    const base = 'assets/images/' + g.folder;
    return (
        '<div class="masonry-item" data-index="' +
        dataIndex +
        '"><img src="' +
        base +
        '/thumbs/' +
        name +
        '.webp" alt="' +
        alt +
        '" data-full="' +
        base +
        '/full/' +
        name +
        '.webp" loading="lazy"></div>'
    );
}

function insertAfterLastMasonryItem(pageHtml, snippet) {
    const needle = 'class="masonry-item"';
    let pos = 0;
    let lastStart = -1;
    while (true) {
        const i = pageHtml.indexOf(needle, pos);
        if (i === -1) break;
        lastStart = i;
        pos = i + needle.length;
    }
    if (lastStart === -1) {
        throw new Error('Nessun masonry-item nella gallery');
    }
    const close = pageHtml.indexOf('</div>', lastStart);
    if (close === -1) {
        throw new Error('HTML gallery non valido');
    }
    const insertAt = close + '</div>'.length;
    return pageHtml.slice(0, insertAt) + '\n' + snippet + pageHtml.slice(insertAt);
}

function updateIndexCount(indexHtml, g, newTotal) {
    const href = g.htmlFile;
    /* Aggiunge data-novita se manca */
    let html = indexHtml.replace(
        new RegExp(
            '(<a href="' + href.replace('.', '\\.') + '" class="portfolio-item[^"]*")(?![^>]*data-novita=)',
            'i'
        ),
        '$1 data-novita="' + g.id + '"'
    );

    const re = new RegExp(
        '(href="' + href.replace('.', '\\.') + '"[\\s\\S]*?portfolio-item-count-text">)\\d+( photos)',
        'i'
    );
    if (!re.test(html)) {
        throw new Error('Conteggio non trovato in index per ' + g.id);
    }
    html = html.replace(re, '$1' + String(newTotal) + '$2');
    return html;
}

function ensureNovitaScript(pageHtml, version) {
    if (/novita-foto\.js/.test(pageHtml)) {
        return pageHtml.replace(/novita-foto\.js\?v=\d+/g, 'novita-foto.js?v=' + version);
    }
    if (!/<\/body>/i.test(pageHtml)) {
        throw new Error('</body> non trovato nella pagina gallery');
    }
    return pageHtml.replace(
        /<\/body>/i,
        '    <script src="novita-foto.js?v=' + version + '"></script>\n</body>'
    );
}

function bumpNovitaQuery(html, version) {
    if (!/novita-foto\.js/.test(html)) return html;
    return html.replace(/novita-foto\.js\?v=\d+/g, 'novita-foto.js?v=' + version);
}

/**
 * Aggiorna NOVITA_CONFIG: stesso batchId, somma count, rinnova publishedAt
 */
function updateNovitaJs(jsText, galleryId, addCount, publishedAtIso) {
    let js = jsText;

    js = js.replace(/publishedAt:\s*'[^']*'/, "publishedAt: '" + publishedAtIso + "'");

    const itemsMatch = js.match(/items:\s*\[([\s\S]*?)\]/);
    if (!itemsMatch) {
        throw new Error('Blocco items non trovato in novita-foto.js');
    }

    const itemRe = /\{\s*id:\s*'([^']+)'\s*,\s*count:\s*(\d+)\s*\}/g;
    const map = {};
    const order = [];
    let m;
    while ((m = itemRe.exec(itemsMatch[1])) !== null) {
        if (!map[m[1]]) order.push(m[1]);
        map[m[1]] = parseInt(m[2], 10);
    }

    if (map[galleryId] != null) {
        map[galleryId] = map[galleryId] + addCount;
    } else {
        order.push(galleryId);
        map[galleryId] = addCount;
    }

    const lines = order.map(function (id) {
        return "            { id: '" + id + "', count: " + map[id] + ' }';
    });
    const newItems = 'items: [\n' + lines.join(',\n') + '\n        ]';
    js = js.replace(/items:\s*\[[\s\S]*?\]/, newItems);

    return js;
}

function italyNowIso() {
    /* Approssimazione ISO con offset +02:00 (estate) / +01:00 (inverno) via locale */
    const d = new Date();
    const parts = new Intl.DateTimeFormat('en-GB', {
        timeZone: 'Europe/Rome',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
    }).formatToParts(d);
    const get = function (type) {
        return parts.find(function (p) {
            return p.type === type;
        }).value;
    };
    const y = get('year');
    const mo = get('month');
    const day = get('day');
    const h = get('hour');
    const mi = get('minute');
    const s = get('second');
    /* Calcola offset Rome vs UTC */
    const rome = new Date(d.toLocaleString('en-US', { timeZone: 'Europe/Rome' }));
    const utc = new Date(d.toLocaleString('en-US', { timeZone: 'UTC' }));
    const offsetMin = Math.round((rome - utc) / 60000);
    const sign = offsetMin >= 0 ? '+' : '-';
    const abs = Math.abs(offsetMin);
    const oh = String(Math.floor(abs / 60)).padStart(2, '0');
    const om = String(abs % 60).padStart(2, '0');
    return y + '-' + mo + '-' + day + 'T' + h + ':' + mi + ':' + s + sign + oh + ':' + om;
}

function nextCacheVersion(jsOrHtml) {
    const m = String(jsOrHtml).match(/novita-foto\.js\?v=(\d+)/);
    if (m) return parseInt(m[1], 10) + 1;
    return 8;
}

module.exports = {
    buildMasonryItem: buildMasonryItem,
    insertAfterLastMasonryItem: insertAfterLastMasonryItem,
    updateIndexCount: updateIndexCount,
    ensureNovitaScript: ensureNovitaScript,
    bumpNovitaQuery: bumpNovitaQuery,
    updateNovitaJs: updateNovitaJs,
    italyNowIso: italyNowIso,
    nextCacheVersion: nextCacheVersion
};
