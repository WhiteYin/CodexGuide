import { hopeTheme } from "vuepress-theme-hope";

import navbar from "./navbar.js";
import { getPageDescription, siteOgImage, siteUrl, toSiteUrl } from "./seo.js";
import sidebar from "./sidebar/index.js";

const addMeta = (
  head: unknown[][],
  attribute: "name" | "property",
  name: string,
  content: string,
): void => {
  if (head.some(([tag, attrs]) => tag === "meta" && attrs?.[attribute] === name)) return;
  head.push(["meta", { [attribute]: name, content }]);
};

const isHomePage = (path: string): boolean => path === "/" || path === "/index.html";

export default hopeTheme({
  hostname: `${siteUrl}/`,
  logo: "/bluecamp-logo.svg",
  favicon: "/bluecamp-logo.svg",

  author: {
    name: "大蓝营",
  },

  repoDisplay: false,
  editLink: false,
  contributors: false,
  lastUpdated: true,
  navbarLayout: { start: ["Brand"], center: ["Links"], end: ["Outlook", "Search"] },

  navbar,
  sidebar,

  print: false,
  pure: true,
  focus: false,
  breadcrumb: true,
  displayFooter: true,
  footer: "大蓝营 · BlueCamp · Codex 中文教程与实战指南",
  pageInfo: ["Author", "Category", "Tag", "Date", "Original", "Word", "ReadingTime"],

  blog: false,

  markdown: {
    align: true,
    attrs: true,
    codeTabs: true,
    component: true,
    gfm: true,
    mark: true,
    tasklist: true,
    tabs: true,
  },

  plugins: {
    copyCode: true,
    copyright: {
      author: "大蓝营 / BlueCamp",
      license: "MIT",
      triggerLength: 100,
      maxLength: 700,
      canonical: `${siteUrl}/`,
      global: true,
    },
    feed: false,
    catalog: false,
    git: { createdTime: false, updatedTime: false, contributors: false, changelog: false },
    seo: {
      fallBackImage: siteOgImage,
      canonical: (page) => toSiteUrl(page.path),
      ogp: (ogp, page) => ({
        ...ogp,
        "og:description": getPageDescription(page.path),
        "og:image": page.frontmatter.cover || page.frontmatter.banner ? ogp["og:image"] : siteOgImage,
        "og:image:alt": `${page.title} - 大蓝营`,
        "og:locale": "zh_CN",
      }),
      jsonLd: (jsonLD, page) =>
        isHomePage(page.path)
          ? {
              "@context": "https://schema.org",
              "@graph": [
                {
                  "@type": "Organization",
                  "@id": `${siteUrl}/#organization`,
                  name: "大蓝营",
                  url: `${siteUrl}/`,
                  logo: {
                    "@type": "ImageObject",
                    url: toSiteUrl("/bluecamp-logo.svg"),
                  },
                },
                {
                  "@type": "WebSite",
                  "@id": `${siteUrl}/#website`,
                  name: "大蓝营",
                  alternateName: ["OpenAI Codex 中文教程", "Codex 教程"],
                  url: `${siteUrl}/`,
                  description: getPageDescription(page.path),
                  inLanguage: "zh-CN",
                  publisher: {
                    "@id": `${siteUrl}/#organization`,
                  },
                  potentialAction: {
                    "@type": "SearchAction",
                    target: `${siteUrl}/?search={search_term_string}`,
                    "query-input": "required name=search_term_string",
                  },
                },
                {
                  "@type": ["LearningResource", "Course"],
                  "@id": `${siteUrl}/#codex-course`,
                  name: "大蓝营：OpenAI Codex 中文教程与实战指南",
                  url: `${siteUrl}/`,
                  description: getPageDescription(page.path),
                  image: [siteOgImage],
                  inLanguage: "zh-CN",
                  educationalLevel: "Beginner to Intermediate",
                  teaches: [
                    "Codex 桌面 App 使用",
                    "Codex CLI 安装与登录",
                    "OpenAI Codex 配置",
                    "AGENTS.md 项目规则",
                    "Codex 实战案例",
                  ],
                  provider: {
                    "@id": `${siteUrl}/#organization`,
                  },
                },
              ],
            }
          : {
              ...jsonLD,
              dateCreated: page.frontmatter.date ? new Date(page.frontmatter.date).toISOString() : undefined,
              dateModified: page.frontmatter.updated ? new Date(page.frontmatter.updated).toISOString() : undefined,
              description: getPageDescription(page.path),
              url: toSiteUrl(page.path),
              image: [siteOgImage],
              inLanguage: "zh-CN",
              isPartOf: {
                "@type": "WebSite",
                name: "大蓝营",
                url: `${siteUrl}/`,
              },
              publisher: {
                "@type": "Organization",
                name: "大蓝营",
                url: `${siteUrl}/`,
                logo: {
                  "@type": "ImageObject",
                  url: toSiteUrl("/bluecamp-logo.svg"),
                },
              },
            },
      customHead: (head, page) => {
        const description = getPageDescription(page.path);
        const title = `${page.title} | 大蓝营`;

        addMeta(head, "name", "twitter:card", "summary_large_image");
        addMeta(head, "name", "twitter:title", title);
        addMeta(head, "name", "twitter:description", description);
        addMeta(head, "name", "twitter:image", siteOgImage);
        addMeta(head, "name", "twitter:image:alt", `${page.title} - 大蓝营`);
      },
    },
    sitemap: {
      hostname: `${siteUrl}/`,
      changefreq: "weekly",
      excludePaths: ["/404.html"],
    },
    slimsearch: {
      maxSuggestions: 10,
      locales: {
        "/": {
          placeholder: "搜索 大蓝营",
        },
      },
    },
  },
});
