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
alternate_url: /en/posts/2026/09/29/slug/
---

文章正文。
```

创建 Pull Request 后先查看 Cloudflare Pages 预览；合并到 `main` 后，Cloudflare Pages 与 GitHub Pages 会各自自动构建。

中文版是默认站点（`/`），英文版位于 `/en/`。如果文章提供英文版，请另建一篇 `lang: en` 的文章，设置 `/en/posts/.../` 的 `permalink` 和指回中文版的 `alternate_url`。两个 RSS 分别位于 `/feed.xml` 和 `/en/feed.xml`。页面文案在 `_data/ui.yml` 中维护。

## 站点结构

- `index.html`：首页
- `posts/` 与 `_posts/`：文章列表和 Markdown 文章
- `projects/`、`about/`：项目与关于
- `en/`：英文页面与英文 RSS
- `feed.xml`、`sitemap.xml`：RSS 和站点地图
- `privacy.html`、`support.html`：原有 App Store 审核页面，路径保持不变

原有页面地址仍可用：[隐私政策](https://gptbert.github.io/privacy.html) · [技术支持](https://gptbert.github.io/support.html)。
