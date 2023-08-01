import Image from "next/image";
import BoxWhite from "../boxes/BoxWhite";
import Divider from "../common/Divider";
import { getShortAddress } from "@/utils/tools";
import Link from "next/link";

interface ContainerNFTDetailIntroProps {
  image: string;
  name: string;
  contract: { address: string; title: string };
  deployer: { address: string; nickname: string };
  owner: { address: string; nickname: string };
  sale: { end_time: string; price: number } | null;
}

function ContainerNFTDetailIntro(props: ContainerNFTDetailIntroProps) {
  const image = props.image;
  const name = props.name;
  const contract = props.contract;
  const owner = props.owner;
  const deployer = props.deployer;
  const sale = props.sale;

  return (
    <div className="container-nft-detail-intro">
      <div className="nft-detail-image-wrapper">
        <Image src={image} alt={name} fill={true} objectFit={"cover"} />
      </div>
      <BoxWhite>
        <h2>
          {contract.title.length > 0
            ? contract.title
            : getShortAddress(contract.address)}
        </h2>
        <h1>{name}</h1>
        <div className="info-box">
          <div>
            <h4>창작자</h4>
            <span>
              {deployer.nickname !== null
                ? deployer.nickname
                : getShortAddress(deployer.address)}
            </span>
          </div>
          <div>
            <h4>소유자</h4>
            <Link href={`/collectors?address=${owner.address}`}>
              {owner.nickname !== null
                ? owner.nickname
                : getShortAddress(owner.address)}
            </Link>
          </div>
        </div>
        <Divider />
        <div className="sale-box">
          <div>
            <span>판매 금액</span>
            <span>
              {sale ? sale.price + " ETH" : "판매중인 상품이 아닙니다."}
            </span>
          </div>
          <button disabled={sale ? false : true}>BUY</button>
        </div>
        <Divider />
      </BoxWhite>
    </div>
  );
}

export default ContainerNFTDetailIntro;
