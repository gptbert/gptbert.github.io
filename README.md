# gptbert

个人博客与公开项目页面。主站：[gptbert.com](https://gptbert.com/)；GitHub Pages 镜像：[gptbert.github.io](https://gptbert.github.io/)。

## 发布文章

在 `_posts/` 新建 `YYYY-MM-DD-slug.md`，添加标题、简介和日期：

```markdown
---
title: "文章标题"
description: "一句话简介"
date: 2026-09-29 12:00:00 +0800
lang: zh-CN
tags: [python, ai]
search_id: article-slug
alternate_url: /en/posts/2026/09/29/slug/
---

文章正文。
```

创建 Pull Request 后先查看 Cloudflare Pages 预览；合并到 `main` 后，Cloudflare Pages 与 GitHub Pages 会各自自动构建。

文章默认显示 GitHub Discussions 评论区。新文章使用其固定路径自动对应一个讨论；如需关闭某篇文章的评论，在文章 front matter 中设置 `comments: false`。如已创建讨论，可设置 `discussion_url`，为读者提供直接打开 GitHub 讨论的链接。嵌入评论使用 Giscus，仓库需启用 Discussions，并将 Giscus GitHub App 安装到此仓库。

中文版是默认站点（`/`），英文版位于 `/en/`。如果文章提供英文版，请另建一篇 `lang: en` 的文章，设置 `/en/posts/.../` 的 `permalink` 和指回中文版的 `alternate_url`。两个 RSS 分别位于 `/feed.xml` 和 `/en/feed.xml`。页面文案在 `_data/ui.yml` 中维护。

同一篇文章的中英文版本使用相同的 `search_id`，搜索和标签索引会优先显示当前语言并去重；没有译文时会回退到原文。不同文章的 `search_id` 必须唯一；单语言文章可省略该字段。

## 添加翻译图书

博客文章、首页介绍及其他非图书页面的文字遵守用户指定的人名排除规则，具体规则见 `AGENTS.md`。图片和图书页面内容保留；图书目录对应的搜索条目也保留书目信息。

发布前运行 `node --test tests/content-policy.test.mjs`。构建后设置 `CONTENT_SITE_DIR` 为输出目录，再运行同一命令，检查非图书公开文字内容。GitHub 会检查每次 PR 和正式部署。

在 `_data/translated_books.yml` 为每本书添加一项。`title`、`status`、`credit`、`publisher_url` 应按可靠书目信息填写；英文展示另填 `title_en`、`status_en`、`description_en` 和 `credit_en`。非图灵图书可设置 `publisher_label` 和 `publisher_label_en`。没有公开译文时，省略 `read_url`。封面图片保存在 `assets/books/`，通过 `cover` 引用；如果展示原书封面，设置 `cover_note` 和 `cover_note_en` 明确标注。只添加已获准公开使用的封面图片。

当前封面来源：图灵图书详情（八本翻译图书及一本审校书）、[《Python访谈录》书目](https://book.douban.com/subject/34759902/)；《Python数据分析》和《asyncio实例集锦》的中文版封面由译者提供。封面仅用于介绍对应图书。

参与审校的图书单独维护在 `_data/reviewed_books.yml`，不计入翻译图书数量。

图书还需填写唯一、稳定的 `id` 和 `tags`（例如 `id: python-data-science-handbook-2`、`tags: [python, data-science]`）。`id` 用于搜索结果和书目锚点，图书重新排序时应保持不变；旧 `book-N` 锚点目前仍保留。

## 标签与全文搜索

标签定义统一维护在 `_data/tags.yml`，键为稳定的英文标识，`name` / `name_en` 分别为中英文名称。文章 front matter、两份图书数据和 `_data/projects.yml` 的 `tags` 数组引用这些标识。新增标签时先补充定义，再引用；同一内容可以有多个标签。

项目在 `_data/projects.yml` 中维护 `id`、`title`、`description`、`description_en`、`url` 和 `tags`，首页、项目列表与搜索索引共用这些数据。可选的 `url_en` 用于英文版专属入口，未填写时沿用 `url`。项目 `id` 应保持稳定，项目链接锚点为 `project-<id>`。

每次 Jekyll 构建会自动生成 `/search-index.json`、中英文 `/tags/` 和 `/search/` 页面，无需独立索引服务。标签目录为静态 HTML，不依赖 JavaScript；搜索在浏览器内完成，查询内容不发送到第三方服务。

搜索覆盖文章完整正文、图书简介/原书名/作者/译者/ISBN，以及项目说明；不包含图书全文。中英文记录共同检索并按内容去重，支持 NFKC 归一化、大小写无关匹配、空格分隔的多关键词 AND 查询，以及标签与类型组合筛选。地址中的 `q`、`tag`、`type` 参数可分享，切换语言时保留当前查询。

核心搜索回归检查：`node --test tests/search-core.test.mjs`。测试目录与 Node 模块配置不进入发布站点。

## 站点结构

- `index.html`、`en/index.html`：中英文首页入口
- `_includes/home.html`、`_data/home.yml`：共用首页结构与双语文案
- `assets/css/site.css`：全站视觉、响应式布局与跟随系统的深色模式
- `posts/` 与 `_posts/`：文章列表和 Markdown 文章
- `books/`、`_data/translated_books.yml`：翻译图书目录与书目数据
- `en/`：英文页面与英文 RSS
- `projects/`、`about/`：项目与关于
- `_data/projects.yml`、`_data/tags.yml`：项目与双语标签数据
- `search/`、`en/search/`、`assets/js/`、`search-index.json`：全文搜索页面、搜索逻辑与构建索引
- `tags/`、`en/tags/`：静态标签索引
- `feed.xml`、`sitemap.xml`：RSS 和站点地图
- `privacy.html`、`support.html`：原有 App Store 审核页面，路径保持不变
- `en/privacy.html`、`en/support.html`：上述页面的英文版本

原有页面地址仍可用：[隐私政策](https://gptbert.github.io/privacy.html) · [技术支持](https://gptbert.github.io/support.html)。

## 内容知识图谱

`/graph/` 和 `/en/graph/` 从搜索索引生成交互图谱，内容节点与主题节点之间的边仅表示已有标签归属。中英文版本按稳定 ID 去重，优先当前语言；新增内容及标签后自动更新，无需数据库或第三方图谱服务。支持标题/简介/主题搜索、类型与主题筛选、键盘选择节点，以及等价内容列表。标签目录为不依赖 JavaScript 的备用入口。

图谱不自动推断引用、因果或先修关系。图谱逻辑位于 `assets/js/graph-core.js`，页面位于 `graph/` 与 `en/graph/`，样式独立维护在 `assets/css/graph.css`。验证：`node --test tests/graph-core.test.mjs`。

每次文章合并到 `main` 后，Cloudflare Pages 与 GitHub Pages 都会重新构建索引。图谱读取最新索引，无需另行维护节点或运行定时任务。新文章填写 `tags` 即可自动生成主题关联；没有标签的文章仍显示为独立节点。双语文章共用 `search_id`，新增标签先在 `_data/tags.yml` 中补齐中英文名称。
