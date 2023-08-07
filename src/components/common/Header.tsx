"use client";

import Link from "next/link";
import ButtonHeader from "@/components/buttons/ButtonHeader";
import ButtonConnectWallet from "../buttons/ButtonConnectWallet";
import { setDropdownAtom } from "@/store/dropdown";
import { useSetAtom } from "jotai";
import DropdownMenu from "../dropdowns/DropdownMenu";
import { useRouter } from "next/navigation";
import { FiSmile } from "react-icons/fi";
import useAccountLogoutMutation from "@/queries/useAccountLogoutMutation";
import useAccountQuery from "@/queries/useAccountQuery";

// 개인정보란 클릭 시, 생성되는 Dropdown Menu Items
const headerDropdownMenu: DropdownMenuItem[] = [
  { id: 0, label: "프로필" },
  { id: 1, label: "내 컬렉션" },
  { id: 2, label: "로그아웃" },
];
const headerDropdownMenuNotAccount: DropdownMenuItem[] = [];

// 이동 페이지 정의
const redirectPages: { [key: number]: string } = {
  0: "/account",
  1: "/collections",
};

function Header() {
  const router = useRouter();
  const setDropdown = useSetAtom(setDropdownAtom);
  const { mutate: logout } = useAccountLogoutMutation();
  const { data: account } = useAccountQuery();

  const checkItem = (id: StringOrNumber) => {
    // Menu의 id == 2 제외한 나머지는 모두 페이지 이동
    if (id == 2) {
      logout();
    } else {
      router.push(redirectPages[Number(id)]);
    }
  };

  return (
    <>
      <nav id="header" data-testid="header" className="contents-container">
        <div id="header-logo">
          <Link href="/" data-testid="header-anchor"></Link>
        </div>
        <div id="header-contents">
          <ButtonConnectWallet />
          {account ? (
            <ButtonHeader
              onClick={() => setDropdown({ open: true, id: "header-menu" })}
              testid="header-menu"
              id="header-menu"
            >
              <FiSmile />
            </ButtonHeader>
          ) : null}
        </div>
      </nav>
      <DropdownMenu
        items={account ? headerDropdownMenu : headerDropdownMenuNotAccount}
        onItemClicked={checkItem}
        targetId="header-menu"
      />
    </>
  );
}

export default Header;
