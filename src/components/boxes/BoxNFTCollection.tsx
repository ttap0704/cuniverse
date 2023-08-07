import { HiOutlinePhoto } from "react-icons/hi2";
import { S3_IMAGES_URL } from "../../../constants";
import Image from "next/image";

function BoxNFTCollection(props: ContractDetail) {
  const { name, profile, banner } = props;

  return (
    <div className="box-nft-collection">
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
    </div>
  );
}

export default BoxNFTCollection;
