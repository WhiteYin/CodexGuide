import { neon } from "@neondatabase/serverless";
import postgres from "postgres";

import { getDatabaseUrl } from "./config.js";

let cachedUrl: string | null = null;
type QueryRows = Array<Record<string, unknown>>;
type TaggedSql = {
  (strings: TemplateStringsArray, ...values: unknown[]): PromiseLike<QueryRows>;
  begin?: <T>(callback: (transaction: TaggedSql) => Promise<T>) => Promise<T>;
  transaction?: (queries: PromiseLike<unknown>[]) => Promise<unknown[]>;
};

let cachedSql: TaggedSql | null = null;

const localDatabase = (url: string): boolean => {
  const hostname = new URL(url).hostname;
  return hostname === "localhost" || hostname === "127.0.0.1" || hostname === "::1";
};

export const db = (): TaggedSql => {
  const url = getDatabaseUrl();

  if (!cachedSql || cachedUrl !== url) {
    cachedSql = localDatabase(url)
      ? (postgres(url, { max: 1, prepare: false }) as unknown as TaggedSql)
      : (neon(url) as unknown as TaggedSql);
    cachedUrl = url;
  }

  return cachedSql;
};
