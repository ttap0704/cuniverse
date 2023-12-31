import BoxNFTCollection from "@/components/boxes/BoxNFTCollection";
import BoxNFTPreview from "@/components/boxes/BoxNFTPreview";
import BoxNotice from "@/components/boxes/BoxNotice";
import BoxWhite from "@/components/boxes/BoxWhite";
import ContainerHomeBanner from "@/components/containers/ContainerHomeBanner";
import TypographyHomeContentsTitle from "@/components/typography/TypographyHomeContentsTitle";
import {
  fetchGetBanners,
  fetchGetContractsList,
  fetchGetSalesList,
} from "@/utils/api";
import { use } from "react";
import boxStyles from "@/css/components/boxes.module.scss";

export const dynamic = "force-dynamic";

function Home() {
  const banners = use(fetchGetBanners());
  const NFTs = use(fetchGetSalesList());
  const contracts = use(fetchGetContractsList());

  return (
    <>
      <ContainerHomeBanner banners={banners} />
      <br />
      <br />
      <TypographyHomeContentsTitle title="판매중 NFT" />
      <BoxWhite
        style={{ overflowX: "auto", justifyContent: "flex-start", gap: "1rem" }}
      >
        {NFTs.length == 0 ? (
          <BoxNotice text="판매중인 NFT가 없습니다." />
        ) : (
          NFTs.map((item, itemIdx) => {
            return (
              <BoxNFTPreview
                key={`account_nft_item_${itemIdx}`}
                item={item}
                contractAddress={item.contract ? item.contract.address : ""}
                contractName={item.title ? item.title : ""}
                className={boxStyles["list"]}
              />
            );
          })
        )}
      </BoxWhite>
      <br />
      <br />
      <TypographyHomeContentsTitle title="신규 컬렉션" />
      <BoxWhite
        style={{ overflowX: "auto", justifyContent: "flex-start", gap: "1rem" }}
      >
        {contracts.map((contract) => {
          return (
            <BoxNFTCollection
              key={`contract-${contract.id}`}
              {...contract}
              className={boxStyles["list"]}
            />
          );
        })}
      </BoxWhite>
    </>
  );
}
export default Home;
