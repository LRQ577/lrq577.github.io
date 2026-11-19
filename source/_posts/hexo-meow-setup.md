---
title: 用 Hexo + Meow 搭一个 GitHub Pages 博客
date: 2026-11-19 21:00:00
categories:
  - 折腾
tags:
  - Hexo
  - Meow
  - GitHub Pages
---

记录一下本站的搭建过程，方便以后重装或者帮朋友搭站。

## 需要的东西

- Node.js 18 以上
- Git
- 一个 GitHub 账号

## 初始化 Hexo

```bash
npx hexo-cli init my-blog
cd my-blog
```

## 装上 Meow 主题

```bash
git clone -b main https://github.com/chanwj/hexo-theme-meow.git themes/meow
rm -rf themes/meow/.git
npm install hexo-renderer-pug hexo-renderer-stylus --save
```

然后在 `_config.yml` 里把主题换成 `meow`：

```yaml
theme: meow
```

## 本地预览

```bash
npx hexo server
```

打开 `http://localhost:4000` 就能看到效果，改完文件会自动刷新。

## 写文章

```bash
npx hexo new "文章标题"
```

生成的 Markdown 文件在 `source/_posts/` 下，用 Front-matter 指定分类和标签：

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

## 自动部署

把源码推到 `main` 分支，GitHub Actions 会构建并发布到 Pages。
站点地址就是 `https://<用户名>.github.io`，只需要在仓库的
**Settings → Pages** 里把 Source 选成 **GitHub Actions** 一次。
