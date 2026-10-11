import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import { externalLinks } from "./external-links.js";

import { navbar } from "vuepress-theme-hope";

import {
  advancedItemsSource,
  recipeItemsSource,
  startItemsSource,
  type NavbarDocItem,
} from "./navbar-source.js";

const docsRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");

const markdownTitle = (file: string): string => {
  const content = readFileSync(resolve(docsRoot, file), "utf8");
  const match = content.match(/^#\s+(.+)$/m);

  if (!match) {
    throw new Error(`Missing H1 title in docs/${file}`);
  }

  return match[1].trim();
};

const pageLink = (file: string): string =>
  `/${file}`.replace(/00-index\.md$/, "").replace(/\.md$/, ".md");

const docItems = (items: NavbarDocItem[]) =>
  items.map((item) => ({
    text: markdownTitle(item.file),
    icon: item.icon,
    link: pageLink(item.file),
  }));

const startItems = docItems(startItemsSource);
startItems.splice(1, 0, {
  text: "注册GPT账号",
  icon: "",
  link: "https://ai.bigbiscuit.fun/p/hvccrf/",
});
const advancedItems = docItems(advancedItemsSource);
const recipeItems = docItems(recipeItemsSource);
// 添加外链时只需编辑 external-links.ts；未配置时显示静态提示。
const moreItems = [{ text: "参考来源与致谢", icon: "heart", link: "/manual/02-credits.md" }];
const configuredExternalLinks = externalLinks.length
  ? externalLinks
  : [{ text: "待配置", children: [] }];

export default navbar([
  { text: "首页", icon: "home", link: "/" },
  { text: "学习路线", icon: "map", link: "/guide/" },
  {
    text: "快速上手",
    icon: "rocket",
    link: "/start/",
    ariaLabel: "快速上手导航",
    children: startItems,
  },
  {
    text: "进阶教程",
    icon: "book",
    link: "/advanced/",
    ariaLabel: "进阶教程导航",
    children: advancedItems,
  },
  {
    text: "实战案例",
    icon: "lightbulb",
    link: "/recipes/",
    ariaLabel: "实战案例导航",
    children: recipeItems,
  },
  {
    text: "外链",
    icon: "link",
    ariaLabel: "外链导航",
    children: configuredExternalLinks,
  },
  {
    text: "更多",
    icon: "more",
    ariaLabel: "更多导航",
    children: moreItems,
  },
]);
