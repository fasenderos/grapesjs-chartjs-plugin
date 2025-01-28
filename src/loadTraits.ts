import type { Category, Component, Editor, Trait } from "grapesjs";
import {
  ADD_BACKGROUND,
  DATASET_BACKGROUND_COLOR,
  DATASET_BORDER_COLOR,
} from "./constants";

const loadTraits = (editor: Editor) => {
  const tm = editor.TraitManager;
  tm.addType("cjs-add-color-button", {
    noLabel: true,
    templateInput() {
      return "";
    },
    createInput({ trait, component }) {
      const label = trait.attributes.label ?? "Add Color";
      const el = document.createElement("div");
      const handleRemoveColorTrait = () => {
        removeColorTrait(component, trait);
      };
      const handleAddColorTrait = () => {
        addColorTrait(component, trait);
      };
      el.innerHTML = `<div id="${trait.id}-wrapper" class="cjs-button-wrapper" data-cjs-wrapper>
            <span data-cjs-label>
                ${label}
            </span>
            <div class="cjs-button-container">
              <button title="Remove Color" type="button" class="cjs-button cjs-button-disabled" data-cjs-remove-color>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14"></path></svg>
              </button>
              <button title="Add Color" type="button" class="cjs-button" data-cjs-add-color>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v14m-7-7h14"></path></svg>
              </button>
          </div>
      </div>`;
      const removeButton = el.getElementsByTagName("button")[0];
      const addButton = el.getElementsByTagName("button")[1];
      removeButton.addEventListener("click", handleRemoveColorTrait);
      addButton.addEventListener("click", handleAddColorTrait);
      return el.firstElementChild as HTMLDivElement;
    },
  });
};

const getColorTraitName = (isBg: boolean, counter: number, id: string) => {
  return isBg
    ? `${DATASET_BACKGROUND_COLOR}-${counter}-${id}`
    : `${DATASET_BORDER_COLOR}-${counter}-${id}`;
};

const addColorTrait = (component: Component, trait: Trait) => {
  const id = (trait.id as string).split("-").pop();
  if (id && trait.category) {
    const isBg = (trait.id as string).includes(ADD_BACKGROUND);
    const traits = component.getTraits();
    const { counter, lastIndex } = getFieldsCount(traits, isBg, trait.category);
    const last =
      lastIndex > 0 ? lastIndex : traits.findIndex((t) => trait.id === t.id);
    const at = last + 1;
    const name = getColorTraitName(isBg, counter, id);

    if (counter === 0) {
      const removeButton = getRemoveButton(trait);
      if (removeButton) removeButton.classList.remove("cjs-button-disabled");
    }
    const addedTrait = component?.addTrait(
      [
        {
          type: "color",
          label: false,
          name,
          category: (trait.category as Category).attributes as string,
        },
      ],
      { at },
    )[0];
    const handleChangeColor = (
      trait: Trait,
      value: string | number,
      opts: { fromInput?: 1; avoidStore?: 1; fromTarget?: 1 },
    ) => {
      if (
        (opts.fromInput === 1 ||
          opts.avoidStore === undefined ||
          opts.fromTarget === 1) &&
        value !== 0
      ) {
        // @ts-ignore
        component.view?.updateChart(trait);
      }
    };
    addedTrait.on("change:value", handleChangeColor);
  }
};

const removeColorTrait = (component: Component, trait: Trait) => {
  const id = (trait.id as string).split("-").pop();
  const isBg = (trait.id as string).includes(ADD_BACKGROUND);
  const traits = component.getTraits();
  if (trait.category) {
    const { counter } = getFieldsCount(traits, isBg, trait.category);
    if (counter === 1) {
      const removeButton = getRemoveButton(trait);
      if (removeButton) removeButton.classList.add("cjs-button-disabled");
    }
    if (counter > 0 && id) {
      const traitId = getColorTraitName(isBg, counter - 1, id);
      const traitToBeRemoved = component.getTrait(traitId);
      traitToBeRemoved.setValue("");
      traitToBeRemoved.off("change:value");
      component.removeTrait(traitId);
    }
  }
};

const getFieldsCount = (
  traits: Trait[],
  isBg: boolean,
  traitCategory: Category,
) => {
  const traitsLength = traits.length;
  let lastIndex = 0;
  let bgCount = 0;
  let borderCount = 0;

  for (let index = 0; index < traitsLength; index++) {
    if (
      traits[index].attributes.type === "color" &&
      traitCategory.id === traits[index].category?.id
    ) {
      const trait = traits[index];
      if (isBg) {
        if ((trait.id as string).includes(DATASET_BACKGROUND_COLOR)) {
          lastIndex = index;
          bgCount++;
        }
      } else {
        if ((trait.id as string).includes(DATASET_BORDER_COLOR)) {
          lastIndex = index;
          borderCount++;
        }
      }
    }
  }
  const counter = isBg ? bgCount : borderCount;
  return { counter, lastIndex };
};

const getRemoveButton = (trait: Trait) => {
  const wrapper = document.getElementById(`${trait.id}-wrapper`);
  if (wrapper) {
    return wrapper.querySelector("[data-cjs-remove-color]");
  }
};

export { loadTraits, addColorTrait };
