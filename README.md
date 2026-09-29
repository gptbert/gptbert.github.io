# gptbert

个人博客与公开项目页面。主站：[gptbert.com](https://gptbert.com/)；GitHub Pages 镜像：[gptbert.github.io](https://gptbert.github.io/)。

## 发布文章

在 `_posts/` 新建 `YYYY-MM-DD-slug.md`，添加标题、简介和日期：

```markdown
---
title: "文章标题"
description: "一句话简介"
date: 2026-09-29 12:00:00 +0800
---

文章正文。
```

创建 Pull Request 后先查看 Cloudflare Pages 预览；合并到 `main` 后，Cloudflare Pages 与 GitHub Pages 会各自自动构建。

## 站点结构

- `index.html`：首页
- `posts/` 与 `_posts/`：文章列表和 Markdown 文章
- `projects/`、`about/`：项目与关于
- `feed.xml`、`sitemap.xml`：RSS 和站点地图
- `privacy.html`、`support.html`：原有 App Store 审核页面，路径保持不变

原有页面地址仍可用：[隐私政策](https://gptbert.github.io/privacy.html) · [技术支持](https://gptbert.github.io/support.html)。
