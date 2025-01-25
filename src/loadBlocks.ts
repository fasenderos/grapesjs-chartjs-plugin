import type { Editor } from "grapesjs";
import buildBlocks from "./blocks/build-block";
import { CHARTS } from "./constants";

export default async (editor: Editor) => {
  const bm = editor.BlockManager;
  for await (const chart of CHARTS) {
    const blockType = `chartjs-${chart.type}`;
    const iconModule = await import(`./icons/${chart.type}-chart.svg.ts`);
    const icon = iconModule.default || iconModule;
    bm.add(blockType, buildBlocks(icon, chart));
  }
};
