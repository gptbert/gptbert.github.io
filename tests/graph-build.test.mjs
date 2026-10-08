import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import path from 'node:path';
import { buildGraph } from '../assets/js/graph-core.js';
const directory = process.env.CONTENT_SITE_DIR;
test('published graph includes every indexed item and resolves all content links', { skip: !directory }, () => {
  const root = path.resolve(directory);
  const index = JSON.parse(readFileSync(path.join(root, 'search-index.json'), 'utf8'));
  const identities = new Set(index.items.map(item => item.id));
  const knownTags = new Set(index.tags.map(tag => tag.id));
  for (const item of index.items) for (const tag of item.tags || []) assert.ok(knownTags.has(tag), `Undefined topic ${tag} on ${item.id}`);
  for (const lang of ['zh-CN', 'en']) {
    const graph = buildGraph(index, { lang });
    assert.deepEqual(new Set(graph.items.map(item => item.id)), identities);
    const graphPage = path.join(root, lang === 'en' ? 'en/graph/index.html' : 'graph/index.html');
    assert.ok(existsSync(graphPage), `Missing graph page for ${lang}`);
    const html = readFileSync(graphPage, 'utf8');
    assert.ok(html.includes('knowledge-graph') && html.includes('/assets/js/graph.js'));
    for (const item of graph.items) {
      const [url, anchor] = item.url.split('#');
      const file = path.join(root, url, url.endsWith('/') ? 'index.html' : '');
      assert.ok(existsSync(file), `Missing content ${item.url}`);
      if (anchor) assert.ok(readFileSync(file, 'utf8').includes(`id="${anchor}"`), `Missing anchor ${item.url}`);
    }
  }
});
