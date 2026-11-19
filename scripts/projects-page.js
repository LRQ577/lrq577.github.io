/*
 * 生成「项目」页：读取 source/_data/projects.json，渲染成仓库卡片。
 * 快照由 tools/fetch-projects.js 生成。
 */
"use strict";

const fs = require("fs");
const path = require("path");

const USER = "LRQ577";
const LANG_COLORS = {
  Python: "#3572A5",
  JavaScript: "#f1e05a",
  TypeScript: "#3178c6",
  HTML: "#e34c26",
  CSS: "#563d7c",
  Stylus: "#ff6347",
  Shell: "#89e051",
  "Batchfile": "#C1F12E",
  "C++": "#f34b7d",
  C: "#555555",
  Java: "#b07219",
  Rust: "#dea584",
  Go: "#00ADD8",
  Vue: "#41b883",
  Jupyter: "#DA5B0B",
  MATLAB: "#e16737",
};

function esc(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function formatDate(value) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  const pad = (n) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

function renderCard(repo) {
  const badges = [];
  if (repo.fork) badges.push('<span class="repo-badge">fork</span>');
  if (repo.archived) badges.push('<span class="repo-badge repo-badge-muted">archived</span>');

  const topics = (repo.topics || [])
    .slice(0, 4)
    .map((topic) => `<span class="repo-topic">${esc(topic)}</span>`)
    .join("");

  const lang = repo.language
    ? `<span class="repo-lang"><i style="background:${
        LANG_COLORS[repo.language] || "#8b949e"
      }"></i>${esc(repo.language)}</span>`
    : "";

  const stars = repo.stars > 0 ? `<span>★ ${repo.stars}</span>` : "";
  const forks = repo.forks > 0 ? `<span>⑂ ${repo.forks}</span>` : "";
  const updated = repo.updated ? `<span>更新于 ${formatDate(repo.updated)}</span>` : "";

  return `
    <a class="repo-card" href="${esc(repo.url)}" target="_blank" rel="noopener">
      <div class="repo-head">
        <span class="repo-name">${esc(repo.name)}</span>
        ${badges.join("")}
      </div>
      <p class="repo-desc">${esc(repo.description || "暂无描述")}</p>
      ${topics ? `<div class="repo-topics">${topics}</div>` : ""}
      <div class="repo-meta">${lang}${stars}${forks}${updated}</div>
    </a>`;
}

const STYLE = `
<style>
.projects-toolbar{display:flex;align-items:center;justify-content:space-between;gap:12px;margin:0 0 6px;flex-wrap:wrap}
.projects-count{color:var(--font-color-light-2);font-size:.9rem}
.projects-link{font-size:.9rem}
.repo-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(290px,1fr));gap:18px;margin:18px 0 8px}
.markdown .repo-card{display:flex;flex-direction:column;gap:10px;padding:20px;border:1px solid var(--card-border-color);border-radius:16px;background:var(--background-color-grey-light-1,#fff);box-shadow:var(--meow-card-shadow);text-decoration:none;color:inherit;transition:transform .18s ease,border-color .18s ease,box-shadow .18s ease}
.markdown .repo-card:hover{transform:translateY(-3px);border-color:var(--theme-color);text-decoration:none}
.repo-head{display:flex;align-items:center;gap:8px;flex-wrap:wrap;font-weight:650;font-size:1.05rem;color:var(--font-color)}
.repo-name{word-break:break-word}
.repo-badge{font-size:.68rem;font-weight:500;padding:1px 7px;border-radius:999px;border:1px solid var(--card-border-color);color:var(--font-color-light-2)}
.repo-badge-muted{opacity:.7}
.repo-desc{flex:1;margin:0;min-height:2.8em;font-size:.92rem;line-height:1.65;color:var(--font-color-light-2)}
.repo-topics{display:flex;flex-wrap:wrap;gap:6px}
.repo-topic{font-size:.74rem;padding:2px 8px;border-radius:999px;background:var(--background-color-grey);color:var(--font-color-light-1)}
.repo-meta{display:flex;flex-wrap:wrap;align-items:center;gap:14px;font-size:.82rem;color:var(--font-color-light-2)}
.repo-lang{display:inline-flex;align-items:center;gap:6px}
.repo-lang i{width:10px;height:10px;border-radius:50%;display:inline-block}
@media (max-width:600px){.repo-grid{grid-template-columns:1fr}}
</style>
`;

hexo.extend.generator.register("projects", function () {
  let repos = [];
  const file = path.join(hexo.base_dir, "source", "_data", "projects.json");
  try {
    repos = JSON.parse(fs.readFileSync(file, "utf8"));
  } catch (err) {
    this.log.warn(`[projects] 无法读取 ${file}：${err.message}`);
  }

  const cards = repos.map(renderCard).join("");

  const content = `${STYLE}
<div class="projects-toolbar">
  <span class="projects-count">共 ${repos.length} 个仓库</span>
  <a class="projects-link" href="https://github.com/${USER}?tab=repositories" target="_blank" rel="noopener">在 GitHub 查看全部 →</a>
</div>
<div class="repo-grid">${cards}</div>
`;

  return {
    path: "projects/index.html",
    layout: ["page"],
    data: {
      title: "项目",
      content,
      type: "projects",
    },
  };
});
