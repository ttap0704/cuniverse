import { HiOutlinePhoto } from "react-icons/hi2";
import { S3_IMAGES_URL } from "../../../constants";
import Image from "next/image";
import Link from "next/link";

function BoxNFTCollection(props: ContractDetail) {
  const { name, profile, banner, contractAddress } = props;

  return (
    <Link
      className="box-nft-collection"
      href={`/collection?address=${contractAddress}`}
    >
      <div className="collection-banner">
        {banner ? (
          <Image
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
            <Image
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
