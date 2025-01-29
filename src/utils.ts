import type { Editor } from "grapesjs";
import { PLUGIN } from "./constants";

export const getI18nName = (editor: Editor, key: string): string => {
  return `@@@${editor.I18n.t(`${PLUGIN}.${key}`)}`;
};
