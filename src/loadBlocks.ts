import type { Editor } from "grapesjs";
import { CHARTS, CHART_TYPE } from "./constants";
import icons from "./icons";
import { getI18nName } from "./utils";

export default async (editor: Editor) => {
  const bm = editor.BlockManager;
  for (const chart of CHARTS) {
    const type = chart.type ?? "bar";
    const blockType = `chartjs-${type}`;
    const icon = icons[chart.type];

    bm.add(blockType, {
      label: getI18nName(editor, `blocks.${type}`),
      category: getI18nName(editor, "category"),
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
};
