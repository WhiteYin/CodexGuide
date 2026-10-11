# BlueCamp

A Chinese Codex tutorial site with learning paths, getting started, advanced guides, practical examples, and source acknowledgements.

Use Node.js 22–24 and pnpm 10.33.0. Run `pnpm install --frozen-lockfile`, then `pnpm dev` or `pnpm build`.

The production origin defaults to `https://guide.bigbiscuit.fun`; `PUBLIC_SITE_URL` can override it. External links live in `docs/.vuepress/external-links.ts`. Visit statistics use `DATABASE_URL`; leave it empty to hide the counter, and run `pnpm db:migrate` when adding a database later. Vercel Analytics remains available.

Vercel deployment settings are in `vercel.json`, with pnpm 10.33.0 and output directory `docs/.vuepress/dist`. Use Node.js 22 or 24. Add `guide.bigbiscuit.fun` to the Vercel project and configure the DNS records shown there. Enable Web Analytics in the project dashboard.

Original source authors and the upstream MIT notice remain attributed. Review reports and original watermarked images are listed in `reviews/`.
