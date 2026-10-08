// Only explicit content tags create edges; translations share one identity.
export function buildGraph(index, { lang = 'zh-CN', query = '', type = 'all', topic = '' } = {}) {
  const definitions = new Map(index.tags.map(tag => [tag.id, tag]));
  const records = new Map();
  for (const item of index.items) {
    const previous = records.get(item.id);
    if (!previous || (item.lang === lang && previous.lang !== lang)) records.set(item.id, item);
  }
  const fold = value => String(value ?? '').normalize('NFKC').toLowerCase();
  const terms = fold(query).trim().split(/\s+/u).filter(Boolean);
  const items = [...records.values()].filter(item => {
    if (type !== 'all' && item.type !== type) return false;
    if (topic && !(item.tags || []).includes(topic)) return false;
    const text = fold([item.title, item.description, ...(item.tags || []).map(id => {
      const tag = definitions.get(id);
      return `${id} ${tag?.name || ''} ${tag?.name_en || ''}`;
    })].join(' '));
    return terms.every(term => text.includes(term));
  }).sort((a, b) => a.title.localeCompare(b.title, lang));
  const topics = index.tags.filter(tag => items.some(item => (item.tags || []).includes(tag.id)));
  const topicIds = new Set(topics.map(tag => tag.id));
  const edges = items.flatMap(item => [...new Set(item.tags || [])].filter(id => topicIds.has(id))
    .map(id => ({ source: `topic:${id}`, target: item.id })));
  return { items, topics, edges };
}
