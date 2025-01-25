import type { Plugin } from "grapesjs";
import type { ChartOptions } from "chart.js";
import { loadChartJs } from "./charjsLoader";
import loadBlocks from "./loadBlocks";
import loadComponents from "./loadComponents";
import loadTraits from "./loadTraits";

export type ChartjsPluginOptions = {
  chartjsOptions?: ChartOptions;
};

const plugin: Plugin<ChartjsPluginOptions> = (editor, opts = {}) => {
  return loadChartJs(() => {
    const options: Required<ChartjsPluginOptions> = {
      ...{
        // default options
        chartjsOptions: {
          responsive: true,
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
