import type {
  CallbackOptions,
  Component,
  Editor,
  Trait,
  TraitProperties,
} from "grapesjs";
import type { ChartjsPluginOptions } from ".";
import {
  ADD_BACKGROUND,
  ADD_BORDER,
  ADD_DATASET,
  CHART_HEIGHT,
  CHART_LABELS,
  CHART_SUBTITLE,
  CHART_TITLE,
  CHART_TYPE,
  CHART_WIDTH,
  type ChartComponentOptions,
  CHARTS,
  DATASET_BACKGROUND_COLOR,
  DATASET_BORDER_COLOR,
  DATASET_BORDER_WIDTH,
  DATASET_DATA,
  DATASET_LABEL,
  DATASET_OPTIONAL_PROPERTY,
  type DatasetType,
  DEFAULT_OPTIONS,
  REMOVE_DATASET,
} from "./constants";
import { loadChartJs } from "./charjsLoader";
import { addColorTrait } from "./loadTraits";

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

export default (editor: Editor, options: ChartjsPluginOptions) => {
  const domc = editor.DomComponents;
  const chartSettingCategory = { id: "cjs-common", label: "Chart Settings" };

  domc.addType("chartjs", {
    model: {
      defaults: {
        script: loadChartJs,
        "script-props": ["chartjsOptions"],
        resizable: {
          ratioDefault: true,
          tc: false,
          bc: false,
          cl: false,
          cr: false,
          onEnd: (_ev: Event, { el }: CallbackOptions) => {
            const component = editor.getSelected();
            const { offsetHeight: height, offsetWidth: width } = el;
            const traitWidth = component?.getTrait(CHART_WIDTH);
            const traitHeight = component?.getTrait(CHART_HEIGHT);
            traitWidth?.setValue(width);
            traitHeight?.setValue(height);
          },
        },
        unstylable: ["width", "height"],
        // @ts-ignore
        traits(component: Component) {
          const type = component.getAttributes()[CHART_TYPE];
          const chartSettings = CHARTS.find((c) => c.type === type);
          const datasetType = chartSettings?.datasetType ?? "labels-data";
          component.set("chartComponentOptions", chartSettings);

          const traits: TraitProperties[] = [
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
              command(editor: Editor) {
                const component = editor.getSelected();
                // @ts-ignore
                component?.addNewDatasetTraitsGroup();
              },
            },
          ];

          if (datasetType === "labels-data") {
            traits.unshift({
              type: "text",
              label: "Labels",
              name: CHART_LABELS,
              category: chartSettingCategory,
              value: chartSettings?.defaultLabels ?? DEFAULT_OPTIONS.labels,
              placeholder:
                chartSettings?.defaultLabels ?? DEFAULT_OPTIONS.labels,
            });
          }
          return traits;
        },
      },
      init() {
        const alreadyLoaded = this.getTrait(`${DATASET_DATA}-1`);
        if (alreadyLoaded == null) {
          this.addNewDatasetTraitsGroup();
        } else {
          const attributes = this.getAttributes();
          let dataSetCount = 0;
          for (const key of Object.keys(attributes)) {
            const fieldId = key.split("-").pop();
            if (fieldId) {
              const id = Number.parseInt(fieldId);
              if (id > dataSetCount) {
                this.addNewDatasetTraitsGroup();
                dataSetCount++;
              }
              const parent = key.includes(DATASET_BACKGROUND_COLOR)
                ? ADD_BACKGROUND
                : key.includes(DATASET_BORDER_COLOR)
                  ? ADD_BORDER
                  : null;
              if (parent) {
                const trait = this.getTraits().find(
                  (t) => t.id === `${parent}-${id}`,
                );
                if (trait) {
                  addColorTrait(this, trait);
                }
              }
            }
          }
        }
        this.on("change:attributes", this.handleAttrChange);
      },
      handleAttrChange(component: Component) {
        // @ts-ignore
        component.view.updateChart();
      },
      addNewDatasetTraitsGroup() {
        const newTraitsGroup =
          this.getNewDatasetTraitsGroup() as TraitProperties[];
        this.addTrait(newTraitsGroup);
        const newAttributes = newTraitsGroup.reduce(
          (acc, curr) => {
            if (curr.name && curr.value) {
              acc[curr.name] = curr.value;
            }
            return acc;
          },
          {} as Record<string, unknown>,
        );
        if (Object.keys(newTraitsGroup).length)
          this.addAttributes(newAttributes);
      },
      getNewDatasetTraitsGroup(): TraitProperties[] {
        const chartOptions = this.get(
          "chartComponentOptions",
        ) as ChartComponentOptions;
        const datasetType = chartOptions.datasetType ?? "labels-data";

        let last = 0;
        for (const trait of this.getTraits() ?? []) {
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
        if (datasetType !== "labels-data") {
          newTraitsGroup.push({
            type: "text",
            label: "Labels",
            name: `${CHART_LABELS}-${id}`,
            category,
            value: chartOptions.defaultLabels ?? DEFAULT_OPTIONS.labels,
            placeholder: chartOptions.defaultLabels ?? DEFAULT_OPTIONS.labels,
          });
        }
        newTraitsGroup.push({
          type: "text",
          label: "Values",
          name: `${DATASET_DATA}-${id}`,
          category,
          value: chartOptions.defaultData ?? DEFAULT_OPTIONS.data,
          placeholder: chartOptions.defaultData ?? DEFAULT_OPTIONS.data,
        });
        newTraitsGroup.push({
          type: "cjs-add-color-button",
          name: `${ADD_BACKGROUND}-${id}`,
          label: chartOptions?.backgroundColor?.label ?? "Add Background Color",
          category,
        });
        newTraitsGroup.push({
          type: "cjs-add-color-button",
          name: `${ADD_BORDER}-${id}`,
          label: chartOptions?.borderColor?.label ?? "Add Border Color",
          category,
        });
        newTraitsGroup.push({
          type: "number",
          label: chartOptions?.borderWidth?.label ?? "Border Width",
          name: `${DATASET_BORDER_WIDTH}-${id}`,
          value: chartOptions?.borderWidth?.value ?? 0,
          placeholder: chartOptions?.borderWidth?.placeholder ?? "0",
          min: chartOptions?.borderWidth?.min ?? 0,
          category,
        });

        if (chartOptions?.optionalDatasetProperties?.length) {
          for (const {
            property,
            type,
            traitOptions,
            ...rest
          } of chartOptions.optionalDatasetProperties) {
            newTraitsGroup.push({
              ...traitOptions,
              type,
              label:
                traitOptions?.label ??
                `${property.charAt(0).toUpperCase() + property.slice(1)}`,
              name: `${DATASET_OPTIONAL_PROPERTY}-${property}-${id}`,
              category,
            });
          }
        }
        return newTraitsGroup;
      },
    },
    view: {
      init() {
        this.chart = {
          data: {
            labels: [],
            datasets: [],
          },
          options: {
            ...(options.chartjsOptions ?? {}),
          },
        };
        this.updateChart();
      },
      getDatasetType() {
        const options = this.model.get(
          "chartComponentOptions",
        ) as ChartComponentOptions;
        return options?.datasetType ?? "labels-data";
      },
      updateChart() {
        const {
          id,
          [CHART_TYPE]: type,
          "data-gjs-type": componentName,
          ...restTraits
        } = this.model.getTraits().reduce(
          (acc, curr) => {
            acc[curr.getName()] = curr;
            return acc;
          },
          {} as { [name: string]: Trait },
        );

        const datasetType = this.getDatasetType() as DatasetType;
        for (const name in restTraits) {
          if (Object.prototype.hasOwnProperty.call(restTraits, name)) {
            const trait = restTraits[name];
            const value = trait.getValue();
            const splitTrait = name.split("-") as string[];
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
                this.updateChartLabels(value, index);
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
                this.model.addStyle({ height: `${value ?? 0}px` });
                break;
              }
              case CHART_WIDTH: {
                this.model.addStyle({ width: `${value ?? 0}px` });
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
                } else if (traitName?.includes(DATASET_OPTIONAL_PROPERTY)) {
                  if (datasetType === "labels-data") {
                    this.updateOptionalDatasetProperty(
                      trait,
                      traitName,
                      value,
                      index,
                    );
                  } else {
                    const type = traitName.split("-").pop();
                    this.updateChartByDatasetType(type, value, index);
                  }
                }
                break;
              }
            }
          }
        }
        // Update chart view
        this.updateChartView();
      },
      updateChartView() {
        this.model.set("chartjsOptions", this.chart);
        this.model.trigger("change:chartjsOptions");
      },
      addDataset() {
        if (!this.chart.data.datasets) this.chart.data.datasets = [];
        const options = this.model.get(
          "chartComponentOptions",
        ) as ChartComponentOptions;
        this.chart.data.datasets.push({
          type: options.type,
          backgroundColor: ["rgba(54, 162, 235, 0.5)"],
          borderColor: ["rgb(54, 162, 235)"],
          data: [],
        });
      },
      removeDataset(index: number): void {
        if (this.chart.data.datasets[index] != null) {
          this.chart.data.datasets.splice(index, 1);
          this.updateChartView();
        }
      },
      updateChartDatasetData(value: string, index: number): void {
        if (!this.chart.data.datasets[index]) {
          const options = this.model.get(
            "chartComponentOptions",
          ) as ChartComponentOptions;
          this.chart.data.datasets[index] = { type: options.type };
        }
        this.updateChartByDatasetType("data", value, index);
      },
      updateChartDatasetLabel(value: string, index: number): void {
        if (!this.chart.data.datasets[index]) {
          const options = this.model.get(
            "chartComponentOptions",
          ) as ChartComponentOptions;
          this.chart.data.datasets[index] = { type: options.type };
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
              this.chart.data.datasets[index].borderColor.splice(colorIndex, 1);
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
      updateChartLabels(value: string, index: number): void {
        this.updateChartByDatasetType("labels", value, index);
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
      updateOptionalDatasetProperty(
        trait: Trait,
        traitName: string,
        value: unknown,
        index: number,
      ) {
        const property = traitName.split("-").pop();
        if (property) {
          if (!this.chart.data.datasets[index]) {
            this.chart.data.datasets[index] = {};
          }
          let newValue = value;
          // checkbox can comes as a target attributes with an empty string that means "true", true or false
          if (trait.attributes.type === "checkbox" && value !== false) {
            const attributes = trait.target.getAttributes();
            if (attributes?.[trait.id] === "") newValue = true;
          }
          this.chart.data.datasets[index][property] = newValue;
        }
      },
      updateChartByDatasetType(
        type: "labels" | "data" | "radial",
        value: string,
        index: number,
      ) {
        const datasetType = this.getDatasetType() as DatasetType;
        if (datasetType === "labels-data") {
          if (type === "labels") {
            this.chart.data.labels = value
              ? value.split(",").map((x) => x.trim())
              : [];
          } else {
            this.chart.data.datasets[index].data = value
              ? value.split(",").map((x) => Number.parseFloat(x.trim()))
              : [];
          }
        } else {
          // can be x-y or x-y-r
          // x => labels
          // y => data
          // r => radial
          const coordiantes = datasetType.split("-");
          const axis =
            type === "labels"
              ? coordiantes[0]
              : type === "data"
                ? coordiantes[1]
                : coordiantes[2];
          if (axis != null) {
            const oldValues = [...(this.chart.data.datasets[index].data ?? [])];
            const newValues =
              value?.split(",").map((x) => Number.parseFloat(x.trim())) ?? [];
            const maxLength =
              newValues.length >= oldValues.length
                ? newValues.length
                : oldValues.length;

            const results = [];
            for (let i = 0; i < maxLength; i++) {
              const data = {
                // copy old values
                ...(oldValues[i] != null ? oldValues[i] : {}),
                ...(newValues[i] != null ? { [axis]: newValues[i] } : {}),
              };
              if (newValues[i] == null) delete data[axis];
              results.push(data);
            }
            this.chart.data.datasets[index].data = [...results];
          }
        }
      },
    },
  });
};
