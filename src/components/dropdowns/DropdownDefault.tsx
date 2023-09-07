"use client";

import { useAtomValue } from "jotai";
import { dropdownAtom, setDropdownAtom } from "@/store/dropdown";
import { useEffect, useState } from "react";
import { useSetAtom } from "jotai";
import dropdownStyles from "@/css/components/dropdowns.module.scss";

// 모든 Dropdown에 사용되는 공통 Component

interface DropdownDefaultProps {
  children: React.ReactNode;
  targetId: string;
}

function DropdownDefault(props: DropdownDefaultProps) {
  const children = props.children;
  const targetId = props.targetId;

  const [dropdownOpen, setDropdownOpen] = useState(false);

  const { open, id } = useAtomValue(dropdownAtom);
  const [offset, setOffset] = useState({
    top: 0,
    right: 0,
    left: 0,
    side: "",
    padding: 0,
  });
  const [opacity, setOpacity] = useState(0);
  const setDropdown = useSetAtom(setDropdownAtom);

  useEffect(() => {
    if (open) {
      // 아이디를 통해 Dropdown 위치 정하기
      const el = document.getElementById(id);
      if (el && targetId == id) {
        const rect = el.getBoundingClientRect();

        const rightOffset = window.innerWidth - rect.left - rect.width,
          leftOffset = rect.left;

        setDropdownOpen(true);
        setOffset({
          top: rect.top, // 선택된 Element 8px 아래에 위치
          right: window.innerWidth - rect.left - rect.width, // 선택된 Element의 오른쪽 기준
          left: leftOffset, // 선택된 Element의 왼쪽 기준
          side: window.innerWidth / 2 < rightOffset ? "left" : "right", // right가 innerWidth의 반 이상이라면 left로 offset설정
          padding: rect.height + 8,
        });

        setTimeout(() => {
          // Open만 설정하면 transition이 보이지 않으므로 0.1s 이후에 Dropdown 가시성 추가
          setOpacity(1);
        }, 200);
      }
    } else {
      closeDropdown();
    }
  }, [open]);

  const closeDropdown = () => {
    // Transtion을 위해 opacity(가시성) 먼저 업데이트
    setOpacity(0);
    setTimeout(() => {
      // 이후 위치, 전역 Dropdown State 초기화
      setDropdownOpen(false);
      setDropdown({ open: false, id: "" });
      setOffset({ right: 0, left: 0, top: 0, side: "", padding: 0 });
    }, 200);
  };

  return dropdownOpen ? (
    <div className={dropdownStyles["dropdown-wrapper"]}>
      <div
        className={dropdownStyles["dropdown-contents-wrapper"]}
        onMouseLeave={closeDropdown}
        style={{
          top: offset.top,
          right: offset.side == "right" ? offset.right : "unset",
          left: offset.side == "right" ? "unset" : offset.left,
          opacity,
        }}
      >
        <div style={{ width: "100%", height: offset.padding }} />
        <div className={dropdownStyles["dropdown-contents"]}>{children}</div>
      </div>
    </div>
  ) : null;
}

export default DropdownDefault;
