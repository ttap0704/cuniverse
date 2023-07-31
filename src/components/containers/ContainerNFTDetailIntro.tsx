import Image from "next/image";
import BoxWhite from "../boxes/BoxWhite";

interface ContainerNFTDetailIntroProps {
  image: string;
  name: string;
  contract: { address: string; title: string };
  deployer: { address: string; nickname: string };
  owner: { address: string; nickname: string };
}

function ContainerNFTDetailIntro(props: ContainerNFTDetailIntroProps) {
  const image = props.image;
  const name = props.name;
  const contract = props.contract;
  const owner = props.owner;
  const deployer = props.deployer;

  return (
    <div className="container-nft-detail-intro">
      <div>
        <Image src={image} alt={name} fill={true} objectFit={"cover"} />
      </div>
      <BoxWhite>
        <h3>{contract.title.length > 0 ? contract.title : contract.address}</h3>
        <h2>{name}</h2>
        <div>
          <div>
            <h4>창작자</h4>
            <span>
              {deployer.nickname.length > 0
                ? deployer.nickname
                : deployer.address}
            </span>
          </div>
          <div>
            <h4>소유자</h4>
            <span>
              {owner.nickname.length > 0 ? owner.nickname : owner.address}
            </span>
          </div>
        </div>
      </BoxWhite>
    </div>
  );
}

export default ContainerNFTDetailIntro;
