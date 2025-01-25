import type { Editor } from "grapesjs";
import buildBlocks from "./blocks/build-block";
import { CHARTS } from "./constants";
import icons from "./icons";

export default async (editor: Editor) => {
  const bm = editor.BlockManager;
  for (const chart of CHARTS) {
    const blockType = `chartjs-${chart.type}`;
    const icon = icons[chart.type];
    bm.add(blockType, buildBlocks(icon, chart));
  }
};
