"use client";

import ContainerBanner from "@/components/containers/ContainerBanner";
import ContainerProfileImage from "@/components/containers/ContainerProfileImage";
import useAccountQuery from "@/queries/useAccountQuery";
import { DEFAULT_BANNER, DEFAULT_PROFILE } from "../../../constants";
import ContainerContentIntro from "@/components/containers/ContainerContentIntro";
import Tabs from "@/components/common/Tabs";
import { usePathname } from "next/navigation";

// Tabs 아이템 정의
const tabsItems: TabsMenuItem[] = [
  {
    id: 0,
    label: "Collections",
    path: "/account/collections",
    includePath: "/account",
  },
  { id: 1, label: "Creations", path: "/account/creations" },
];

// /accounts/* Layout
function AccountLayout({ children }: { children: React.ReactNode }) {
  const { data: account } = useAccountQuery();
  const pathname = usePathname();

  // settings 페이지에서는 Layout 필요 없으므로 예외처리
  if (["/account/settings"].includes(pathname)) return <>{children}</>;

  return (
    <>
      <ContainerBanner
        defaultUri={account && account.banner ? account.banner : DEFAULT_BANNER}
        edit={true}
      />
      <ContainerProfileImage
        defaultUri={
          account && account.profile ? account.profile : DEFAULT_PROFILE
        }
        edit={true}
      />
      <ContainerContentIntro />
      <Tabs items={tabsItems} />
      {children}
    </>
  );
}

export default AccountLayout;
