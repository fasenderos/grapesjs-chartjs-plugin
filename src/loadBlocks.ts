import type { Editor } from "grapesjs";
import { CHART_TYPE, CHARTS } from "./constants";
import icons from "./icons";

export default async (editor: Editor) => {
  const bm = editor.BlockManager;
  for (const chart of CHARTS) {
    const type = chart.type ?? "bar";
    const blockType = `chartjs-${type}`;
    const icon = icons[chart.type];
    const label =
      chart.blockLabel ??
      `${type.charAt(0).toUpperCase() + type.slice(1)} Chart`;
    bm.add(blockType, {
      label,
      category: "Charts",
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
