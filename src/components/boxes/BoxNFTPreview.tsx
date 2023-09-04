"use client";

import Link from "next/link";
import ImageCuniverse from "../common/ImageCuniverse";
import Button from "../buttons/Button";
import { memo } from "react";

// NFT 리스트 Box
interface BoxNFTPreviewProps {
  item: NFTMetadata;
  contractAddress: string;
  contractName: string;
  sale?: boolean;
  onSale?: () => void;
  className?: string;
}

function BoxNFTPreview(props: BoxNFTPreviewProps) {
  const {
    item: nft,
    contractAddress,
    contractName,
    sale,
    onSale,
    className,
  } = props;

  const handleSale = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    e.preventDefault();
    if (onSale) onSale();
  };

  return (
    <div className={`box-nft-preview ${className ?? ""}`}>
      <Link
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
          <span>
            {contractName ?? "Untitled Collection"} (#{nft.tokenId})
          </span>
          {nft.price ? (
            <span className="nft-price">{nft.price} ETH</span>
          ) : null}
        </div>
      </Link>
      {sale ? (
        <Button className="button-nft-sale" onClick={handleSale}>
          {nft.price ? "판매중" : "판매하기"}
        </Button>
      ) : null}
    </div>
  );
}

export default memo(BoxNFTPreview, (prev, cur) => {
  return (
    prev.item.tokenId === cur.item.tokenId &&
    prev.contractAddress === cur.contractAddress &&
    prev.item.price === cur.item.price
  );
});
