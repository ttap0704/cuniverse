import ContainerNFTDetailIntro from "./ContainerNFTDetailIntro";
import { DEFAULT_PROFILE } from "../../../constants";
import BoxWithTitle from "../boxes/BoxWithTitle";
import ContainerSeeMore from "./ContainerSeeMore";
import BoxNFTPreview from "../boxes/BoxNFTPreview";

// NFT Detail 정보 표기

function ContainerNFTDetail(props: NFTDetail) {
  const data = props;

  const contractDescription = data.description || "";

  return (
    <div id="container-nft-detail">
      {!data.deployer.contractId ? (
        <p className="nft-notice">
          <span className="red">*</span>
          <span>
            플랫폼에 등록되지 않은 NFT입니다. (구매 및 컬렉션 조회{" "}
            <span className="red">불가</span>)
          </span>
        </p>
      ) : null}

      <ContainerNFTDetailIntro
        deployer={data.deployer}
        contract={{
          address: data.contract.address,
          title: data.contract.name ?? "",
        }}
        image={data.image ?? DEFAULT_PROFILE}
        owner={data.owners}
        name={data.name ?? data.tokenId}
        sale={data.sale}
      />
      {data.description ? (
        <BoxWithTitle title="소개" style={{ marginBottom: "2rem" }}>
          <ContainerSeeMore defaultMaxHeight={50}>
            <p>{contractDescription}</p>
          </ContainerSeeMore>
        </BoxWithTitle>
      ) : null}

      {data.attributes !== undefined && data.attributes.length > 0 ? (
        <BoxWithTitle
          className="nft-attributes"
          title="NFT 속성"
          style={{ marginBottom: "2rem" }}
        >
          <div>
            {data.attributes.map((attribute) => (
              <div key={`nft-attribute-${attribute.trait_type}`}>
                <span className="trait">{attribute.trait_type}</span>
                <span className="value">
                  <span>{attribute.value}</span>
                  {/* <span>
                    {(Number(attribute.prevalence) * 100).toFixed(2)}%
                  </span> */}
                </span>
              </div>
            ))}
          </div>
        </BoxWithTitle>
      ) : null}

      {data.moreNFTs.length > 0 ? (
        <BoxWithTitle title="MORE" style={{ marginBottom: "2rem" }}>
          <div className="more-nfts">
            <div>
              {data.moreNFTs.map((item) => {
                return (
                  <BoxNFTPreview
                    key={`more-nft-item-${item.tokenId}`}
                    item={item}
                    contractAddress={data.contract.address}
                    contractName={data.contract.name}
                  />
                );
              })}
            </div>
          </div>
        </BoxWithTitle>
      ) : null}
    </div>
  );
}

export default ContainerNFTDetail;
