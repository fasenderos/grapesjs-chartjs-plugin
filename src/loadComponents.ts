import type { Editor } from "grapesjs";
import buildComponent from "./components/build-component";
import { CHARTS } from "./constants";
import { ChartjsPluginOptions } from ".";

export default (editor: Editor, options: ChartjsPluginOptions) => {
  const domc = editor.DomComponents;
  CHARTS.forEach((chart) => {
    const componentType = `chartjs-${chart.type}`;
    chart.chartjsOptions = {
      ...(chart.chartjsOptions ?? {}),
      ...(options.chartjsOptions ?? {}),
    };
    domc.addType(componentType, buildComponent(editor, chart)());
  });
};
