import { AppError } from "./errors.js";

export const assertMethod = (request: Request, methods: string[]): void => {
  if (!methods.includes(request.method)) {
    throw new AppError(405, "method_not_allowed", "请求方法不受支持。");
  }
};

export const assertSameOrigin = (request: Request): void => {
  const origin = request.headers.get("origin");
  const expected = new URL(request.url).origin;

  if (!origin || origin !== expected) {
    throw new AppError(403, "invalid_origin", "请求来源无效，请刷新页面后重试。");
  }
};

export const getClientIp = (request: Request): string => {
  const forwarded = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();

  return forwarded || request.headers.get("x-real-ip") || "unknown";
};

export const noStoreHeaders = (extra: HeadersInit = {}): Headers => {
  const headers = new Headers(extra);
  headers.set("Cache-Control", "no-store, private, max-age=0");
  headers.set("Pragma", "no-cache");
  return headers;
};
