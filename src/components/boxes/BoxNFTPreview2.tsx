import Link from "next/link";
import ImageCuniverse from "../common/ImageCuniverse";

// NFT 리스트 Box
interface BoxNFTPreviewProps {
  item: NFTMetadata;
  contractAddress: string;
  contractName: string;
}

function BoxNFTPreview(props: BoxNFTPreviewProps) {
  const { item: nft, contractAddress, contractName } = props;

  return (
    <Link
      className="box-nft-preview"
      href={`/assets?contract=${contractAddress}&tokenId=${nft.tokenId}`}
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
    </Link>
  );
}

export default BoxNFTPreview;
