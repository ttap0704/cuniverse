import WrongApproach from "@/components/common/WrongApproach";
import ContainerBanner from "@/components/containers/ContainerBanner";
import ContainerProfileImage from "@/components/containers/ContainerProfileImage";
import { fetchGetCollectionDetail } from "@/utils/api";
import { headers } from "next/dist/client/components/headers";
import { DEFAULT_BANNER, DEFAULT_PROFILE } from "../../../constants";
import ContainerCollectionIntro from "@/components/containers/ContainerCollectionIntro";
import BoxNotice from "@/components/boxes/BoxNotice";
import ContainerNFTContents from "@/components/containers/ContainerNFTContents";
import BoxNFTPreview from "@/components/boxes/BoxNFTPreview";
import { OwnedNftsResponse } from "alchemy-sdk";
import Tabs from "@/components/common/Tabs";

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
  if (!contractDetail) return <WrongApproach />;

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
        owners={contractDetail.owners}
        totalSupply={contractDetail.totalSupply}
        deployerAddress={contractDetail.deployerAddress}
        symbol={contractDetail.symbol}
      ></ContainerCollectionIntro>
      <Tabs items={tabsItems} />
      {!contractDetail.nfts || contractDetail.nfts.length == 0 ? (
        <BoxNotice text="No Items" />
      ) : (
        <ContainerNFTContents>
          {(contractDetail.nfts as OwnedNftsResponse["ownedNfts"]).map(
            (item, itemIdx) => {
              console.log(item);
              return (
                <BoxNFTPreview
                  key={`account_nft_item_${itemIdx}`}
                  item={item}
                />
              );
            }
          )}
        </ContainerNFTContents>
      )}
    </>
  );
}

export default CollectionIndex;
