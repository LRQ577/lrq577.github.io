# LRQ577's Blog

个人博客源码，基于 [Hexo](https://hexo.io/) + [Meow](https://github.com/chanwj/hexo-theme-meow) 主题，
通过 GitHub Actions 自动构建并发布到 GitHub Pages。

线上地址：<https://lrq577.github.io>

## 本地开发

```bash
npm install          # 首次安装依赖
npm run server       # 本地预览 http://localhost:4000
npm run build        # 构建到 public/
```

## 写文章

```bash
npx hexo new "文章标题"
```

生成的 Markdown 在 `source/_posts/` 下，Front-matter 示例：

```yaml
---
title: 文章标题
date: 2026-11-19 21:00:00
categories:
  - 折腾
tags:
  - Hexo
---
```

## 发布

推送到 `main` 分支即可，`.github/workflows/pages.yml` 会自动构建并部署。

## 目录说明

- `_config.yml`：站点配置（标题、作者、URL 等）
- `themes/meow/_config.yml`：主题配置（菜单、颜色、Banner、侧边栏等）
- `source/_posts/`：文章
- `source/about/`、`source/categories/`、`source/tags/`：独立页面
