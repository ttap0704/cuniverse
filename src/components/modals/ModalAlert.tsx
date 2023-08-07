"use client";

import { useAtomValue, useSetAtom } from "jotai";
import { useEffect, useState } from "react";
import { clearModalAlertAtom, modalAlertAtom } from "@/store/modalAlert";
import { FaCheck, FaExclamation } from "react-icons/fa";

// 우측 하단 전역으로 사용되는 Modal Component
// 전역 데이터는 modalAlertAtom 확인

function ModalAlert() {
  const [contents, setContents] = useState("");
  const [alertType, setAlertType] = useState("");
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
    if (open) setContents(text), setAlertType(type);
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
      <div className={`modal-alert-contents ${alertType}`}>
        <div>{alertType == "success" ? <FaCheck /> : <FaExclamation />}</div>
        <span>{contents}</span>
      </div>
    </div>
  );
}

export default ModalAlert;
