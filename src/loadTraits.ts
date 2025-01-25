import type { Editor } from "grapesjs";
import traits from "./traits";

export default (editor: Editor) => {
  Object.values(traits).map((trait) => {
    trait(editor);
  });
};
