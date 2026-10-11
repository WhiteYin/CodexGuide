import { rm } from "node:fs/promises";
// 固定为项目生成目录，跨平台运行。
for (const path of ["../docs/.vuepress/.cache", "../docs/.vuepress/.temp", "../docs/.vuepress/dist"]) {
  await rm(new URL(path, import.meta.url), { recursive: true, force: true });
}
