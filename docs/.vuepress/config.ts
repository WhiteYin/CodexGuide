import { existsSync, readFileSync, writeFileSync } from "node:fs";

import { viteBundler } from "@vuepress/bundler-vite";
import { defineUserConfig } from "vuepress";

import { getPageDescription, siteDescription, siteUrl, toSiteUrl } from "./seo.js";
import theme from "./theme.js";

const rewriteSitemapCleanUrlsPlugin = {
  name: "bluecamp-clean-sitemap-urls",
  onGenerated: (app) => {
    const sitemapPath = app.dir.dest("sitemap.xml");

    if (!existsSync(sitemapPath)) return;

    const sitemap = readFileSync(sitemapPath, "utf-8");
    const escapedSiteUrl = siteUrl.replace(/[.*+?^${}()|[\]\\]/gu, "\\$&");
    const locationPattern = new RegExp(`<loc>(${escapedSiteUrl}[^<]*)<\\/loc>`, "gu");
    const cleanedSitemap = sitemap.replace(
      locationPattern,
      (_, url: string) => {
        const { pathname, search, hash } = new URL(url);

        return `<loc>${toSiteUrl(`${pathname}${search}${hash}`)}</loc>`;
      },
    );

    writeFileSync(sitemapPath, cleanedSitemap);
  },
};

export default defineUserConfig({
  base: "/",
  dest: "docs/.vuepress/dist",
  lang: "zh-CN",
  title: "大蓝营",
  description: siteDescription,

  head: [
    ["meta", { name: "robots", content: "index,follow,max-image-preview:large" }],
    ["meta", { name: "author", content: "BlueCamp" }],
    [
      "meta",
      {
        name: "keywords",
        content:
          "大蓝营,Codex 教程,Codex教程,OpenAI Codex 中文教程,Codex 使用教程,Codex CLI 教程,Codex 桌面 App,AGENTS.md,AI 编程,AI Agent,工作流,实战指南",
      },
    ],
    ["meta", { name: "theme-color", content: "#2563eb" }],
    ["meta", { name: "format-detection", content: "telephone=no" }],
    ["link", { rel: "icon", href: "/bluecamp-logo.svg", type: "image/svg+xml" }],
  ],

  plugins: [
    {
      name: "bluecamp-seo-defaults",
      extendsPage: (page) => {
        page.frontmatter.description = getPageDescription(page.path);
      },
      onInitialized: (app) => {
        // Git 插件执行完后固定日期，后续提交不会改写展示时间。
        for (const page of app.pages) {
          const { date, updated } = page.frontmatter;
          if (date && updated) {
            page.data.git = {
              createdTime: new Date(date).getTime(),
              updatedTime: new Date(updated).getTime(),
              contributors: [],
            };
          }
        }
      },
    },
    rewriteSitemapCleanUrlsPlugin,
  ],

  bundler: viteBundler(),

  theme,

  pagePatterns: ["**/*.md", "!.vuepress", "!node_modules"],

  shouldPrefetch: false,
  shouldPreload: false,
});
