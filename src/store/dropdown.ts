import { atom } from "jotai";
import React from "react";

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
