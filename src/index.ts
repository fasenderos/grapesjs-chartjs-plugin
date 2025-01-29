import type { ChartOptions } from "chart.js";
import type { Editor } from "grapesjs";
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

export default (editor: Editor, opts: ChartjsPluginOptions = {}) => {
  // Add ChartjsPlugin Style
  document.head.insertAdjacentHTML("beforeend", `<style>${style}</style>`);
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
};
