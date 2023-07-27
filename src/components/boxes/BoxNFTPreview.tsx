import { OwnedNft } from "alchemy-sdk";
import Image from "next/image";

interface BoxNFTPreviewProps {
  item: OwnedNft;
}

function BoxNFTPreview(props: BoxNFTPreviewProps) {
  const nft = props.item;

  return (
    <div className="box-nft-preview">
      <div className="preview-image-wrapper">
        {nft.rawMetadata && nft.rawMetadata.image ? (
          <Image
            src={nft.rawMetadata.image}
            alt={nft.rawMetadata.name ?? ""}
            fill={true}
          />
        ) : (
          <div></div>
        )}
      </div>
      <div className="preview-info">
        <span>{nft.title.length == 0 ? nft.tokenId : nft.title}</span>
        <span>{nft.contract.name ?? "Untitled Collection"}</span>
      </div>
    </div>
  );
}

export default BoxNFTPreview;
