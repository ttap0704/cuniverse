"use client";

import { useAtomValue } from "jotai";
import { useEffect, useState } from "react";
import { tooltipAtom } from "@/store/tooltip";
import commonStyles from "@/css/components/common.module.scss";

// 전역으로 사용되는 Tooltip Component

function Tooltip() {
  // tooltipAtom의 open과 별개로
  // 애니메이션 처리하기 위한 State
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
        const rect = targetElement.getBoundingClientRect();
        setOffset({
          top: rect.top - 8,
          left: rect.left + rect.width / 2,
        });
        setTimeout(() => {
          // Open만 설정하면 transition이 보이지 않으므로 0.1s 이후에 Tooltip 가시성 추가
          setOpacity(1);
        }, 100);
      }
    } else {
      closeTooltip();
    }
  }, [open, targetElement]);

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
      className={commonStyles["tooltip-wrapper"]}
      onMouseLeave={closeTooltip}
      style={{
        top: offset.top,
        left: offset.left,
        opacity,
      }}
    >
      <div className={commonStyles["tooltip-contents"]}>{contents}</div>
      <div className={commonStyles["triangle-bottom-small"]} />
    </div>
  ) : null;
}

export default Tooltip;
