"use client";

import Link from "next/link";
import ButtonHeader from "@/components/buttons/ButtonHeader";
import ButtonConnectWallet from "../buttons/ButtonConnectWallet";

function Header() {
  return (
    <nav id="header" data-testid="header" className="contents-container">
      <div id="header-logo">
        <Link href="/" data-testid="header-anchor"></Link>
      </div>
      <div id="header-contents">
        <ButtonConnectWallet />
        <ButtonHeader onClick={() => console.log("개인목록")}>
          개인목록
        </ButtonHeader>
      </div>
    </nav>
  );
}

export default Header;
