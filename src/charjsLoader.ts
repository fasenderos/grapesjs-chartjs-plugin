import type { Chart } from "chart.js";

export function loadChartJs(callback: () => void) {
  // @ts-ignore
  if (typeof Chart === "undefined") {
    const script = document.createElement("script");
    script.onload = callback;
    script.src = "https://cdn.jsdelivr.net/npm/chart.js";
    document.body.appendChild(script);
  } else {
    callback();
  }
}
