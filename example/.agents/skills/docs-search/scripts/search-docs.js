#!/usr/bin/env node

/**
 * search-docs.js
 * Search durable docs using a layered fallback strategy:
 * rg -> git grep -> grep -> native Node.js fallback.
 */

const fs = require('fs');
const path = require('path');
const { spawnSync, execSync } = require('child_process');

const DEBUG = process.env.DEBUG_SEARCH === '1';

function findAgentsRoot(start) {
    let curr = path.resolve(start);
    while (true) {
        const candidate = path.join(curr, '.agents');
        if (fs.existsSync(candidate) && fs.statSync(candidate).isDirectory()) {
            return candidate;
        }
        const parent = path.dirname(curr);
        if (parent === curr) break;
        curr = parent;
    }
    return null;
}

function resolveAgentsRoot(argsAgentsRoot) {
    let raw = argsAgentsRoot || process.env.AGENTS_ROOT;
    if (raw) {
        let candidate = path.resolve(raw);
        if (path.basename(candidate) !== '.agents') {
            candidate = path.join(candidate, '.agents');
        }
        return candidate;
    }
    return findAgentsRoot(process.cwd());
}

function getMetadata(filePath) {
    const content = fs.readFileSync(filePath, 'utf-8');
    let title = '';
    let description = '';

    // Simple frontmatter extraction
    const fmMatch = content.match(/^---\n([\s\S]*?)\n---\n/);
    if (fmMatch) {
        const fm = fmMatch[1];
        const titleMatch = fm.match(/^title:\s*(.*)$/m);
        if (titleMatch) title = titleMatch[1].replace(/['"]/g, '').trim();
        const descMatch = fm.match(/^description:\s*(.*)$/m);
        if (descMatch) description = descMatch[1].replace(/['"]/g, '').trim();
    }

    if (!title) {
        const h1Match = content.match(/^#\s+(.*)$/m);
        if (h1Match) {
            title = h1Match[1].trim();
        } else {
            title = path.basename(filePath, '.md').replace(/[-_]/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
        }
    }

    if (!description) {
        // First paragraph heuristic
        const body = content.replace(/^---\n[\s\S]*?\n---\n/, '').trim();
        const paragraphs = body.split(/\n\s*\n/);
        for (const p of paragraphs) {
            const clean = p.replace(/#+.*$/gm, '').trim();
            if (clean && !clean.startsWith('```')) {
                description = clean.split('\n').join(' ').substring(0, 200).trim();
                if (description.length === 200) description += '...';
                break;
            }
        }
    }

    return { title, description };
}

function folderDisplay(repoPath) {
    if (repoPath.startsWith('.agents/playbooks/')) return '.agents/playbooks/';
    if (repoPath === '.agents/AGENTS.md') return '.agents/';

    const parts = repoPath.split('/');
    // .agents/docs/folder/file.md -> parts=[.agents, docs, folder, file.md]
    if (parts[0] === '.agents' && parts[1] === 'docs') {
        if (parts.length > 3) {
            return `.agents/docs/${parts[2]}/`;
        }
        return '.agents/docs/';
    }
    return '.agents/';
}

function tryCommand(cmd) {
    try {
        execSync(cmd, { stdio: 'ignore' });
        return true;
    } catch (e) {
        return false;
    }
}

function runSearch(cmd, args, repoRoot) {
    const result = spawnSync(cmd, args, { cwd: repoRoot, encoding: 'utf-8' });
    if (result.status === 0) {
        return result.stdout.trim().split('\n').filter(Boolean);
    }
    return [];
}

function searchWithRg(repoRoot, query, limit, forceDisable = false) {
    if (forceDisable || !tryCommand('rg --version')) return null;
    if (DEBUG) console.error('Trying search with ripgrep...');

    const args = ['-l', '-i', query, '.agents/docs', '.agents/playbooks', '.agents/AGENTS.md'];
    const results = runSearch('rg', args, repoRoot);
    return results.slice(0, limit);
}

function searchWithGitGrep(repoRoot, query, limit, forceDisable = false) {
    if (forceDisable || !tryCommand('git --version')) return null;
    if (DEBUG) console.error('Trying search with git grep...');

    const args = ['grep', '-l', '-i', query, '--', '.agents/docs', '.agents/playbooks', '.agents/AGENTS.md'];
    const results = runSearch('git', args, repoRoot);
    return results.slice(0, limit);
}

function searchWithGrep(repoRoot, query, limit, forceDisable = false) {
    if (forceDisable || !tryCommand('grep --version')) return null;
    if (DEBUG) console.error('Trying search with grep...');

    const args = ['-r', '-l', '-i', query, '.agents/docs', '.agents/playbooks', '.agents/AGENTS.md'];
    const results = runSearch('grep', args, repoRoot);
    return results.slice(0, limit);
}

function searchNative(repoRoot, query, limit) {
    if (DEBUG) console.error('Trying search with native Node.js fallback...');
    const results = [];
    const searchDirs = [
        path.join(repoRoot, '.agents/docs'),
        path.join(repoRoot, '.agents/playbooks'),
        path.join(repoRoot, '.agents/AGENTS.md')
    ];

    function walk(dir) {
        if (!fs.existsSync(dir)) return;
        const stat = fs.statSync(dir);
        if (stat.isFile()) {
            if (dir.endsWith('.md')) {
                const content = fs.readFileSync(dir, 'utf-8');
                if (content.toLowerCase().includes(query.toLowerCase())) {
                    results.push(path.relative(repoRoot, dir));
                }
            }
            return;
        }
        const files = fs.readdirSync(dir);
        for (const file of files) {
            walk(path.join(dir, file));
            if (results.length >= limit) break;
        }
    }

    for (const d of searchDirs) {
        walk(d);
        if (results.length >= limit) break;
    }
    return results.slice(0, limit);
}

function main() {
    const args = process.argv.slice(2);
    let query = '';
    let limit = 5;
    let argsAgentsRoot = null;

    for (let i = 0; i < args.length; i++) {
        if (args[i] === '--limit' || args[i] === '-n') {
            limit = parseInt(args[++i], 10);
        } else if (args[i] === '--agents-root') {
            argsAgentsRoot = args[++i];
        } else if (!args[i].startsWith('-')) {
            query = args[i];
        }
    }

    if (!query) {
        console.error('ERROR: positional argument "query" is required.');
        process.exit(1);
    }

    const agentsRoot = resolveAgentsRoot(argsAgentsRoot);
    if (!agentsRoot || !fs.existsSync(agentsRoot)) {
        console.error('ERROR: could not locate .agents directory.');
        process.exit(1);
    }

    const repoRoot = path.dirname(agentsRoot);

    let filePaths = searchWithRg(repoRoot, query, limit, process.env.DISABLE_RG === '1');
    if (filePaths === null) filePaths = searchWithGitGrep(repoRoot, query, limit, process.env.DISABLE_GIT === '1');
    if (filePaths === null) filePaths = searchWithGrep(repoRoot, query, limit, process.env.DISABLE_GREP === '1');
    if (filePaths === null) filePaths = searchNative(repoRoot, query, limit);

    console.log('🏷️ TOP MATCHES:\n');

    if (!filePaths || (filePaths.length === 1 && filePaths[0] === '')) {
        console.log('(no matches found)');
        return;
    }

    for (const repoPath of filePaths) {
        if (!repoPath) continue;
        const fullPath = path.join(repoRoot, repoPath);
        if (!fs.existsSync(fullPath)) continue;

        const { title, description } = getMetadata(fullPath);
        const folder = folderDisplay(repoPath);
        // Normalize path to use forward slashes even on Windows for consistency
        const relFromSkill = path.join('../../../', repoPath).split(path.sep).join('/');

        console.log(`📁 ${folder}`);
        console.log(`   ${title}`);
        if (description) {
            console.log(`   ${description}`);
        }
        console.log(`   📄 ${relFromSkill}\n`);
    }
}

main();
