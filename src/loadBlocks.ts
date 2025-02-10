import type { BlockCategoryProperties, Editor } from "grapesjs";
import type { ChartjsPluginOptions } from ".";
import { CHARTS, CHART_TYPE } from "./constants";
import icons from "./icons";
import { getI18nName } from "./utils";

export default async (
  editor: Editor,
  options: Required<ChartjsPluginOptions>,
) => {
  const bm = editor.BlockManager;
  const categoryName =
    (options.category as BlockCategoryProperties).label === "category" // i18n key for category name
      ? getI18nName(editor, (options.category as BlockCategoryProperties).label)
      : ((options.category as BlockCategoryProperties).label ??
        options.category);
  for (const chart of CHARTS) {
    const type = chart.type ?? "bar";
    const blockType = `chartjs-${type}`;
    if (options.blocks?.includes(blockType)) {
      const icon = icons[chart.type];
      bm.add(blockType, {
        label: getI18nName(editor, `blocks.${type}`),
        category: {
          id: (options.category as BlockCategoryProperties)?.id ?? "chartjs",
          label: categoryName,
        },
        content: {
          tagName: "div",
          type: "chartjs",
          attributes: {
            "data-gjs-type": "chartjs",
            [CHART_TYPE]: type,
          },
        },
        media: icon,
      });
    }
  }
};
