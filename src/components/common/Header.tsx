"use client";

import Link from "next/link";
import ButtonHeader from "@/components/buttons/ButtonHeader";
import ButtonConnectWallet from "../buttons/ButtonConnectWallet";
import { useEffect, useRef } from "react";
import { dropdownAtom, setDropdownAtom } from "@/store/dropdown";
import { useSetAtom } from "jotai";
import DropdownMenu from "../dropdowns/DropdownMenu";

function Header() {
  const setDropdown = useSetAtom(setDropdownAtom);

  const checkItem = (id: string | number) => {
    console.log(id);
  };

  return (
    <>
      <nav id="header" data-testid="header" className="contents-container">
        <div id="header-logo">
          <Link href="/" data-testid="header-anchor"></Link>
        </div>
        <div id="header-contents">
          <ButtonConnectWallet />
          <ButtonHeader
            onClick={() => setDropdown({ open: true, id: "header-info" })}
            id="header-info"
          >
            정보
          </ButtonHeader>
        </div>
      </nav>
      <DropdownMenu
        items={[{ id: 1, label: "test" }]}
        onItemClicked={checkItem}
      />
    </>
  );
}

export default Header;
