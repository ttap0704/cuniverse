import { atom } from "jotai";

// Dropdown 전역 데이터 Store

export const dropdownAtom = atom<{
  open: boolean;
  id: string;
}>({
  open: false,
  id: "",
});

export const setDropdownAtom = atom(
  null,
  (_, set, value: { open: boolean; id: string }) => {
    set(dropdownAtom, { ...value });
  }
);
