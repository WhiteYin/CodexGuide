# 大蓝营 · BlueCamp

Codex 中文教程与实战指南。保留学习路线、快速上手、进阶教程、实战案例，以及参考来源与致谢。

## 本地运行

要求 Node.js 22–24、pnpm 10.33.0。

```sh
pnpm install --frozen-lockfile
pnpm dev
```

```sh
pnpm build
pnpm test
pnpm typecheck
```

## 配置

- 外链名称与地址：`docs/.vuepress/external-links.ts`。
- 正式域名：默认 `https://guide.bigbiscuit.fun`，环境变量 `PUBLIC_SITE_URL` 可覆盖。
- 今日／累计访问：配置 `DATABASE_URL` 和可选的 `SITE_VISIT_HASH_SECRET`，然后执行 `pnpm db:migrate`。统计不可用时自动收起，不影响教程阅读。
- 保留 Vercel Analytics；不生成 RSS、Atom 或 JSON 订阅。
- 教程图片从原 CDN 下载到 `docs/.vuepress/public/images/tutorials/`；原图水印保留，详见 `reviews/`。
- 文章发布日期、更新时间与正文日期已固定偏移 ±1–3 天，前后对照见 `reviews/date-changes.json`。

本站署名为大蓝营 / BlueCamp。第三方来源与作者信息保留在参考来源与致谢中；原项目 MIT 声明保留于 LICENSE。

## Vercel 部署

根目录的 `vercel.json` 已配置 pnpm 10.33.0、构建命令及输出目录 `docs/.vuepress/dist`。在 Vercel 中选择 Node.js 22 或 24，无需先创建统计数据库即可部署。

1. 将当前源码提交并推送到自己的 GitHub 仓库，包括 `vercel.json`、`.vercelignore` 和教程本地图片。无需上传构建产物或配置 GitHub Pages。
2. 在 Vercel 控制台选择 **Add New → Project**，导入该 GitHub 仓库，生产分支选择 `main`。
3. 根目录选择仓库根目录 `./`，Framework Preset 选择 **Other**。安装、构建及输出目录使用 `vercel.json` 中的配置。
4. 可设置 `PUBLIC_SITE_URL=https://guide.bigbiscuit.fun`；代码默认值已是该域名。暂不设置 `DATABASE_URL` 和 `SITE_VISIT_HASH_SECRET`。
5. 点击 **Deploy**，部署成功后打开首页和教程内页确认内容正常。

部署完成后，将 `guide.bigbiscuit.fun` 添加到项目域名，并按 Vercel 给出的记录配置 DNS。在项目中启用 Web Analytics 即可查看访问分析；首页今日／累计计数暂时隐藏，后续配置数据库并执行迁移后启用。

通过 GitHub 导入后，Vercel 默认会在后续推送时自动部署。需要从控制台手动发布某个分支或提交时，进入项目 **Deployments → Create Deployment**，选择对应分支或提交。
