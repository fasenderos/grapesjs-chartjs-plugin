import type { BlockProperties } from "grapesjs";
import { ChartComponentOptions } from "../constants";

export default (
  icon: string,
  { type, ...options }: ChartComponentOptions
): BlockProperties => {
  const label =
    options.blockLabel ??
    `${type.charAt(0).toUpperCase() + type.slice(1)} Chart`;
  return {
    label,
    category: "Charts",
    content: {
      tagName: "div",
      type: `chartjs-${type}`,
      attributes: {
        "data-gjs-type": `chartjs-${type}`,
      },
    },
    media: icon,
  };
};
