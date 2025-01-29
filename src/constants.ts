import type { ChartOptions, ChartType } from "chart.js";
import type { TraitProperties } from "grapesjs";

export const PLUGIN = "grapesjs-chartjs-plugin";

export const ADD_DATASET = "cjs-add-dataset";
export const REMOVE_DATASET = "cjs-remove-dataset";
export const ADD_BACKGROUND = "cjs-add-background-color";
export const ADD_BORDER = "cjs-add-border-color";

export const CHART_TYPE = "cjs-chart-type";
export const CHART_LABELS = "cjs-chart-labels";
export const CHART_TITLE = "cjs-chart-title";
export const CHART_SUBTITLE = "cjs-chart-subtitle";
export const CHART_WIDTH = "cjs-chart-width";
export const CHART_HEIGHT = "cjs-chart-height";
export const DATASET_LABEL = "cjs-dataset-label";
export const DATASET_DATA = "cjs-dataset-data";
export const DATASET_BACKGROUND_COLOR = "cjs-dataset-background-color";
export const DATASET_BORDER_COLOR = "cjs-dataset-border-color";
export const DATASET_BORDER_WIDTH = "cjs-dataset-border-width";
export const DATASET_OPTIONAL_PROPERTY = "cjs-dataset-custom";

export const DEFAULT_OPTIONS = {
  data: "65, 59, 80, 81, 56",
  label: "My Dataset",
  labels: "Jan, Feb, Mar, Apr, May",
  width: 300,
  height: 300,
  title: undefined,
  subtitle: undefined,
};

type ChartOptionalDatasetProperties = {
  property: string;
  type: "text" | "number" | "select" | "checkbox" | "color" | "button";
  traitOptions?: Omit<TraitProperties, "type">;
};

export type DatasetType = "labels-data" | "x-y" | "x-y-r"; // default to "labels-data"

export type ChartComponentOptions = {
  type: ChartType;
  datasetType?: DatasetType;
  defaultLabels?: string;
  defaultData?: string;
  chartjsOptions?: ChartOptions;
  optionalDatasetProperties?: ChartOptionalDatasetProperties[];
  backgroundColor?: TraitProperties;
  borderColor?: TraitProperties;
  borderWidth?: TraitProperties;
};

export const CHARTS: ChartComponentOptions[] = [
  { type: "bar" },
  {
    type: "line",
    backgroundColor: { label: "addPointColor" },
    borderColor: { label: "addLineColor" },
    borderWidth: { label: "lineWidth", placeholder: "1", value: 1 },
    optionalDatasetProperties: [
      { property: "fill", type: "checkbox" },
      {
        property: "tension",
        type: "number",
        traitOptions: {
          min: 0,
          placeholder: "0.1",
          step: 0.1,
        },
      },
    ],
  },
  {
    type: "pie",
    defaultLabels: "Jan, Feb, Mar",
    defaultData: "300, 50, 100",
    backgroundColor: { label: "addSegmentColor" },
    borderWidth: { placeholder: "1", value: 1 },
  },
  {
    type: "doughnut",
    defaultLabels: "Jan, Feb, Mar",
    defaultData: "300, 50, 100",
    backgroundColor: { label: "addSegmentColor" },
    borderWidth: { placeholder: "1", value: 1 },
  },
  {
    type: "polarArea",
    borderWidth: { placeholder: "1", value: 1 },
  },
  {
    type: "radar",
    defaultLabels: "Eating, Drinking, Sleeping, Running",
    defaultData: "70, 80, 90, 65",
  },
  {
    type: "bubble",
    defaultLabels: "-10, 0, 10, 0.5",
    defaultData: "0, 10, 5, 5.5",
    datasetType: "x-y-r",
    optionalDatasetProperties: [
      {
        property: "radial",
        type: "text",
        traitOptions: { value: "15, 5, 30, 10", label: "radius" },
      },
    ],
  },
  {
    type: "scatter",
    defaultLabels: "-10, 0, 10, 0.5",
    defaultData: "0, 10, 5, 5.5",
    datasetType: "x-y",
  },
];
