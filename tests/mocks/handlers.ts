import { http, HttpResponse } from "msw";

export const handlers = [
  http.get("https://metalpriceapi.com/v1/latest", () => {
    return HttpResponse.json({
      rates: { XAU: 0.0005, XAG: 0.012, XPT: 0.001 },
      base: "USD",
      date: "2024-01-01",
    });
  }),

  http.get("https://api.frankfurter.app/latest", () => {
    return HttpResponse.json({
      rates: { USD: 1.08, GBP: 0.85, INR: 90.5, AED: 3.67, SGD: 1.45 },
      base: "EUR",
    });
  }),

  http.get("https://www.alphavantage.co/query", () => {
    return HttpResponse.json({
      top_gainers: [
        { ticker: "AAPL", change_percentage: "5.2%" },
        { ticker: "TSLA", change_percentage: "3.8%" },
      ],
      top_losers: [
        { ticker: "META", change_percentage: "-2.1%" },
      ],
    });
  }),
];