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

## 添加译书

在 `_data/translated_books.yml` 为每本书添加一项。`title`、`status`、`credit`、`publisher_url` 应按可靠书目信息填写；英文展示另填 `title_en`、`status_en`、`description_en` 和 `credit_en`。非图灵图书可设置 `publisher_label` 和 `publisher_label_en`。没有公开译文时，省略 `read_url`。封面图片保存在 `assets/books/`，通过 `cover` 引用；如果展示原书封面，设置 `cover_note` 和 `cover_note_en` 明确标注。只添加已获准公开使用的封面图片。

当前封面来源：图灵图书详情（八本译书及一本审校书）、[《Python访谈录》书目](https://book.douban.com/subject/34759902/)、[《Python数据分析》原书](https://www.packtpub.com/en-us/product/data-analysis-with-python-9781789950069?type=print)和[《asyncio实例集锦》原书](https://link.springer.com/book/10.1007/978-1-4842-4401-2)。封面仅用于介绍对应图书。

参与审校的图书单独维护在 `_data/reviewed_books.yml`，不计入译书数量。

## 站点结构

- `index.html`：首页
- `posts/` 与 `_posts/`：文章列表和 Markdown 文章
- `books/`、`_data/translated_books.yml`：译书目录与书目数据
- `en/`：英文页面与英文 RSS
- `projects/`、`about/`：项目与关于
- `en/`：英文页面与英文 RSS
- `feed.xml`、`sitemap.xml`：RSS 和站点地图
- `privacy.html`、`support.html`：原有 App Store 审核页面，路径保持不变
- `en/privacy.html`、`en/support.html`：上述页面的英文版本

原有页面地址仍可用：[隐私政策](https://gptbert.github.io/privacy.html) · [技术支持](https://gptbert.github.io/support.html)。
