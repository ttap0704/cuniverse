import ContainerBanner from "@/components/containers/ContainerBanner";
import ContainerProfileImage from "@/components/containers/ContainerProfileImage";
import { DEFAULT_BANNER, DEFAULT_PROFILE } from "../../../constants";
import ContainerContentIntro from "@/components/containers/ContainerContentIntro";
import Tabs from "@/components/common/Tabs";
import { useSearchParams } from "next/navigation";
import WrongApproach from "@/components/common/WrongApproach";
import { use } from "react";
import { fetchGetCollectorInfo } from "@/utils/api";
import { headers } from "next/dist/client/components/headers";

function CollectorsLayout({ children }: { children: React.ReactNode }) {
  const xUrl = headers().get("x-url");

  let address = null;
  if (xUrl) {
    const url = new URL(`http://localhost${xUrl}`);
    const searchParams = new URLSearchParams(url.search);
    address = searchParams.get("address");
  }

  // // Query String으로 address 필수
  if (!address) return <WrongApproach />;
  const account = use(fetchGetCollectorInfo(address));

  // Collections 페이지 Tabs 데이터 정의
  const tabsItems: TabsMenuItem[] = [
    {
      id: 0,
      label: "Collections",
      path: `/collectors/collections?address=${address}`,
      includePath: "/collectors",
    },
    {
      id: 1,
      label: "Creations",
      path: `/collectors/creations?address=${address}`,
    },
  ];

  return (
    <>
      <ContainerBanner
        defaultUri={account && account.banner ? account.banner : DEFAULT_BANNER}
        edit={false}
      />
      <ContainerProfileImage
        defaultUri={
          account && account.profile ? account.profile : DEFAULT_PROFILE
        }
        edit={false}
      />
      <ContainerContentIntro
        account={account as Account}
        isLoading={false}
        self={false}
      />
      <Tabs items={tabsItems} />
      {children}
    </>
  );
}

export default CollectorsLayout;
