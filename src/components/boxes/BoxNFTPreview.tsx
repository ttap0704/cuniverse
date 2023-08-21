"use client";

import Link from "next/link";
import ImageCuniverse from "../common/ImageCuniverse";
import Button from "../buttons/Button";

// NFT 리스트 Box
interface BoxNFTPreviewProps {
  item: NFTMetadata;
  contractAddress: string;
  contractName: string;
  sale?: boolean;
  onSale?: () => void;
}

function BoxNFTPreview(props: BoxNFTPreviewProps) {
  const { item: nft, contractAddress, contractName, sale, onSale } = props;

  const handleSale = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    if (onSale) onSale();
  };

  return (
    <Link
      className="box-nft-preview"
      href={`/assets?contract=${contractAddress}&token-id=${nft.tokenId}`}
    >
      <div className="preview-image-wrapper">
        {/* NFT Raw Metadata 여부에 따른 UI 분리 */}
        {nft && nft.image ? (
          <ImageCuniverse src={nft.image} alt={nft.name ?? ""} fill={true} />
        ) : (
          <div></div>
        )}
      </div>
      <div className="preview-info">
        <span>
          {!nft.name || nft.name.length == 0 ? nft.tokenId : nft.name}
        </span>
        <span>{contractName ?? "Untitled Collection"}</span>
      </div>
      {sale ? (
        <Button className="button-nft-sale" onClick={handleSale}>
          판매하기
        </Button>
      ) : null}
    </Link>
  );
}

export default BoxNFTPreview;
