import { HiOutlinePhoto } from "react-icons/hi2";
import { S3_IMAGES_URL } from "../../../constants";
import Image from "next/image";
import Link from "next/link";
import ImageCuniverse from "../common/ImageCuniverse";

interface BoxNFTCollectionProps extends ContractDetail {
  className?: string;
}

function BoxNFTCollection(props: BoxNFTCollectionProps) {
  const { name, profile, banner, contractAddress, className } = props;

  return (
    <Link
      className={`box-nft-collection ${className ?? ""}`}
      href={`/collection?address=${contractAddress}`}
    >
      <div className="collection-banner">
        {banner ? (
          <ImageCuniverse
            src={`${S3_IMAGES_URL}/images/${banner}`}
            alt={`${name}-banner`}
            objectFit="cover"
            fill={true}
          />
        ) : (
          <HiOutlinePhoto />
        )}
      </div>
      <div className="collection-intro">
        <div>
          {profile ? (
            <ImageCuniverse
              src={`${S3_IMAGES_URL}/images/${profile}`}
              alt={`${name}-profile`}
              objectFit="cover"
              fill={true}
            />
          ) : (
            <HiOutlinePhoto />
          )}
        </div>
        <h3>{name}</h3>
      </div>
    </Link>
  );
}

export default BoxNFTCollection;
