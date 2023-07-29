"use client";

import { useAtomValue, useSetAtom } from "jotai";
import { useEffect, useRef, useState } from "react";
import { clearModalAlertAtom, modalAlertAtom } from "@/store/modalAlert";
import { FaCheck, FaExclamation } from "react-icons/fa";

function ModalAlert() {
  const [contents, setContents] = useState("");
  const { open, type, text } = useAtomValue(modalAlertAtom);
  const clearModalAlert = useSetAtom(clearModalAlertAtom);

  useEffect(() => {
    if (open) {
      // 3초 뒤에 자동으로 Modal Hidden;
      setTimeout(() => {
        closeModalAlert();
      }, 3000);
    }
  }, [open]);

  useEffect(() => {
    if (open) setContents(text);
  }, [text]);

  const closeModalAlert = () => {
    // Transtion을 위해 opacity(가시성) 먼저 업데이트
    setTimeout(() => {
      // 이후 위치, 전역 Tooltip State 초기화
      clearModalAlert();
    }, 1000);
  };

  return (
    <div
      className="modal-alert-wrapper"
      style={
        open
          ? {
              transform: "unset",
            }
          : {}
      }
    >
      <div className={`modal-alert-contents ${type}`}>
        <div>{type == "success" ? <FaCheck /> : <FaExclamation />}</div>
        <span>{contents}</span>
      </div>
    </div>
  );
}

export default ModalAlert;
