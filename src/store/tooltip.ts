import { atom } from "jotai";

// Tooltip 전역 데이터 Store

interface Tooltip {
  open: boolean;
  targetElement: HTMLElement | null;
  text: string;
}

export const tooltipAtom = atom<Tooltip>({
  open: false,
  targetElement: null,
  text: "",
});

export const setTooltipAtom = atom(null, (_, set, value: Tooltip) => {
  set(tooltipAtom, { ...value });
});

export const setTooltipTextAtom = atom(
  null,
  (get, set, value: { text: string }) => {
    const tooltip = get(tooltipAtom);
    set(tooltipAtom, { ...tooltip, text: value.text });
  }
);

export const clearTooltipAtom = atom(null, (_, set) => {
  set(tooltipAtom, { open: false, targetElement: null, text: "" });
});
