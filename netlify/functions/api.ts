import type { Handler, HandlerEvent, HandlerContext } from "@netlify/functions";
import { getMetals, getStocks, getFuel, getForex } from "../../src/lib/router";

const headers = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type",
  "Content-Type": "application/json",
};

export const handler: Handler = async (event: HandlerEvent, context: HandlerContext) => {
  const path = event.path.replace("/.netlify/functions/api", "").replace("/api", "");
  const params = new URLSearchParams(event.rawQuery);

  try {
    switch (path) {
      case "/metals": {
        const country = params.get("country") || "IN";
        const currency = params.get("currency") || "INR";
        const result = await getMetals(country, currency);
        return { statusCode: 200, headers, body: JSON.stringify(result) };
      }
      case "/stocks": {
        const result = await getStocks();
        return { statusCode: 200, headers, body: JSON.stringify(result) };
      }
      case "/fuel": {
        const country = params.get("country") || "IN";
        const result = await getFuel(country);
        return { statusCode: 200, headers, body: JSON.stringify(result) };
      }
      case "/forex": {
        const currency = params.get("currency") || "USD";
        const result = await getForex(currency);
        return { statusCode: 200, headers, body: JSON.stringify(result) };
      }
      default:
        return { statusCode: 404, headers, body: JSON.stringify({ error: "Not found" }) };
    }
  } catch (err) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: (err as Error).message }),
    };
  }
};