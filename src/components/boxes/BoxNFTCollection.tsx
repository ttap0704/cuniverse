import { HiOutlinePhoto } from "react-icons/hi2";
import { S3_IMAGES_URL } from "../../../constants";
import Link from "next/link";
import ImageCuniverse from "../common/ImageCuniverse";
import boxStyles from "@/css/components/boxes.module.scss";

interface BoxNFTCollectionProps extends ContractDetail {
  className?: string;
}

function BoxNFTCollection(props: BoxNFTCollectionProps) {
  const { name, profile, banner, contractAddress } = props;

  const className = props.className ?? "";

  return (
    <Link
      className={`${boxStyles["box-nft-collection"]} ${className}`}
      href={`/collection?address=${contractAddress}`}
    >
      <div className={boxStyles["collection-banner"]}>
        {banner ? (
          <ImageCuniverse
            src={`${S3_IMAGES_URL}/images/${banner}`}
            alt={`${name}-banner`}
            width={576}
            height={576 * 0.75}
          />
        ) : (
          <HiOutlinePhoto />
        )}
      </div>
      <div className={boxStyles["collection-intro"]}>
        <div>
          {profile ? (
            <ImageCuniverse
              src={`${S3_IMAGES_URL}/images/${profile}`}
              alt={`${name}-profile`}
              width={64}
              height={64}
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
