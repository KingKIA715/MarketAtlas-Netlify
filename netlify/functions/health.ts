import type { Handler } from "@netlify/functions";
import { getCacheStats } from "../../src/lib/cache";

export const handler: Handler = async () => {
  return {
    statusCode: 200,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      status: "ok",
      timestamp: new Date().toISOString(),
      cache: getCacheStats(),
    }),
  };
};