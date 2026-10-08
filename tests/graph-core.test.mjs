import test from 'node:test';
import assert from 'node:assert/strict';
import { buildGraph } from '../assets/js/graph-core.js';
const index = {
  tags: [{ id: 'ai', name: '人工智能', name_en: 'AI' }, { id: 'python', name: 'Python', name_en: 'Python' }, { id: 'unused', name: '空主题', name_en: 'Unused' }],
  items: [
    { id: 'post:a', type: 'post', lang: 'en', title: 'AI systems', tags: ['ai', 'ai', 'undefined'] },
    { id: 'post:a', type: 'post', lang: 'zh-CN', title: '智能系统', tags: ['ai', 'ai', 'undefined'] },
    { id: 'book:b', type: 'book', lang: 'zh-CN', title: 'Python图书', tags: ['python'] },
    { id: 'project:c', type: 'project', lang: 'en', title: 'Bridge', description: 'AI and Python', tags: ['ai', 'python'] },
    { id: 'post:untagged', type: 'post', lang: 'zh-CN', title: '未分类', tags: [] }
  ]
};
test('translations collapse, language fallback survives, and only defined unique tags form edges', () => {
  const graph = buildGraph(index);
  assert.equal(graph.items.length, 4);
  assert.equal(graph.items.find(item => item.id === 'post:a').title, '智能系统');
  assert.equal(graph.items.find(item => item.id === 'project:c').lang, 'en');
  assert.equal(graph.edges.length, 4);
  assert.deepEqual(graph.topics.map(topic => topic.id), ['ai', 'python']);
  assert.equal(buildGraph(index, { lang: 'en' }).items.find(item => item.id === 'post:a').title, 'AI systems');
});
test('topic, type, and normalized multi-term query filters combine without orphan edges', () => {
  const graph = buildGraph(index, { topic: 'python', type: 'project', query: 'ＡＩ Python' });
  assert.deepEqual(graph.items.map(item => item.id), ['project:c']);
  assert.equal(graph.edges.length, 2);
  for (const edge of graph.edges) assert.ok(graph.items.some(item => item.id === edge.target));
  assert.deepEqual(buildGraph(index, { query: 'no such item' }), { items: [], topics: [], edges: [] });
});
