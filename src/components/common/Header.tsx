"use client";

import Link from "next/link";
import ButtonHeader from "@/components/buttons/ButtonHeader";
import ButtonConnectWallet from "../buttons/ButtonConnectWallet";
import { setDropdownAtom } from "@/store/dropdown";
import { useSetAtom } from "jotai";
import DropdownMenu from "../dropdowns/DropdownMenu";
import { useRouter } from "next/navigation";
import { FiSmile } from "react-icons/fi";

const headerDropdownMenu: DropdownMenuItem[] = [
  { id: 0, label: "프로필" },
  { id: 1, label: "컬렉션" },
];

const redirectPages = ["/account", "/collections"];

function Header() {
  const router = useRouter();
  const setDropdown = useSetAtom(setDropdownAtom);

  const checkItem = (id: string | number) => {
    router.push(redirectPages[Number(id)]);
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
            onClick={() => setDropdown({ open: true, id: "header-menu" })}
            testid="header-menu"
            id="header-menu"
          >
            <FiSmile />
          </ButtonHeader>
        </div>
      </nav>
      <DropdownMenu
        items={headerDropdownMenu}
        onItemClicked={checkItem}
        targetId="header-menu"
      />
    </>
  );
}

export default Header;
