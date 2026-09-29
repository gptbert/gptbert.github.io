---
title: "这里开始：用 GitHub 和 Cloudflare 发布博客"
description: "第一篇站点笔记：内容放在 GitHub，主站通过 Cloudflare Pages 发布。"
date: 2026-09-29 12:00:00 +0800
lang: zh-CN
alternate_url: /en/posts/2026/09/29/hello-world/
---

这个博客从一个很小的站点开始。原有的页面用于展示[隐私政策](/privacy.html)和[技术支持](/support.html)；现在，首页和文章也有了自己的位置。

## 发布方式

文章以 Markdown 文件保存在 [GitHub 仓库](https://github.com/gptbert/gptbert.github.io)中。新文章放进 `_posts` 目录，文件名使用 `年-月-日-标题.md`。站点由 Jekyll 构建，合并到 `main` 后会自动发布到 `gptbert.com`；GitHub Pages 继续提供原有的 `gptbert.github.io` 地址。

Cloudflare Pages 会为仓库内的 Pull Request 提供预览地址。这样可以先检查排版和链接，再更新正式站点。

## 接下来

我会在这里记录软件实践、工具探索和学习笔记。文章会尽量写清楚问题、过程与验证结果，而不只留下结论。

你可以从[文章列表](/posts/)继续阅读，也可以订阅 [RSS](/feed.xml)。
