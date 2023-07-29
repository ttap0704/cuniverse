import { atom } from "jotai";

interface ModalAlert {
  open: boolean;
  text: string;
  type: "error" | "success";
}

export const modalAlertAtom = atom<ModalAlert>({
  open: false,
  text: "",
  type: "success",
});

export const setModalAlertAtom = atom(null, (_, set, value: ModalAlert) => {
  set(modalAlertAtom, { ...value });
});

export const clearModalAlertAtom = atom(null, (_, set) => {
  set(modalAlertAtom, { open: false, text: "", type: "success" });
});
