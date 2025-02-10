import type { ChartOptions } from "chart.js";
import type { BlockProperties, Editor } from "grapesjs";
import { CHARTS } from "./constants";
import loadBlocks from "./loadBlocks";
import loadComponents from "./loadComponents";
import { loadTraits } from "./loadTraits";
import en from "./locale/en";
import style from "./style";

export type ChartjsPluginOptions = {
  /**
   * I18n object containing languages, [more info](https://grapesjs.com/docs/modules/I18n.html#configuration).
   * @default {}
   */
  i18n?: Record<string, unknown>;
  /**
   * This object will be passed directly to the underlying Chart.js `options`.
   * @see https://www.chartjs.org/docs/latest/configuration for more information
   * @default { maintainAspectRatio: false }
   */
  chartjsOptions?: ChartOptions;
  /**
   * Which blocks to add.
   * @default [ "chartjs-bar", "chartjs-line", "chartjs-pie", "chartjs-doughnut", "chartjs-polarArea", "chartjs-radar", "chartjs-bubble", "chartjs-scatter" ]
   */
  blocks?: string[];
  /**
   * Category name for blocks.
   * @default { id: 'chartjs', label: 'category' } => The label is the i18n key By default the i18n category name will be Charts
   */
  category?: BlockProperties["category"];
};

export default (editor: Editor, opts: ChartjsPluginOptions = {}) => {
  // Add ChartjsPlugin Style
  document.head.insertAdjacentHTML("beforeend", `<style>${style}</style>`);
  const options: Required<ChartjsPluginOptions> = {
    ...{
      i18n: {},
      chartjsOptions: {
        maintainAspectRatio: false,
      },
      blocks: CHARTS.map((chart) => `chartjs-${chart.type}`),
      category: { id: "chartjs", label: "category" },
    },
    ...opts,
  };
  // Load i18n files
  editor.I18n?.addMessages({
    en,
    ...options.i18n,
  });
  // Add traits
  loadTraits(editor);
  // Add components
  loadComponents(editor, options);
  // Add blocks
  loadBlocks(editor, options);
};
