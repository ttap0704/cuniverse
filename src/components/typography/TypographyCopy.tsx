"use client";

import {
  clearTooltipAtom,
  setTooltipAtom,
  setTooltipTextAtom,
} from "@/store/tooltip";
import { useSetAtom } from "jotai";
import { useRef } from "react";

// Text Copy를 위해 사용되는 Component
// Mouse Enter/Leave 시, Tooltip On/Off

interface TypographyCopyProps {
  text: string;
  copyText: string;
  className?: string;
}

function TypographyCopy(props: TypographyCopyProps) {
  const text = props.text;
  const copyText = props.copyText;
  const className = props.className;

  const setTooltip = useSetAtom(setTooltipAtom);
  const setTooltipText = useSetAtom(setTooltipTextAtom);
  const clearTooltip = useSetAtom(clearTooltipAtom);

  const contentsRef = useRef<null | HTMLElement>(null);

  const copyToClipboard = () => {
    if (window.navigator.clipboard) {
      window.navigator.clipboard.writeText(copyText);
    } else {
      const textArea = document.createElement("textarea");
      textArea.value = copyText;
      textArea.style.position = "fixed";
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();

      try {
        const successful = document.execCommand("copy");
        const msg = successful ? "successful" : "unsuccessful";
        console.info(msg);
      } catch (err) {
        console.error("Was not possible to copy te text: ", err);
      }

      document.body.removeChild(textArea);
    }
    setTooltipText({ text: "복사완료!" });
  };

  const openTooltip = () => {
    setTooltip({
      open: true,
      targetElement: contentsRef.current,
      text: "복사하기",
    });
  };

  return (
    <span
      ref={contentsRef}
      className={`typography-copy ${className ?? ""}`}
      onClick={copyToClipboard}
      onMouseEnter={openTooltip}
      onMouseLeave={clearTooltip}
    >
      {text}
    </span>
  );
}

export default TypographyCopy;
