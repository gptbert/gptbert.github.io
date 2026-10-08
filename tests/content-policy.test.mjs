import assert from 'node:assert/strict';
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import test from 'node:test';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const excluded = new Set(['.git', '.github', '.jekyll-cache', '.sass-cache', '_site', 'tests', 'node_modules', 'AGENTS.md', 'README.md', 'Gemfile', 'Gemfile.lock']);
const textExtensions = new Set(['.md', '.html', '.yml', '.yaml', '.xml', '.json', '.txt', '.css', '.js', '.mjs', '.csv']);
const names = /\u9676\u4fca\u6770|\u9648\u5c0f\u8389|\b(?:jun[\s-]*jie\s+tao|tao\s+jun[\s-]*jie|xiao[\s-]*li\s+chen|chen\s+xiao[\s-]*li)\b/iu;

function textFiles(directory, omit = new Set()) {
  return readdirSync(directory, { withFileTypes: true }).flatMap(entry => {
    if (omit.has(entry.name)) return [];
    const filename = path.join(directory, entry.name);
    if (entry.isDirectory()) return textFiles(filename, omit);
    return entry.isFile() && textExtensions.has(path.extname(entry.name)) ? [filename] : [];
  });
}

function checkText(directory, omit) {
  const failures = [];
  for (const filename of textFiles(directory, omit)) {
    const relative = path.relative(directory, filename).split(path.sep).join('/');
    // Book pages and their source data are explicitly retained by the user.
    if (/^(?:en\/)?books\//.test(relative) || /^_data\/(?:translated|reviewed)_books\.yml$/.test(relative)) continue;
    let text = readFileSync(filename, 'utf8');
    if (relative === 'search-index.json' && !text.startsWith('---')) {
      const index = JSON.parse(text);
      // Keep book records intact; the restriction applies to other content types.
      text = JSON.stringify({ ...index, items: index.items.filter(item => item.type !== 'book') });
    }
    if (names.test(text.normalize('NFKC'))) failures.push(relative);
  }
  assert.deepEqual(failures, [], 'Non-book public text contains a restricted name');
}

test('non-book source respects the name policy', () => checkText(root, excluded));

test('maintenance instructions stay out of Jekyll output', () => {
  const config = readFileSync(path.join(root, '_config.yml'), 'utf8');
  const excludes = config.split(/^exclude:\s*$/m)[1]?.split(/^(?=[A-Za-z_])/m)[0] ?? '';
  for (const entry of ['AGENTS.md', 'tests']) {
    assert.ok(excludes.split('\n').some(line => line.trim() === `- ${entry}`), `Missing Jekyll exclusion: ${entry}`);
  }
});

const output = process.env.CONTENT_SITE_DIR;
test('generated non-book public text respects the name policy', { skip: !output }, () => {
  const site = path.resolve(output);
  assert.ok(existsSync(path.join(site, 'index.html')), 'Build output is missing');
  assert.ok(!existsSync(path.join(site, 'AGENTS.md')), 'Maintenance instructions must not be published');
  assert.ok(!existsSync(path.join(site, 'tests')), 'Policy checks must not be published');
  checkText(site, new Set());
});
