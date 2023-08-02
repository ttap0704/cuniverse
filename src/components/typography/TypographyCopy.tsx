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
    window.navigator.clipboard.writeText(copyText);
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
