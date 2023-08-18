import { OwnedNft } from "alchemy-sdk";
import Image from "next/image";
import Link from "next/link";
import ImageCuniverse from "../common/ImageCuniverse";

// NFT 리스트 Box
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
        {/* NFT Raw Metadata 여부에 따른 UI 분리 */}
        {nft.rawMetadata && nft.rawMetadata.image ? (
          <ImageCuniverse
            src={nft.rawMetadata.image}
            alt={nft.rawMetadata.name ?? ""}
            fill={true}
          />
        ) : nft.contract.openSea && nft.contract.openSea.imageUrl ? (
          <ImageCuniverse
            src={nft.contract.openSea.imageUrl}
            alt={nft.contract.openSea.collectionName ?? ""}
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
