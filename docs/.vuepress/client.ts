import { inject } from "@vercel/analytics";
import { defineClientConfig } from "vuepress/client";

import SiteVisitCounter from "./components/SiteVisitCounter.vue";
import { loadSiteVisitStats } from "./site-visits.js";


const navbarDropdownLinks: Record<string, string> = {
  快速上手导航: "/start/",
  进阶教程导航: "/advanced/",
  实战案例导航: "/recipes/",
};

const legacySectionPaths: Record<string, string> = {
  "/guide": "/guide/",
  "/guide.html": "/guide/",
  "/start": "/start/",
  "/start.html": "/start/",
  "/advanced": "/advanced/",
  "/advanced.html": "/advanced/",
  "/recipes": "/recipes/",
  "/recipes.html": "/recipes/",
};

const normalizeLegacySectionPath = (): void => {
  const target = legacySectionPaths[window.location.pathname];

  if (!target) return;

  window.history.replaceState(
    window.history.state,
    "",
    `${target}${window.location.search}${window.location.hash}`,
  );
};

if (typeof window !== "undefined") {
  normalizeLegacySectionPath();
}

export default defineClientConfig({
  enhance: ({ app }) => {
    app.component("SiteVisitCounter", SiteVisitCounter);

    // 站内任意页面都计入访问，首页组件复用同一次请求的结果。
    void loadSiteVisitStats();

    if (typeof window !== "undefined") {
      document.addEventListener("click", (event) => {
        if (event.detail === 0) return;

        const target = event.target as Element | null;
        if (target?.closest(".vp-dropdown")) return;

        const button = target?.closest<HTMLButtonElement>(".vp-dropdown-title");
        const link = button ? navbarDropdownLinks[button.getAttribute("aria-label") ?? ""] : null;

        if (link) window.location.assign(link);
      });
    }

    if (
      import.meta.env.PROD &&
      typeof window !== "undefined" &&
      !["localhost", "127.0.0.1"].includes(window.location.hostname)
    ) {
      inject();
    }
  },
});
