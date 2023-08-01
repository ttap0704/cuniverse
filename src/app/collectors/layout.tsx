"use client";

import ContainerBanner from "@/components/containers/ContainerBanner";
import ContainerProfileImage from "@/components/containers/ContainerProfileImage";
import { DEFAULT_BANNER, DEFAULT_PROFILE } from "../../../constants";
import ContainerContentIntro from "@/components/containers/ContainerContentIntro";
import Tabs from "@/components/common/Tabs";
import { useSearchParams } from "next/navigation";
import WrongApproach from "@/components/common/WrongApproach";
import useCollectorQuery from "@/queries/useCollectorQuery";

const tabsItems: TabsMenuItem[] = [
  {
    id: 0,
    label: "Collections",
    path: "/collectors/collections",
    includePath: "/collectors",
  },
  { id: 1, label: "Creations", path: "/collectors/creations" },
];

function CollectorsLayout({ children }: { children: React.ReactNode }) {
  const searchParams = useSearchParams();
  const address = searchParams.get("address");
  if (!address) return <WrongApproach />;

  const { data: account } = useCollectorQuery(address);

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
      <ContainerContentIntro address={address} />
      <Tabs items={tabsItems} />
      {children}
    </>
  );
}

export default CollectorsLayout;
