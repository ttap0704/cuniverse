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
import ImageCuniverse from "./ImageCuniverse";
import LogoLarge from "@/images/logo-large.png";
import LogoSmall from "@/images/logo-small.png";
import buttonStyles from "@/css/components/buttons.module.scss";
import commonStyles from "@/css/components/common.module.scss";

// 개인정보란 클릭 시, 생성되는 Dropdown Menu Items
const headerDropdownMenu: DropdownMenuItem[] = [
  { id: 0, label: "프로필" },
  { id: 1, label: "내 컬렉션" },
  { id: 3, label: "NFT 생성" },
  { id: 2, label: "로그아웃" },
];
const headerDropdownMenuNotAccount: DropdownMenuItem[] = [];

// 이동 페이지 정의
const redirectPages: { [key: number]: string } = {
  0: "/account",
  1: "/contracts",
  3: "/minting",
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
      <nav
        id="header"
        data-testid="header"
        className={`${commonStyles["header"]} ${commonStyles["contents-container"]}`}
      >
        <div>
          <div id="header-logo" className={commonStyles["header-logo"]}>
            <Link
              href="/"
              data-testid="header-anchor"
              className={commonStyles["large"]}
            >
              <ImageCuniverse
                src={LogoLarge}
                alt="cuniverse-logo"
                width={180}
                height={45}
              />
            </Link>
            <Link
              href="/"
              data-testid="header-anchor"
              className={commonStyles["small"]}
            >
              <ImageCuniverse
                src={LogoSmall}
                alt="cuniverse-logo"
                width={100}
                height={39}
              />
            </Link>
          </div>
          <div id="header-contents" className={commonStyles["header-contents"]}>
            <ButtonConnectWallet />
            {account ? (
              <ButtonHeader
                onClick={() => setDropdown({ open: true, id: "header-menu" })}
                testid="header-menu"
                id="header-menu"
                className={buttonStyles["header-menu"]}
              >
                <FiSmile />
              </ButtonHeader>
            ) : null}
          </div>
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
