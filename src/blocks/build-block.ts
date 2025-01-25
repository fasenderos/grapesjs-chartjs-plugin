import type { BlockProperties } from "grapesjs";
import type { ChartComponentOptions } from "../constants";

export default (
  icon: string,
  { type, ...options }: ChartComponentOptions,
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
    },
    media: icon,
  };
};
