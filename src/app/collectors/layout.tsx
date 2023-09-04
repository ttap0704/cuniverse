import ContainerBanner from "@/components/containers/ContainerBanner";
import ContainerProfileImage from "@/components/containers/ContainerProfileImage";
import {
  CUNIVERSE_METADATA,
  CUNIVERSE_METADATA_LOGO_URL,
  DEFAULT_BANNER,
  DEFAULT_PROFILE,
} from "../../../constants";
import ContainerContentIntro from "@/components/containers/ContainerContentIntro";
import Tabs from "@/components/common/Tabs";
import { useSearchParams } from "next/navigation";
import WrongApproach from "@/components/common/WrongApproach";
import { use } from "react";
import { fetchGetCollectorInfo } from "@/utils/api";
import { headers } from "next/dist/client/components/headers";
import { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const xUrl = headers().get("x-url");

  let address = null;
  if (xUrl) {
    const url = new URL(`http://localhost${xUrl}`);
    const searchParams = new URLSearchParams(url.search);
    address = searchParams.get("address");
  }

  console.log({
    xUrl,
    address,
  });

  if (!address) return CUNIVERSE_METADATA;

  const account = await fetchGetCollectorInfo(address);

  if (account) {
    const title = account.nickname ?? "Unnamed" + " | Cuniverse";
    const description = account.description ?? "Cuniverse NFT Collector";
    const image = account.profile ?? CUNIVERSE_METADATA_LOGO_URL;
    return {
      title,
      description,
      openGraph: {
        title,
        description,
        images: [
          {
            url: image,
            width: 800,
            height: 400,
          },
        ],
        locale: "ko_KR",
        type: "website",
      },
    };
  } else {
    return CUNIVERSE_METADATA;
  }
}

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
      includePath: ["/collectors", "/collectors/collections"],
    },
    {
      id: 1,
      label: "Creations",
      path: `/collectors/creations?address=${address}`,
      includePath: ["/collectors/creations"],
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
