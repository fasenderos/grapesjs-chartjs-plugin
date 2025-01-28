import type { ChartOptions } from "chart.js";
import type { Plugin } from "grapesjs";
import { loadChartJs } from "./charjsLoader";
import loadBlocks from "./loadBlocks";
import loadComponents from "./loadComponents";
import { loadTraits } from "./loadTraits";
import style from "./style";

export type ChartjsPluginOptions = {
  /**
   * I18n object containing languages, [more info](https://grapesjs.com/docs/modules/I18n.html#configuration).
   * @default {}
   */
  i18n?: Record<string, unknown>;
  chartjsOptions?: ChartOptions;
};

const plugin: Plugin<ChartjsPluginOptions> = (editor, opts = {}) => {
  // Add ChartjsPlugin Style
  document.head.insertAdjacentHTML("beforeend", `<style>${style}</style>`);
  return loadChartJs(() => {
    const options: Required<ChartjsPluginOptions> = {
      ...{
        i18n: {},
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
