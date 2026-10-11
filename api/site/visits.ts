import { errorResponse } from "../../server/errors.js";
import { assertMethod, assertSameOrigin, getClientIp, noStoreHeaders } from "../../server/http.js";
import {
  isAutomatedVisitor,
  readSiteVisitStats,
  recordSiteVisit,
  SITE_VISIT_CACHE_SECONDS,
  visitorHash,
} from "../../server/site-visits.js";

// 计数对所有访客一致且不含隐私数据，交给边缘 CDN 缓存，读请求大多不必回源。
const sharedCacheHeaders = (): Headers =>
  new Headers({
    "Cache-Control": `public, max-age=0, s-maxage=${SITE_VISIT_CACHE_SECONDS}, stale-while-revalidate=300`,
  });

export default {
  async fetch(request: Request): Promise<Response> {
    try {
      assertMethod(request, ["GET", "POST"]);

      if (request.method === "POST") assertSameOrigin(request);

      // 数据库尚未接入时返回空统计，前端隐藏计数，不制造错误日志或虚假零值。
      if (!process.env.DATABASE_URL?.trim()) {
        return Response.json(null, { headers: noStoreHeaders() });
      }

      if (request.method === "GET") {
        return Response.json(await readSiteVisitStats(), { headers: sharedCacheHeaders() });
      }

      const userAgent = request.headers.get("user-agent") || "";

      // 爬虫与探活请求只读取计数，不写入，避免把机器流量算成访问量。
      const stats = isAutomatedVisitor(userAgent)
        ? await readSiteVisitStats()
        : await recordSiteVisit(visitorHash(getClientIp(request), userAgent));

      return Response.json(stats, { headers: noStoreHeaders() });
    } catch (error) {
      return errorResponse(error);
    }
  },
};
