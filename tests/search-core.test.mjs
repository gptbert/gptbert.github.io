import assert from 'node:assert/strict';
import test from 'node:test';

import { foldTextWithOffsets, normalizeText, searchItems } from '../assets/js/search-core.js';

const tagDefinitions = [
  { id: 'reading', name: '数字阅读', name_en: 'Digital reading' },
  { id: 'python', name: 'Python', name_en: 'Python' },
  { id: 'machine-learning', name: '机器学习', name_en: 'Machine learning' },
];

function item(overrides) {
  return {
    id: 'default',
    type: 'post',
    lang: 'zh-CN',
    title: '工程记录',
    url: '/posts/example/',
    description: '',
    content: '',
    tags: [],
    ...overrides,
  };
}

const catalog = [
  item({
    id: 'taobook-story',
    title: 'taobook 的开发历程',
    description: '一款阅读器的工程实践',
    content: 'Android 使用 Readium。鸿蒙接入系统离线语音，完成分段朗读、跨章继续和正文高亮。',
    tags: ['reading'],
  }),
  item({
    id: 'python-book',
    type: 'book',
    title: 'Python 机器学习实例',
    description: '分类、预测与模型实践',
    content: 'ISBN 978-7-115-46527-6，作者 Prateek Joshi。',
    tags: ['python', 'machine-learning'],
  }),
  item({
    id: 'python-book',
    type: 'book',
    lang: 'en',
    title: 'Python Machine Learning Cookbook',
    url: '/en/books/#python-book',
    description: 'Practical classification and prediction examples',
    content: 'ISBN 978-7-115-46527-6. Author: Prateek Joshi.',
    tags: ['python', 'machine-learning'],
  }),
  item({
    id: 'reader-project',
    type: 'project',
    title: '阅读工具',
    description: '使用 Python 整理个人书库',
    tags: ['python', 'reading'],
  }),
  item({
    id: 'reader-project',
    type: 'project',
    lang: 'en',
    title: 'Reading tools',
    url: '/en/projects/#reader-project',
    description: 'Organize a personal library with Python',
    tags: ['python', 'reading'],
  }),
];

const search = (options, items = catalog) => searchItems(items, options, tagDefinitions);
const ids = (results) => results.map(({ item: result }) => result.id);

test('finds a Chinese phrase that appears only in an article body', () => {
  const results = search({ query: '跨章继续' });
  assert.deepEqual(ids(results), ['taobook-story']);
  assert.ok(results[0].matchIndex >= 0, 'body matches provide a usable excerpt position');
  assert.ok(results[0].item.content.slice(results[0].matchIndex).startsWith('跨章继续'));
});

test('requires every search term while allowing terms to occur in different fields', () => {
  assert.deepEqual(ids(search({ query: 'taobook 离线语音' })), ['taobook-story']);
  assert.deepEqual(ids(search({ query: 'taobook 不存在的关键词' })), []);
});

test('normalizes full-width Latin letters and letter case', () => {
  assert.deepEqual(ids(search({ query: 'ＴＡＯＢＯＯＫ' })), ['taobook-story']);
  assert.deepEqual(ids(search({ query: 'ｒｅａｄｉｕｍ' })), ['taobook-story']);
});

test('normalizes canonically equivalent accented text', () => {
  const items = [item({ id: 'accented', content: 'A café notebook' })];
  assert.deepEqual(ids(search({ query: 'CAFE\u0301' }, items)), ['accented']);
});

test('a blank query lists each logical entry once in the requested language', () => {
  const results = search({ query: '  \n\t ', lang: 'en' });
  assert.equal(results.length, 3);
  assert.equal(new Set(ids(results)).size, 3);
  assert.equal(results.find(({ item: result }) => result.id === 'python-book').item.lang, 'en');
  assert.equal(results.find(({ item: result }) => result.id === 'reader-project').item.lang, 'en');
});

test('Chinese entries remain discoverable from English search when no translation exists', () => {
  const results = search({ query: '离线语音', lang: 'en' });
  assert.deepEqual(ids(results), ['taobook-story']);
  assert.equal(results[0].item.lang, 'zh-CN');
  assert.equal(results[0].item.url, '/posts/example/');
});

test('language preference works regardless of the input order', () => {
  for (const items of [catalog, [...catalog].reverse()]) {
    const results = search({ query: 'Python', type: 'book', lang: 'zh-CN' }, items);
    assert.equal(results.length, 1);
    assert.equal(results[0].item.title, 'Python 机器学习实例');
  }
});

test('returns a matching translation when the preferred representation does not match', () => {
  const results = search({ query: 'classification', lang: 'zh-CN' });
  assert.deepEqual(ids(results), ['python-book']);
  assert.equal(results[0].item.lang, 'en');
  assert.equal(results[0].item.url, '/en/books/#python-book');
});

test('all query terms must match one representation instead of being split across translations', () => {
  assert.deepEqual(ids(search({ query: '实例 classification' })), []);
});

test('combines a full-text query with exact type and tag filters', () => {
  assert.deepEqual(ids(search({ query: 'Python', tag: 'python', type: 'book' })), ['python-book']);
  assert.deepEqual(ids(search({ query: 'Python', tag: 'reading', type: 'project' })), ['reader-project']);
  assert.deepEqual(ids(search({ query: 'Python', tag: 'reading', type: 'book' })), []);
});

test('tag selection is exact and an unknown tag returns no entries', () => {
  assert.deepEqual(ids(search({ tag: 'py' })), []);
  assert.deepEqual(ids(search({ tag: 'unknown-topic' })), []);
  assert.deepEqual(new Set(ids(search({ tag: 'python' }))), new Set(['python-book', 'reader-project']));
});

test('indexes both Chinese and English tag labels', () => {
  assert.deepEqual(ids(search({ query: '机器学习', type: 'project' }, [
    item({ id: 'model-project', type: 'project', title: '模型工具', tags: ['machine-learning'] }),
  ])), ['model-project']);
  assert.deepEqual(ids(search({ query: 'machine learning', type: 'project' }, [
    item({ id: 'model-project', type: 'project', title: '模型工具', tags: ['machine-learning'] }),
  ])), ['model-project']);
});

test('orders title, tag, description, and body matches by relevance', () => {
  const items = [
    item({ id: 'body', content: 'Python examples' }),
    item({ id: 'description', description: 'Python examples' }),
    item({ id: 'tag', tags: ['python'] }),
    item({ id: 'title', title: 'Python examples' }),
  ];
  const results = search({ query: 'Python' }, items);
  assert.deepEqual(ids(results), ['title', 'tag', 'description', 'body']);
  for (let index = 1; index < results.length; index += 1) {
    assert.ok(results[index - 1].score > results[index].score);
  }
});

test('treats query punctuation safely instead of executing a regular expression', () => {
  const items = [
    item({ id: 'cpp', title: 'C++ [Beta]' }),
    item({ id: 'python', title: 'Python' }),
  ];
  assert.deepEqual(ids(search({ query: 'C++' }, items)), ['cpp']);
  assert.deepEqual(ids(search({ query: '.*' }, items)), []);
  for (const query of ['[', '(', '\\', '.*', '<script>alert(1)</script>']) {
    assert.doesNotThrow(() => search({ query }, items));
  }
});

function assertHighlightSource(source, query, expected) {
  const { folded, offsets } = foldTextWithOffsets(source);
  const term = normalizeText(query);
  const at = folded.indexOf(term);
  assert.ok(at >= 0, `Expected ${query} to match ${source}`);
  assert.equal(offsets.length, folded.length, 'every searchable code unit has a source range');
  const start = offsets[at][0];
  const end = offsets[at + term.length - 1][1];
  assert.equal(source.slice(start, end), expected, 'highlight preserves the original source spelling');
  assert.equal(start, source.indexOf(expected), 'highlight starts at the original UTF-16 offset');
  assert.equal(end, source.indexOf(expected) + expected.length, 'highlight includes the complete source grapheme');
}

test('highlight offsets preserve combining accents and preceding emoji', () => {
  assertHighlightSource('前😀 CAFE\u0301 后', 'café', 'CAFE\u0301');
  assertHighlightSource('前😀 CAFE\u0301 notebook', 'notebook', 'notebook');
});

test('Greek final sigma uses the same whole-string lowercase rules as search', () => {
  const source = '前😀 ΟΣ ΣΟ 后';
  assert.equal(foldTextWithOffsets(source).folded, '前😀 ος σο 后');
  assertHighlightSource(source, 'ΟΣ', 'ΟΣ');
  assertHighlightSource(source, 'ΣΟ', 'ΣΟ');
  assert.deepEqual(ids(search({ query: 'ΟΣ' }, [item({ id: 'greek', content: source })])), ['greek']);
});

test('NFKC ligature expansion maps full and partial matches back to one source character', () => {
  const source = '前😀 ﬃ notebook';
  assertHighlightSource(source, 'ffi', 'ﬃ');
  assertHighlightSource(source, 'fi', 'ﬃ');
  assertHighlightSource(source, 'notebook', 'notebook');
});

test('highlight offsets retain accent, sigma, and ligature behavior without Intl.Segmenter', () => {
  const original = Object.getOwnPropertyDescriptor(Intl, 'Segmenter');
  try {
    Object.defineProperty(Intl, 'Segmenter', { value: undefined, writable: true, configurable: true });
    assertHighlightSource('前😀 CAFE\u0301 后', 'café', 'CAFE\u0301');
    assertHighlightSource('前😀 ΟΣ 后', 'ΟΣ', 'ΟΣ');
    assertHighlightSource('前😀 ﬃ notebook', 'fi', 'ﬃ');
    assertHighlightSource('前😀 ﬃ notebook', 'notebook', 'notebook');
  } finally {
    if (original) Object.defineProperty(Intl, 'Segmenter', original);
    else delete Intl.Segmenter;
  }
});
