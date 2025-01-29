// this file should be in plain javascript to avoit strange behavior with webpack in editor canvas
export function loadChartJs(props) {
  // biome-ignore lint/complexity/noUselessThisAlias: <explanation>
  const el = this;
  const init = () => {
    if (el.firstChild?.$chartjs === undefined) {
      addCanvas();
      const ctx = el.firstChild;
      window.loadedCharts[el.id] = new window.Chart(ctx);
    }
    updateChart();
  };

  const updateChart = () => {
    if (props.chartjsOptions) {
      if (props.chartjsOptions.options) {
        window.loadedCharts[el.id].options = props.chartjsOptions.options;
      }
      if (props.chartjsOptions.data) {
        window.loadedCharts[el.id].data = props.chartjsOptions.data;
      }
      window.loadedCharts[el.id].update();
    }
  };

  const addCanvas = () => {
    if (el.hasChildNodes()) el.innerHTML = "";
    const canvas = document.createElement("canvas");
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    el.appendChild(canvas);
  };

  if (window.Chart === undefined) {
    window.loadedCharts = {};
    const script = document.createElement("script");
    script.onload = init;
    script.src = "https://cdn.jsdelivr.net/npm/chart.js";
    document.body.appendChild(script);
  } else {
    init();
  }
}
