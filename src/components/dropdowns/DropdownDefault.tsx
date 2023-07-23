"use client";

import { useAtomValue } from "jotai";
import { dropdownAtom, setDropdownAtom } from "@/store/dropdown";
import { useEffect, useState } from "react";
import { useSetAtom } from "jotai";

interface DropdownDefaultProps {
  children: React.ReactNode;
}

function DropdownDefault(props: DropdownDefaultProps) {
  const children = props.children;

  const { open, id } = useAtomValue(dropdownAtom);
  const [offset, setOffset] = useState({
    right: 0,
    top: 0,
  });
  const [opacity, setOpacity] = useState(0);
  const setDropdown = useSetAtom(setDropdownAtom);

  useEffect(() => {
    if (open) {
      // 아이디를 통해 Dropdown 위치 정하기
      const el = document.getElementById(id);
      if (el) {
        setOffset({
          top: el.offsetTop + el.clientHeight + 8, // 선택된 Element 8px 아래에 위치
          right: window.innerWidth - el.offsetLeft - el.clientWidth, // 선택된 Element의 오른쪽 기준으로 Dropdown 생성
        });
        setTimeout(() => {
          // Open만 설정하면 transition이 보이지 않으므로 0.1s 이후에 Dropdown 가시성 추가
          setOpacity(1);
        }, 100);
      }
    }
  }, [open]);

  const closeDropdown = () => {
    // Transtion을 위해 opacity(가시성) 먼저 업데이트
    setOpacity(0);
    setTimeout(() => {
      // 이후 위치, 전역 Dropdown State 초기화
      setDropdown({ open: false, id: "" });
      setOffset({ right: 0, top: 0 });
    }, 100);
  };

  return open ? (
    <div id="dropdown-wrapper" onClick={closeDropdown}>
      <div
        id="dropdown-contents"
        style={{
          top: offset.top,
          right: offset.right,
          opacity,
        }}
      >
        {children}
      </div>
    </div>
  ) : null;
}

export default DropdownDefault;
