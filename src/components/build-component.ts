import type { Chart } from "chart.js";
import type {
  AddComponentTypeOptions,
  Component,
  Editor,
  Trait,
  TraitProperties,
} from "grapesjs";
import {
  ADD_BACKGROUND,
  ADD_BORDER,
  ADD_DATASET,
  CHART_HEIGHT,
  CHART_LABELS,
  CHART_SUBTITLE,
  CHART_TITLE,
  CHART_WIDTH,
  type ChartComponentOptions,
  DATASET_BACKGROUND_COLOR,
  DATASET_BORDER_COLOR,
  DATASET_BORDER_WIDTH,
  DATASET_DATA,
  DATASET_LABEL,
  REMOVE_DATASET,
} from "../constants";
import { addColorTrait } from "../traits/addColorButton";

type UpdateChartDatasetBorderWidthProps = {
  borderWidth: number;
  index: number;
};

type UpdateChartDatasetColorProps = {
  action: "update" | "unset";
  backgroundColor?: string;
  borderColor?: string;
  index: number;
  colorIndex: number;
};

const DEFAULT_OPTIONS = {
  data: "65, 59, 80, 81, 56",
  label: "My Dataset",
  labels: "Jan, Feb, Mar, Apr, May",
  width: 300,
  height: 300,
  title: undefined,
  subtitle: undefined,
};

export default (
  editor: Editor,
  { type, ...options }: ChartComponentOptions,
) => {
  const getNewTraitsGroup = (
    selectedComponent?: Component,
  ): { group: TraitProperties[]; id: number } => {
    const component = selectedComponent ?? editor.getSelected();
    let last = 0;
    for (const trait of component?.getTraits() ?? []) {
      if (trait.category?.id && trait.category.id !== "cjs-common") {
        const categoryId = (trait.category.id as string).split("-").pop();
        if (categoryId) {
          const id = Number.parseInt(categoryId);
          if (id > last) last = id;
        }
      }
    }
    const id = last + 1;
    const newTraitsGroup: TraitProperties[] = [];
    const category = {
      id: `cjs-dataset-options-${id}`,
      label: `#${id} Dataset`,
      open: id === 1,
    };
    if (id > 1) {
      newTraitsGroup.push({
        type: "button",
        text: "Remove Dataset",
        full: true,
        name: `${REMOVE_DATASET}-${id}`,
        category,
        command() {
          const component = editor.getSelected();
          if (component) {
            const traits = component
              .getTraits()
              .filter((t) => t.category?.id === category.id);
            for (const trait of traits) {
              trait.off("change:value");
              trait.setValue("");
              component.removeTrait(trait.id as string);
            }
            // @ts-ignore
            component.view?.removeDataset(id - 1);
          }
        },
      });
    }
    newTraitsGroup.push({
      type: "text",
      label: "Name",
      name: `${DATASET_LABEL}-${id}`,
      category,
      value: `#${id} ${DEFAULT_OPTIONS.label}`,
      placeholder: DEFAULT_OPTIONS.label,
    });
    newTraitsGroup.push({
      type: "text",
      label: "Values",
      name: `${DATASET_DATA}-${id}`,
      category,
      value: options.defaultData ?? DEFAULT_OPTIONS.data,
      placeholder: options.defaultData ?? DEFAULT_OPTIONS.data,
    });
    newTraitsGroup.push({
      type: "cjs-add-color-button",
      name: `${ADD_BACKGROUND}-${id}`,
      label: options?.backgroundColor?.label ?? "Add Background Color",
      category,
    });
    newTraitsGroup.push({
      type: "cjs-add-color-button",
      name: `${ADD_BORDER}-${id}`,
      label: options?.borderColor?.label ?? "Add Border Color",
      category,
    });
    newTraitsGroup.push({
      type: "number",
      label: options?.borderWidth?.label ?? "Border Width",
      name: `${DATASET_BORDER_WIDTH}-${id}`,
      placeholder: options?.borderWidth?.placeholder ?? "0",
      value: options?.borderWidth?.value ?? 0,
      min: options?.borderWidth?.min ?? 0,
      category,
    });
    return { group: newTraitsGroup, id };
  };
  return (): AddComponentTypeOptions => {
    const chartSettingCategory = { id: "cjs-common", label: "Chart Settings" };
    return {
      model: {
        defaults: {
          unstylable: ["width", "height"],
          traits: [
            {
              type: "text",
              label: "Labels",
              name: CHART_LABELS,
              category: chartSettingCategory,
              value: options.defaultLabels ?? DEFAULT_OPTIONS.labels,
              placeholder: options.defaultLabels ?? DEFAULT_OPTIONS.labels,
            },
            {
              type: "text",
              label: "Title",
              name: CHART_TITLE,
              category: chartSettingCategory,
              value: DEFAULT_OPTIONS.title,
              placeholder: "Chart title",
            },
            {
              type: "text",
              label: "Subtitle",
              name: CHART_SUBTITLE,
              category: chartSettingCategory,
              value: DEFAULT_OPTIONS.subtitle,
              placeholder: "Chart subtitle",
            },
            {
              type: "number",
              label: "Width",
              name: CHART_WIDTH,
              category: chartSettingCategory,
              value: DEFAULT_OPTIONS.width,
              placeholder: "300",
            },
            {
              type: "number",
              label: "Height",
              name: CHART_HEIGHT,
              category: chartSettingCategory,
              value: DEFAULT_OPTIONS.height,
              placeholder: "300",
            },
            {
              type: "button",
              text: "Add Data Set",
              full: true,
              name: ADD_DATASET,
              category: chartSettingCategory,
              command(editor, _trait) {
                const component = editor.getSelected();
                // @ts-ignore
                component?.view?.addNewTraitGroup(component);
              },
            },
          ],
        },
      },
      view: {
        init({ model }) {
          if (this.chart) {
            this.chart.destroy();
          }
          for (const trait of model.getTraits()) {
            this.listenTo(trait, "change:value", () => this.updateChart(trait));
          }
          this.addNewTraitGroup(model);
        },
        onRender({ model }) {
          const attributes = model.getAttributes();
          let dataSetCount = 1;
          for (const key of Object.keys(attributes)) {
            const parent = key.includes(DATASET_BACKGROUND_COLOR)
              ? ADD_BACKGROUND
              : key.includes(DATASET_BORDER_COLOR)
                ? ADD_BORDER
                : null;
            if (parent) {
              const fieldId = key.split("-").pop();
              if (fieldId) {
                const id = Number.parseInt(fieldId);
                if (id > dataSetCount) {
                  this.addNewTraitGroup(model);
                  dataSetCount++;
                }
                const trait = model
                  .getTraits()
                  .find((t) => t.id === `${parent}-${id}`);
                if (trait) {
                  addColorTrait(model, trait);
                }
              }
            }
          }
          setTimeout(() => {
            this.initChart();
          }, 0);
        },
        initChart() {
          this.addCanvas();
          const ctx = this.el.firstChild;
          // @ts-ignore
          this.chart = new Chart(ctx, {
            data: {
              labels: [],
              datasets: [],
            },
            options: {
              ...(options.chartjsOptions ?? {}),
            },
          });
          this.addDataset();
          const traits = this.model.getTraits();
          for (const trait of traits) {
            this.updateChart(trait, false);
          }
          this.chart.update();
        },
        addNewTraitGroup(component: Component) {
          const newTraitsGroup = getNewTraitsGroup(component);
          const newTraits = component.addTrait(newTraitsGroup.group);
          const handleChangeValue = (trait: Trait) => {
            this.updateChart(trait);
          };
          newTraits?.forEach((trait, index) => {
            trait.on("change:value", handleChangeValue);
            if (
              newTraitsGroup.group[index]?.value != null &&
              !trait.getValue()
            ) {
              trait.setValue(newTraitsGroup.group[index].value);
            }
          });
        },
        updateChart(trait: Trait, forceUpdate = true) {
          if (this.chart) {
            const value = trait.get("value");
            const splitTrait = trait.get("name")?.split("-") as string[];
            const fieldNumber = Number.parseInt(
              splitTrait?.[splitTrait.length - 1] ?? "1",
            );
            const traitName = [...splitTrait]
              ?.splice(
                0,
                Number.isNaN(fieldNumber)
                  ? splitTrait.length
                  : splitTrait.length - 1,
              )
              .join("-");
            const index = fieldNumber - 1;
            switch (traitName) {
              case DATASET_DATA: {
                this.updateChartDatasetData(value, index);
                break;
              }
              case DATASET_LABEL: {
                this.updateChartDatasetLabel(value, index);
                break;
              }
              case CHART_LABELS: {
                this.updateChartLabels(value);
                break;
              }
              case CHART_TITLE:
                this.updateChartTitle(value);
                break;
              case CHART_SUBTITLE: {
                this.updateChartSubtitle(value);
                break;
              }
              case CHART_HEIGHT: {
                trait.component.addStyle({ height: `${value}px` });
                break;
              }
              case CHART_WIDTH: {
                trait.component.addStyle({ width: `${value}px` });
                break;
              }
              case DATASET_BORDER_WIDTH: {
                const payload: UpdateChartDatasetBorderWidthProps = {
                  borderWidth: Number.parseInt(value),
                  index,
                };
                this.updateChartDatasetBorderWidth(payload);
                break;
              }
              default: {
                const colorIndex = Number.parseInt(
                  splitTrait[splitTrait.length - 2],
                );
                if (traitName?.includes(DATASET_BACKGROUND_COLOR)) {
                  this.updateChartDatasetBackgroundColor(
                    value,
                    index,
                    colorIndex,
                  );
                } else if (traitName?.includes(DATASET_BORDER_COLOR)) {
                  this.updateChartDatasetBorderColor(value, index, colorIndex);
                }
                break;
              }
            }
            if (forceUpdate) this.chart.update();
          } else this.initChart();
        },
        addDataset() {
          if (!this.chart.data.datasets) this.chart.data.datasets = [];
          this.chart.data.datasets.push({
            type,
            backgroundColor: ["rgba(54, 162, 235, 0.5)"],
            borderColor: ["rgb(54, 162, 235)"],
          });
        },
        removeDataset(index: number): void {
          if (this.chart.data.datasets[index] != null) {
            this.chart.data.datasets.splice(index, 1);
            this.chart.update();
          }
        },
        updateChartDatasetData(value: string, index: number): void {
          if (!this.chart.data.datasets[index]) {
            this.chart.data.datasets[index] = { type };
          }
          this.chart.data.datasets[index].data = value
            ? value.split(",").map(Number)
            : [];
        },
        updateChartDatasetLabel(value: string, index: number): void {
          if (!this.chart.data.datasets[index]) {
            this.chart.data.datasets[index] = { type };
          }
          this.chart.data.datasets[index].label = value;
        },
        updateChartDatasetBorderWidth({
          borderWidth,
          index,
        }: UpdateChartDatasetBorderWidthProps): void {
          if (!this.chart.data.datasets[index].borderWidth) {
            this.chart.data.datasets[index].borderWidth = 0;
          }
          if (typeof borderWidth === "number" && borderWidth >= 0) {
            this.chart.data.datasets[index].borderWidth = borderWidth;
          } else {
            this.chart.data.datasets[index].borderWidth = 0;
          }
        },
        updateChartDatasetBackgroundColor(
          value: string,
          index: number,
          colorIndex: number,
        ): void {
          const payload: UpdateChartDatasetColorProps = {
            action: "update",
            backgroundColor: value,
            index,
            colorIndex,
          };
          this.updateChartDatasetColor(payload);
        },
        updateChartDatasetBorderColor(
          value: string,
          index: number,
          colorIndex: number,
        ): void {
          const payload: UpdateChartDatasetColorProps = {
            action: "update",
            borderColor: value,
            index,
            colorIndex,
          };
          this.updateChartDatasetColor(payload);
        },
        updateChartDatasetColor({
          action,
          backgroundColor,
          borderColor,
          index,
          colorIndex,
        }: UpdateChartDatasetColorProps): void {
          if (!this.chart.data.datasets[index]) {
            this.chart.data.datasets[index] = {};
          }
          if (!this.chart.data.datasets[index].backgroundColor) {
            this.chart.data.datasets[index].backgroundColor = [];
          }
          if (!this.chart.data.datasets[index].borderColor) {
            this.chart.data.datasets[index].borderColor = [];
          }

          if (action === "unset") {
            this.chart.data.datasets[index].backgroundColor = [
              "rgba(54, 162, 235, 0.5)",
            ];
            this.chart.data.datasets[index].borderColor = ["rgb(54, 162, 235)"];
            this.chart.data.datasets[index].borderWidth = 0;
          } else {
            if (backgroundColor != null) {
              if (backgroundColor === "") {
                this.chart.data.datasets[index].backgroundColor.splice(
                  colorIndex,
                  1,
                );
                if (
                  this.chart.data.datasets[index].backgroundColor.length === 0
                ) {
                  this.chart.data.datasets[index].backgroundColor = [
                    "rgba(54, 162, 235, 0.5)",
                  ];
                }
              } else {
                this.chart.data.datasets[index].backgroundColor[colorIndex] =
                  backgroundColor;
              }
            }

            if (borderColor != null) {
              if (borderColor === "") {
                this.chart.data.datasets[index].borderColor.splice(
                  colorIndex,
                  1,
                );
                if (this.chart.data.datasets[index].borderColor.length === 0) {
                  this.chart.data.datasets[index].borderColor = [
                    "rgb(54, 162, 235)",
                  ];
                }
              } else {
                this.chart.data.datasets[index].borderColor[colorIndex] =
                  borderColor;
              }
            }
          }
        },
        updateChartLabels(value: string): void {
          this.chart.data.labels = value ? value.split(",") : [];
        },
        updateChartTitle(value: string): void {
          this.chart.options.plugins = {
            ...(this.chart.options.plugins ?? {}),
            title: { display: value.length > 0, text: value },
          };
        },
        updateChartSubtitle(value: string): void {
          this.chart.options.plugins = {
            ...(this.chart.options.plugins ?? {}),
            subtitle: { display: value.length > 0, text: value },
          };
        },
        addCanvas(): void {
          // Remove any childs from the div
          if (this.el.hasChildNodes()) this.el.innerHTML = "";
          const canvas = document.createElement("canvas");
          canvas.style.width = "100%";
          canvas.style.height = "100%";
          this.el.appendChild(canvas);
        },
      },
    };
  };
};
