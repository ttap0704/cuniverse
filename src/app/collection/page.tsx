import WrongApproach from "@/components/common/WrongApproach";
import ContainerBanner from "@/components/containers/ContainerBanner";
import ContainerProfileImage from "@/components/containers/ContainerProfileImage";
import { fetchGetCollectionDetail } from "@/utils/api";
import {
  CUNIVERSE_METADATA,
  CUNIVERSE_METADATA_LOGO_URL,
  DEFAULT_BANNER,
  DEFAULT_PROFILE,
} from "../../../constants";
import ContainerCollectionIntro from "@/components/containers/ContainerCollectionIntro";
import BoxNotice from "@/components/boxes/BoxNotice";
import ContainerNFTContents from "@/components/containers/ContainerNFTContents";
import BoxNFTPreview from "@/components/boxes/BoxNFTPreview";
import Tabs from "@/components/common/Tabs";
import { Metadata } from "next";

export const revalidate = 60;

type CollectionPageProps = {
  searchParams: { address: string };
};

export async function generateMetadata({
  searchParams,
}: CollectionPageProps): Promise<Metadata> {
  const address = searchParams["address"];

  if (!address) return CUNIVERSE_METADATA;

  const data = await fetchGetCollectionDetail(address);

  if (data) {
    return {
      title: data.name + " | Cuniverse",
      description: data.description,
      openGraph: {
        title: data.name + " | Cuniverse",
        description: data.description,
        images: [
          {
            url: data.profile ?? CUNIVERSE_METADATA_LOGO_URL,
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

const tabsItems: TabsMenuItem[] = [
  {
    id: 0,
    label: "Items",
    path: "/collection",
  },
];

async function CollectionIndex({
  searchParams,
}: {
  searchParams: { address: string };
}) {
  const contractAddress = searchParams.address;
  if (!contractAddress) return <WrongApproach />;

  const contractDetail = await fetchGetCollectionDetail(contractAddress);
  if (!contractDetail)
    return <WrongApproach text="플랫폼에 등록되지 않은 컬렉션입니다." />;

  return (
    <>
      <ContainerBanner
        defaultUri={contractDetail.banner ?? DEFAULT_BANNER}
        edit={false}
      />
      <ContainerProfileImage
        defaultUri={contractDetail.profile ?? DEFAULT_PROFILE}
        edit={false}
      />
      <ContainerCollectionIntro
        name={contractDetail.name}
        description={contractDetail.description}
        contractAddress={contractDetail.contractAddress}
        totalSupply={contractDetail.totalSupply}
        deployerAddress={contractDetail.deployerAddress}
        symbol={contractDetail.symbol}
      ></ContainerCollectionIntro>
      <Tabs items={tabsItems} />
      {!contractDetail.nfts || contractDetail.nfts.length == 0 ? (
        <BoxNotice text="생성된 NFT가 없습니다." />
      ) : (
        <ContainerNFTContents>
          {contractDetail.nfts.map((item, itemIdx) => {
            return (
              <BoxNFTPreview
                key={`account_nft_item_${itemIdx}`}
                item={item}
                contractAddress={contractAddress}
                contractName={contractDetail.name}
              />
            );
          })}
        </ContainerNFTContents>
      )}
    </>
  );
}

export default CollectionIndex;
