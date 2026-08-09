/**
 * Client minimo GitHub Contents / Git Data API
 */
function cfg() {
    const token = process.env.GITHUB_TOKEN || '';
    const owner = process.env.GITHUB_OWNER || '';
    const repo = process.env.GITHUB_REPO || '';
    const branch = process.env.GITHUB_BRANCH || 'main';
    if (!token || !owner || !repo) {
        throw new Error('GitHub non configurato (GITHUB_TOKEN / OWNER / REPO)');
    }
    return { token: token, owner: owner, repo: repo, branch: branch };
}

async function gh(path, options) {
    const c = cfg();
    const opts = options || {};
    const res = await fetch('https://api.github.com' + path, {
        method: opts.method || 'GET',
        headers: {
            Accept: 'application/vnd.github+json',
            Authorization: 'Bearer ' + c.token,
            'X-GitHub-Api-Version': '2022-11-28',
            'User-Agent': 'antoniomanno-cms',
            ...(opts.body ? { 'Content-Type': 'application/json' } : {})
        },
        body: opts.body ? JSON.stringify(opts.body) : undefined
    });
    const text = await res.text();
    let data = null;
    try {
        data = text ? JSON.parse(text) : null;
    } catch (e) {
        data = { raw: text };
    }
    if (!res.ok) {
        const msg = (data && (data.message || data.error)) || res.statusText;
        throw new Error('GitHub ' + res.status + ': ' + msg);
    }
    return data;
}

async function getFileText(filePath) {
    const c = cfg();
    const data = await gh(
        '/repos/' + c.owner + '/' + c.repo + '/contents/' + encodeURI(filePath) + '?ref=' + encodeURIComponent(c.branch)
    );
    if (!data || !data.content) throw new Error('File vuoto: ' + filePath);
    const buf = Buffer.from(data.content.replace(/\n/g, ''), 'base64');
    return { text: buf.toString('utf8'), sha: data.sha };
}

/**
 * Un solo commit con più file (blob + tree + commit + ref)
 * files: [
 *   { path, content, encoding: 'utf-8'|'base64' }  // crea/aggiorna
 *   { path, sha }                                   // riusa blob esistente (rename)
 *   { path, delete: true }                          // elimina
 * ]
 */
async function commitFiles(message, files) {
    const c = cfg();
    const ref = await gh('/repos/' + c.owner + '/' + c.repo + '/git/ref/heads/' + encodeURIComponent(c.branch));
    const commitSha = ref.object.sha;
    const commit = await gh('/repos/' + c.owner + '/' + c.repo + '/git/commits/' + commitSha);
    const baseTree = commit.tree.sha;

    const treeItems = [];
    for (let i = 0; i < files.length; i++) {
        const f = files[i];
        if (f.delete) {
            treeItems.push({
                path: f.path,
                mode: '100644',
                type: 'blob',
                sha: null
            });
            continue;
        }
        if (f.sha && !f.content) {
            treeItems.push({
                path: f.path,
                mode: '100644',
                type: 'blob',
                sha: f.sha
            });
            continue;
        }
        let content;
        let encoding;
        if (Buffer.isBuffer(f.content)) {
            content = f.content.toString('base64');
            encoding = 'base64';
        } else if (f.encoding === 'base64') {
            content = f.content;
            encoding = 'base64';
        } else {
            content = f.content;
            encoding = 'utf-8';
        }
        const blob = await gh('/repos/' + c.owner + '/' + c.repo + '/git/blobs', {
            method: 'POST',
            body: { content: content, encoding: encoding }
        });
        treeItems.push({
            path: f.path,
            mode: '100644',
            type: 'blob',
            sha: blob.sha
        });
    }

    const tree = await gh('/repos/' + c.owner + '/' + c.repo + '/git/trees', {
        method: 'POST',
        body: { base_tree: baseTree, tree: treeItems }
    });

    const newCommit = await gh('/repos/' + c.owner + '/' + c.repo + '/git/commits', {
        method: 'POST',
        body: {
            message: message,
            tree: tree.sha,
            parents: [commitSha]
        }
    });

    await gh('/repos/' + c.owner + '/' + c.repo + '/git/refs/heads/' + encodeURIComponent(c.branch), {
        method: 'PATCH',
        body: { sha: newCommit.sha }
    });

    return { commitSha: newCommit.sha };
}

/**
 * Elenca i .webp in una cartella (nome + sha blob Git)
 */
async function listWebpEntries(dirPath) {
    const c = cfg();
    const data = await gh(
        '/repos/' + c.owner + '/' + c.repo + '/contents/' + encodeURI(dirPath) + '?ref=' + encodeURIComponent(c.branch)
    );
    if (!Array.isArray(data)) return [];
    return data
        .filter(function (f) {
            return f.type === 'file' && /\.webp$/i.test(f.name);
        })
        .map(function (f) {
            const m = String(f.name).match(/^(\d+)\.webp$/i);
            return {
                name: f.name,
                num: m ? parseInt(m[1], 10) : null,
                sha: f.sha,
                path: dirPath + '/' + f.name
            };
        })
        .filter(function (f) {
            return f.num != null;
        })
        .sort(function (a, b) {
            return a.num - b.num;
        });
}

/**
 * Elenca i .webp in una cartella del repo (max 1000 via Contents API)
 */
async function listWebpNames(dirPath) {
    const entries = await listWebpEntries(dirPath);
    return entries.map(function (e) {
        return e.name;
    });
}

function nextNumberFromNames(names) {
    let max = 0;
    names.forEach(function (name) {
        const m = String(name).match(/^(\d+)\.webp$/i);
        if (m) {
            const n = parseInt(m[1], 10);
            if (n > max) max = n;
        }
    });
    return max + 1;
}

module.exports = {
    getFileText: getFileText,
    commitFiles: commitFiles,
    listWebpNames: listWebpNames,
    listWebpEntries: listWebpEntries,
    nextNumberFromNames: nextNumberFromNames,
    cfg: cfg
};
