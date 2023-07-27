"use client";

import { useAtomValue } from "jotai";
import { useEffect, useState } from "react";
import { useSetAtom } from "jotai";
import { tooltipAtom, setTooltipAtom } from "@/store/tooltip";

function Tooltip() {
  const [tooltipOpen, setTooltipOpen] = useState(false);
  const [contents, setContents] = useState("");
  const { open, targetElement, text } = useAtomValue(tooltipAtom);
  const [offset, setOffset] = useState({
    top: 0,
    left: 0,
  });
  const [opacity, setOpacity] = useState(0);

  useEffect(() => {
    if (open) {
      setTooltipOpen(true);
      // Element를 통해 Tooltip 위치 정하기
      if (targetElement) {
        setOffset({
          top: targetElement.offsetTop,
          left: targetElement.offsetLeft + targetElement.clientWidth / 2,
        });
        setTimeout(() => {
          // Open만 설정하면 transition이 보이지 않으므로 0.1s 이후에 Tooltip 가시성 추가
          setOpacity(1);
        }, 100);
      }
    } else {
      closeTooltip();
    }
  }, [open]);

  useEffect(() => {
    if (open) setContents(text);
  }, [text]);

  const closeTooltip = () => {
    // Transtion을 위해 opacity(가시성) 먼저 업데이트
    setOpacity(0);
    setTimeout(() => {
      // 이후 위치, 전역 Tooltip State 초기화
      setOffset({ top: 0, left: 0 });
      setTooltipOpen(false);
    }, 100);
  };

  return tooltipOpen ? (
    <div
      className="tooltip-wrapper"
      onMouseLeave={closeTooltip}
      style={{
        top: offset.top,
        left: offset.left,
        opacity,
      }}
    >
      <div className="tooltip-contents">{contents}</div>
      <div className="triangle-bottom-small" />
    </div>
  ) : null;
}

export default Tooltip;
