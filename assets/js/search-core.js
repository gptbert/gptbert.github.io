export function normalizeText(value) {
  return String(value ?? '').normalize('NFKC').toLowerCase().replace(/\s+/gu, ' ').trim();
}

export function tokenizeQuery(query) {
  return [...new Set(normalizeText(query).split(' ').filter(Boolean))];
}

// Preserve source offsets for highlights, including combining marks and ligatures.
// Lowercase the whole string so context-sensitive forms (such as final sigma) agree
// with the search matcher. Grapheme boundaries keep composed characters together.
export function foldTextWithOffsets(value) {
  const source = String(value ?? '');
  const folded = source.normalize('NFKC').toLowerCase();
  const offsets = [];
  if (typeof Intl.Segmenter === 'function') {
    const segments = new Intl.Segmenter(undefined, { granularity: 'grapheme' }).segment(source);
    for (const { segment, index } of segments) {
      const length = segment.normalize('NFKC').toLowerCase().length;
      for (let i = 0; i < length; i++) offsets.push([index, index + segment.length]);
    }
  } else {
    let cursor = 0;
    for (const character of source) {
      const start = cursor;
      cursor += character.length;
      const length = source.slice(0, cursor).normalize('NFKC').toLowerCase().length;
      if (length <= offsets.length) {
        offsets.length = length;
        if (length) offsets[length - 1][1] = cursor;
      }
      while (offsets.length < length) offsets.push([start, cursor]);
    }
  }
  return { folded, offsets };
}

// Query terms are literal substrings; Chinese does not depend on a word segmenter.
// Match before language selection so a translation-only match remains discoverable.
export function searchItems(items, { query = '', tag = '', type = 'all', lang = 'zh-CN' } = {}, tagDefinitions = []) {
  const terms = tokenizeQuery(query);
  const phrase = normalizeText(query);
  const definitions = new Map(tagDefinitions.map(entry => [entry.id, entry]));
  const matches = new Map();
  for (const item of items) {
    if (type !== 'all' && item.type !== type) continue;
    const tags = item.tags || [];
    if (tag && !tags.includes(tag)) continue;
    const title = normalizeText(item.title);
    const tagText = normalizeText(tags.map(id => {
      const definition = definitions.get(id);
      return [id, definition?.name, definition?.name_en].filter(Boolean).join(' ');
    }).join(' '));
    const description = normalizeText(item.description);
    const content = normalizeText(item.content);
    let score = 0;
    let matchesAll = true;
    for (const term of terms) {
      if (title.includes(term)) score += 100;
      else if (tagText.includes(term)) score += 70;
      else if (description.includes(term)) score += 35;
      else if (content.includes(term)) score += 10;
      else { matchesAll = false; break; }
    }
    if (!matchesAll) continue;
    if (phrase && title.includes(phrase)) score += 40;
    const positions = terms.map(term => content.indexOf(term)).filter(index => index >= 0);
    const result = { item, score, matchIndex: positions.length ? Math.min(...positions) : -1 };
    const key = `${item.type}:${item.id}`;
    const previous = matches.get(key);
    const preferred = item.lang === lang;
    const previousPreferred = previous?.item.lang === lang;
    if (!previous || (preferred && !previousPreferred) || (preferred === previousPreferred && score > previous.score)) {
      matches.set(key, result);
    }
  }
  return [...matches.values()].sort((a, b) => b.score - a.score);
}
