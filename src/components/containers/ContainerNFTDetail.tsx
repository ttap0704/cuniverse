import ContainerNFTDetailIntro from "./ContainerNFTDetailIntro";
import { DEFAULT_PROFILE, ZERO_ADDRESS } from "../../../constants";
import BoxWithTitle from "../boxes/BoxWithTitle";
import ContainerSeeMore from "./ContainerSeeMore";
import BoxNFTPreview from "../boxes/BoxNFTPreview";
import { getShortAddress } from "@/utils/tools";
import Table from "../table/Table";

// NFT Detail 정보 표기

function ContainerNFTDetail(props: NFTDetail) {
  const data = props;

  const contractDescription = data.description || "";

  const tableItems: TableBodyProps[] = data.logs.map((log) => {
    return {
      name: {
        mode: "text",
        value: log.from == ZERO_ADDRESS ? "Mint" : "Transfer",
      },
      hash: {
        mode: "copy",
        value: getShortAddress(log.hash),
        copyText: log.hash,
      },
      from: {
        mode: "copy",
        value: getShortAddress(log.from),
        copyText: log.from,
      },
      to: {
        mode: "copy",
        value: getShortAddress(log.to),
        copyText: log.to,
      },
    };
  });

  return (
    <div id="container-nft-detail">
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
        royalty={data.royalty / 100}
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

      <BoxWithTitle
        title="이벤트 로그"
        style={{ marginBottom: "2rem" }}
        className="nft-logs"
      >
        <Table
          keys={["name", "hash", "from", "to"]}
          items={tableItems}
          titles={{ name: "", hash: "이벤트", from: "From", to: "To" }}
          width={{ name: 0.16, hash: 0.28, from: 0.28, to: 0.28 }}
        />
      </BoxWithTitle>

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
