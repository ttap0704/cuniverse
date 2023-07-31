import { OwnedNft } from "alchemy-sdk";
import Image from "next/image";
import Link from "next/link";

interface BoxNFTPreviewProps {
  item: OwnedNft;
}

function BoxNFTPreview(props: BoxNFTPreviewProps) {
  const nft = props.item;

  return (
    <Link
      className="box-nft-preview"
      href={`/assets?contract=${nft.contract.address}&tokenId=${nft.tokenId}`}
    >
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
    </Link>
  );
}

export default BoxNFTPreview;
