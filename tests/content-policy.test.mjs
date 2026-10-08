import assert from 'node:assert/strict';
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import test from 'node:test';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const excluded = new Set(['.git', '.github', '.jekyll-cache', '.sass-cache', '_site', 'tests', 'node_modules', 'AGENTS.md', 'README.md', 'Gemfile', 'Gemfile.lock']);
const textExtensions = new Set(['.md', '.html', '.yml', '.yaml', '.xml', '.json', '.svg', '.txt', '.css', '.js', '.mjs', '.csv']);
const names = /\u9676\u4fca\u6770|\u9648\u5c0f\u8389|\b(?:jun\s*jie\s+tao|tao\s+jun\s*jie|xiao\s*li\s+chen|chen\s+xiao\s*li)\b/iu;
const signedCovers = [
  'python-data-science-handbook-2.jpg', 'data-analysis-zh.jpg',
  'asyncio-recipes-zh.jpg', 'python-interviews.jpg',
  'social-media-mining-python.jpg', 'python-data-science-handbook.png',
  'python-machine-learning-cookbook.png', 'python-scientific-computing.jpg',
  'python-high-performance.jpg', 'web-scraping-with-python.jpg',
  'python-crash-course-3.jpg',
];

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
    const text = readFileSync(filename, 'utf8').normalize('NFKC');
    if (names.test(text)) failures.push(path.relative(directory, filename));
    // Keep the original images locally, but prevent their use in public pages.
    if (path.basename(filename) !== '_config.yml' && signedCovers.some(cover => text.includes(`/assets/books/${cover}`))) {
      failures.push(`${path.relative(directory, filename)} (cover with personal credit)`);
    }
  }
  assert.deepEqual(failures, [], 'Public content contains a restricted name or signed cover');
}

test('public source respects the name policy', () => checkText(root, excluded));

test('maintenance instructions and signed covers stay out of Jekyll output', () => {
  const config = readFileSync(path.join(root, '_config.yml'), 'utf8');
  const excludes = config.split(/^exclude:\s*$/m)[1]?.split(/^(?=[A-Za-z_])/m)[0] ?? '';
  for (const entry of ['AGENTS.md', 'tests', ...signedCovers.map(name => `assets/books/${name}`)]) {
    assert.ok(excludes.split('\n').some(line => line.trim() === `- ${entry}`), `Missing Jekyll exclusion: ${entry}`);
  }
});

const output = process.env.CONTENT_SITE_DIR;
test('generated public files respect the name policy', { skip: !output }, () => {
  const site = path.resolve(output);
  assert.ok(existsSync(path.join(site, 'index.html')), 'Build output is missing');
  assert.ok(!existsSync(path.join(site, 'AGENTS.md')), 'Maintenance instructions must not be published');
  assert.ok(!existsSync(path.join(site, 'tests')), 'Policy checks must not be published');
  checkText(site, new Set());
  for (const name of signedCovers) {
    assert.ok(!existsSync(path.join(site, 'assets/books', name)), 'A cover with personal credit was published');
  }
});
