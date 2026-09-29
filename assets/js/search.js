import { normalizeText, tokenizeQuery, searchItems, foldTextWithOffsets } from './search-core.js';

const app = document.querySelector('[data-search-app]');
if (app) {
  const en = app.dataset.lang === 'en';
  const form = app.querySelector('form');
  const input = form.elements.q;
  const tagInput = form.elements.tag;
  const resultsElement = app.querySelector('[data-search-results]');
  const status = app.querySelector('[data-search-status]');
  const error = app.querySelector('[data-search-error]');
  const reset = app.querySelector('[data-search-reset]');
  const typeNames = en ? { post: 'Article', book: 'Book', project: 'Project' } : { post: '文章', book: '图书', project: '项目' };
  let index;
  let timer;

  function readURL() {
    const params = new URL(location.href).searchParams;
    input.value = (params.get('q') || '').slice(0, 200);
    form.elements.type.value = ['post', 'book', 'project'].includes(params.get('type')) ? params.get('type') : 'all';
    const tag = params.get('tag') || '';
    if (tag && ![...tagInput.options].some(option => option.value === tag)) {
      tagInput.add(new Option(en ? `Unknown tag: ${tag}` : `未知标签：${tag}`, tag));
    }
    tagInput.value = tag;
  }

  function writeURL(mode) {
    const url = new URL(location.href);
    for (const [key, value] of Object.entries({ q: input.value.trim(), tag: tagInput.value, type: form.elements.type.value })) {
      if (value && !(key === 'type' && value === 'all')) url.searchParams.set(key, value);
      else url.searchParams.delete(key);
    }
    if (url.href !== location.href) history[mode === 'push' ? 'pushState' : 'replaceState'](null, '', url);
    const alternate = document.querySelector('.lang-switch');
    if (alternate) {
      const target = new URL(alternate.href);
      target.search = url.search;
      alternate.href = target.href;
    }
  }

  function element(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  }

  function highlight(parent, text, terms) {
    const { folded, offsets } = foldTextWithOffsets(text);
    const ranges = [];
    for (const term of terms) {
      let cursor = 0;
      while (cursor < folded.length) {
        const at = folded.indexOf(term, cursor);
        if (at === -1) break;
        ranges.push([offsets[at][0], offsets[at + term.length - 1][1]]);
        cursor = at + term.length;
      }
    }
    ranges.sort((a, b) => a[0] - b[0]);
    const merged = [];
    for (const range of ranges) {
      const previous = merged[merged.length - 1];
      if (previous && range[0] <= previous[1]) previous[1] = Math.max(previous[1], range[1]);
      else merged.push(range);
    }
    let cursor = 0;
    for (const [start, end] of merged) {
      parent.append(document.createTextNode(text.slice(cursor, start)), element('mark', '', text.slice(start, end)));
      cursor = end;
    }
    parent.append(document.createTextNode(text.slice(cursor)));
  }

  function excerpt(item, terms, definitions) {
    const labels = (item.tags || []).map(id => {
      const tag = definitions.get(id);
      return [id, tag?.name, tag?.name_en].filter(Boolean).join(' ');
    }).join(' ');
    const summary = normalizeText(`${item.title} ${item.description} ${labels}`);
    if (item.description && terms.every(term => summary.includes(term))) return item.description.slice(0, 200);
    const content = String(item.content || item.description || '').replace(/\s+/gu, ' ').trim();
    const { folded, offsets } = foldTextWithOffsets(content);
    const positions = terms.map(term => folded.indexOf(term)).filter(position => position >= 0);
    if (!positions.length) return (item.description || content).slice(0, 200);
    const start = Math.max(0, offsets[Math.min(...positions)][0] - 55);
    const end = Math.min(content.length, start + 210);
    return `${start ? '…' : ''}${content.slice(start, end)}${end < content.length ? '…' : ''}`;
  }

  function render(mode = 'replace') {
    reset.hidden = !input.value && !tagInput.value && form.elements.type.value === 'all';
    writeURL(mode);
    if (!index) return;
    const query = input.value.trim();
    const terms = tokenizeQuery(query);
    const results = searchItems(index.items, { query, tag: tagInput.value, type: form.elements.type.value, lang: app.dataset.lang }, index.tags);
    const fragment = document.createDocumentFragment();
    const definitions = new Map(index.tags.map(tag => [tag.id, tag]));
    for (const { item } of results) {
      const card = element('article', 'search-result');
      const meta = element('div', 'post-meta');
      meta.append(element('span', '', typeNames[item.type]));
      if (item.lang !== app.dataset.lang) meta.append(element('span', 'language-badge', item.lang === 'en' ? 'English' : '中文'));
      const heading = element('h2');
      const link = element('a');
      const destination = new URL(item.url, location.href);
      if (!['http:', 'https:'].includes(destination.protocol)) continue;
      link.href = destination.href;
      link.hreflang = item.lang;
      link.lang = item.lang;
      highlight(link, item.title, terms);
      heading.append(link);
      const description = element('p', 'search-excerpt');
      highlight(description, excerpt(item, terms, definitions), terms);
      const tagList = element('div', 'tag-list');
      for (const id of item.tags || []) {
        const definition = definitions.get(id);
        const label = definition ? (en ? definition.name_en : definition.name) : id;
        const tagLink = element('a', 'tag-link', label);
        tagLink.href = `${app.dataset.tagsUrl}#${encodeURIComponent(id)}`;
        tagList.append(tagLink);
      }
      card.append(meta, heading, description, tagList);
      fragment.append(card);
    }
    if (!results.length) {
      const empty = element('div', 'search-empty');
      empty.append(element('h2', '', en ? 'No matches yet.' : '暂时没有匹配的内容。'), element('p', '', en ? 'Try a shorter keyword or remove a filter.' : '试试更短的关键词，或减少标签与类型限制。'));
      fragment.append(empty);
    }
    resultsElement.replaceChildren(fragment);
    status.textContent = en ? `${results.length} ${results.length === 1 ? 'result' : 'results'}${query ? ` for “${query}”` : ' across the site'}.` : `共找到 ${results.length} 项内容${query ? `，关键词「${query}」` : ''}。`;
  }

  async function load() {
    error.hidden = true;
    status.textContent = en ? 'Loading searchable content…' : '正在加载搜索内容…';
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 12000);
    try {
      const response = await fetch(app.dataset.index, { signal: controller.signal });
      if (!response.ok) throw new Error('Search index unavailable');
      const data = await response.json();
      if (data.version !== 1 || !Array.isArray(data.items) || !Array.isArray(data.tags)) throw new Error('Invalid search index');
      index = data;
      render();
    } catch {
      index = undefined;
      status.textContent = en ? 'Search is unavailable right now.' : '搜索暂时不可用。';
      error.hidden = false;
    } finally {
      clearTimeout(timeout);
    }
  }

  readURL();
  render();
  form.addEventListener('submit', event => { event.preventDefault(); clearTimeout(timer); render('push'); });
  input.addEventListener('input', () => { clearTimeout(timer); timer = setTimeout(() => render(), 150); });
  form.addEventListener('change', event => { if (event.target !== input) { clearTimeout(timer); render('push'); } });
  reset.addEventListener('click', () => { clearTimeout(timer); form.reset(); tagInput.value = ''; render('push'); input.focus(); });
  app.querySelector('[data-search-retry]').addEventListener('click', load);
  window.addEventListener('popstate', () => { clearTimeout(timer); readURL(); render(); });
  load();
}
