import type { Editor } from "grapesjs";
import type { ChartjsPluginOptions } from ".";
import buildComponent from "./components/build-component";
import { CHARTS } from "./constants";

export default (editor: Editor, options: ChartjsPluginOptions) => {
  const domc = editor.DomComponents;
  for (const chart of CHARTS) {
    const componentType = `chartjs-${chart.type}`;
    chart.chartjsOptions = {
      ...(chart.chartjsOptions ?? {}),
      ...(options.chartjsOptions ?? {}),
    };
    domc.addType(componentType, buildComponent(editor, chart)());
  }
};
