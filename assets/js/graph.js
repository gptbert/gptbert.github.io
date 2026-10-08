import { buildGraph } from './graph-core.js';

const app = document.querySelector('.knowledge-graph');
const en = app.dataset.lang === 'en';
const words = en ? { topic: 'Topic', post: 'Article', book: 'Book', project: 'Project', open: 'Read / open →', connected: 'Connected content', topics: 'Assigned topics', empty: 'No matching content. Try another topic or reset the filters.', error: 'Connections could not load. Reload this page or browse the topic index below.', choose: 'Explore a connection', hint: 'Select a node to see its direct connections. You can also browse the content list below.' } : { topic: '主题', post: '文章', book: '图书', project: '项目', open: '阅读 / 查看 →', connected: '关联内容', topics: '所属主题', empty: '没有匹配内容，请尝试其他主题或重置筛选。', error: '图谱暂时无法加载，请刷新页面或浏览下方标签索引。', choose: '从一个节点开始', hint: '点击节点查看直接关联，也可以使用下方内容列表浏览。' };
const form = app.querySelector('form');
const svg = app.querySelector('svg');
const panel = app.querySelector('.graph-details');
const list = app.querySelector('.graph-content-list');
const status = app.querySelector('.graph-status');
const NS = 'http://www.w3.org/2000/svg';
let index, graph, selected = '', nodes = [], lines = [];
const element = (tag, text, className) => {
  const node = document.createElement(tag);
  if (text !== undefined) node.textContent = text;
  if (className) node.className = className;
  return node;
};
const shape = (tag, attributes) => {
  const node = document.createElementNS(NS, tag);
  for (const [key, value] of Object.entries(attributes)) node.setAttribute(key, value);
  return node;
};
const topicName = topic => en ? topic.name_en || topic.name : topic.name;
function contentLink(item) {
  const a = element('a', item.title);
  a.href = item.url;
  a.lang = item.lang;
  if (item.lang !== app.dataset.lang) a.append(element('span', item.lang === 'en' ? ' · English' : ' · 中文', 'language-badge'));
  return a;
}
function choose(id) {
  selected = id;
  const topic = graph.topics.find(entry => `topic:${entry.id}` === id);
  const item = graph.items.find(entry => entry.id === id);
  panel.replaceChildren();
  const active = new Set([id]);
  for (const edge of graph.edges) {
    if (edge.source === id || edge.target === id) {
      active.add(edge.source); active.add(edge.target);
    }
  }
  for (const { node, id: nodeId } of nodes) {
    node.classList.toggle('is-selected', nodeId === id);
    node.classList.toggle('is-muted', !!id && !active.has(nodeId));
    node.setAttribute('aria-pressed', String(nodeId === id));
  }
  for (const { node, edge } of lines) {
    node.classList.toggle('is-active', edge.source === id || edge.target === id);
    node.classList.toggle('is-muted', !!id && edge.source !== id && edge.target !== id);
  }
  if (!topic && !item) {
    panel.append(element('h2', words.choose), element('p', words.hint));
    return;
  }
  panel.append(element('p', words[topic ? 'topic' : item.type], 'eyebrow'), element('h2', topic ? topicName(topic) : item.title));
  if (item) {
    // Keep book credits and full descriptions on the book pages.
    if (item.type !== 'book') panel.append(element('p', item.description));
    const a = contentLink(item); a.textContent = words.open; a.className = 'graph-open';
    panel.append(a);
  }
  panel.append(element('h3', topic ? words.connected : words.topics));
  const related = element('ul');
  if (topic) {
    for (const record of graph.items.filter(entry => entry.tags?.includes(topic.id))) {
      const li = element('li');
      li.append(element('span', words[record.type], 'graph-kind'), contentLink(record)); related.append(li);
    }
  } else {
    for (const tag of graph.topics.filter(entry => item.tags?.includes(entry.id))) {
      const li = element('li'), button = element('button', topicName(tag));
      button.type = 'button'; button.addEventListener('click', () => choose(`topic:${tag.id}`));
      li.append(button); related.append(li);
    }
  }
  panel.append(related);
}
function render() {
  graph = buildGraph(index, { lang: app.dataset.lang, query: form.elements.query.value, type: form.elements.type.value, topic: form.elements.topic.value });
  const { items, topics, edges } = graph;
  status.textContent = items.length ? (en ? `${items.length} items · ${topics.length} topics · ${edges.length} connections` : `${items.length} 项内容 · ${topics.length} 个主题 · ${edges.length} 条关联`) : words.empty;
  svg.replaceChildren(); list.replaceChildren(); nodes = []; lines = [];
  const points = new Map();
  const place = (records, radius, isTopic) => records.forEach((record, i) => {
    const angle = 2 * Math.PI * i / records.length - Math.PI / 2;
    points.set(isTopic ? `topic:${record.id}` : record.id, { x: 450 + radius * Math.cos(angle), y: 370 + radius * Math.sin(angle) });
  });
  place(topics, 168, true); place(items, 305, false);
  for (const edge of edges) {
    const source = points.get(edge.source), target = points.get(edge.target);
    const node = shape('line', { x1: source.x, y1: source.y, x2: target.x, y2: target.y, class: 'graph-edge' });
    lines.push({ node, edge }); svg.append(node);
  }
  for (const record of [...topics.map(tag => ({ ...tag, type: 'topic', nodeId: `topic:${tag.id}`, label: topicName(tag) })), ...items.map(item => ({ ...item, nodeId: item.id, label: item.title }))]) {
    const point = points.get(record.nodeId);
    const node = shape('g', { transform: `translate(${point.x} ${point.y})`, tabindex: '0', role: 'button', 'aria-label': `${words[record.type]}: ${record.label}`, class: `graph-node ${record.type}` });
    const title = shape('title', {}); title.textContent = record.label;
    const label = shape('text', { y: 28, 'text-anchor': 'middle' });
    const chars = [...record.label]; label.textContent = chars.length > 14 ? chars.slice(0, 13).join('') + '…' : record.label;
    node.append(title, shape('circle', { r: record.type === 'topic' ? 13 : 9 }), label);
    node.addEventListener('click', () => choose(record.nodeId));
    node.addEventListener('keydown', event => {
      if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); choose(record.nodeId); }
    });
    nodes.push({ node, id: record.nodeId }); svg.append(node);
  }
  for (const item of items) {
    const li = element('li'), explore = element('button', en ? 'Connections' : '查看关联');
    explore.type = 'button'; explore.setAttribute('aria-label', `${explore.textContent}: ${item.title}`);
    explore.addEventListener('click', () => choose(item.id));
    li.append(element('span', words[item.type], 'graph-kind'), contentLink(item), explore); list.append(li);
  }
  if (!nodes.some(node => node.id === selected)) selected = '';
  choose(selected);
}
form.addEventListener('submit', event => event.preventDefault());
form.addEventListener('input', () => { if (index) render(); });
form.addEventListener('reset', () => { selected = ''; setTimeout(() => { if (index) render(); }, 0); });
try {
  const response = await fetch(app.dataset.index, { cache: 'no-cache' });
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  index = await response.json();
  for (const topic of index.tags) {
    const option = element('option', topicName(topic)); option.value = topic.id; form.elements.topic.append(option);
  }
  render();
} catch {
  status.textContent = words.error;
  for (const control of form.elements) control.disabled = true;
}
