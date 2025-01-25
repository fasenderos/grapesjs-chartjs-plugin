import type { ChartOptions } from "chart.js";
import type { Plugin } from "grapesjs";
import { loadChartJs } from "./charjsLoader";
import loadBlocks from "./loadBlocks";
import loadComponents from "./loadComponents";
import loadTraits from "./loadTraits";
import style from "./style";

export type ChartjsPluginOptions = {
  chartjsOptions?: ChartOptions;
};

const plugin: Plugin<ChartjsPluginOptions> = (editor, opts = {}) => {
  // Add ChartjsPlugin Style
  document.head.insertAdjacentHTML("beforeend", `<style>${style}</style>`)
  return loadChartJs(() => {
    const options: Required<ChartjsPluginOptions> = {
      ...{
        // default options
        chartjsOptions: {
          maintainAspectRatio: false,
        },
      },
      ...opts,
    };

    // Add traits
    loadTraits(editor);
    // Add components
    loadComponents(editor, options);
    // Add blocks
    loadBlocks(editor);
  });
};

export default plugin;
