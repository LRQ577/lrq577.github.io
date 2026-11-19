#!/usr/bin/env node
/*
 * 抓取 GitHub 仓库列表，生成博客「项目」页使用的快照。
 * 用法：node tools/fetch-projects.js
 * 可选：GITHUB_TOKEN=xxx（提高 API 限额）
 */
"use strict";

const https = require("https");
const fs = require("fs");
const path = require("path");

const USER = "LRQ577";
const OUT = path.join(__dirname, "..", "source", "_data", "projects.json");

function get(url, headers, redirects = 0) {
  return new Promise((resolve, reject) => {
    const req = https.get(url, { headers }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location && redirects < 3) {
        res.resume();
        return get(res.headers.location, headers, redirects + 1).then(resolve, reject);
      }
      let body = "";
      res.setEncoding("utf8");
      res.on("data", (chunk) => (body += chunk));
      res.on("end", () => {
        if (res.statusCode !== 200) {
          return reject(new Error(`HTTP ${res.statusCode}: ${body.slice(0, 160)}`));
        }
        try {
          resolve(JSON.parse(body));
        } catch (err) {
          reject(err);
        }
      });
    });
    req.on("error", reject);
    req.setTimeout(15000, () => req.destroy(new Error("request timeout")));
  });
}

(async () => {
  const headers = {
    "User-Agent": "lrq577-blog-projects",
    Accept: "application/vnd.github+json",
  };
  if (process.env.GITHUB_TOKEN) {
    headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  }

  const repos = await get(
    `https://api.github.com/users/${USER}/repos?per_page=100&sort=updated&type=owner`,
    headers
  );

  const list = repos
    .filter((repo) => !repo.private && repo.name !== `${USER.toLowerCase()}.github.io`)
    .map((repo) => ({
      name: repo.name,
      description: repo.description || "",
      url: repo.html_url,
      homepage: repo.homepage || "",
      language: repo.language || "",
      stars: repo.stargazers_count || 0,
      forks: repo.forks_count || 0,
      updated: repo.pushed_at || repo.updated_at || "",
      fork: Boolean(repo.fork),
      archived: Boolean(repo.archived),
      topics: Array.isArray(repo.topics) ? repo.topics : [],
    }))
    .sort((a, b) => b.stars - a.stars || String(b.updated).localeCompare(String(a.updated)));

  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, JSON.stringify(list, null, 2) + "\n", "utf8");
  console.log(`fetched ${list.length} repos -> ${path.relative(process.cwd(), OUT)}`);
})().catch((err) => {
  console.error("fetch failed:", err.message);
  process.exit(1);
});
