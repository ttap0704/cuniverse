import BoxWhite from "../boxes/BoxWhite";
import Divider from "../common/Divider";
import { getShortAddress } from "@/utils/tools";
import Link from "next/link";
import ImageCuniverse from "../common/ImageCuniverse";
import ButtonNFTBuy from "../buttons/ButtonNFTBuy";

interface ContainerNFTDetailIntroProps {
  image: string;
  name: string;
  contract: { address: string; title: string };
  deployer: { address: string; nickname: string };
  owner: { address: string; nickname: string };
  sale: SalesDetail | null;
  royalty: number;
}

function ContainerNFTDetailIntro(props: ContainerNFTDetailIntroProps) {
  const { image, name, contract, owner, deployer, sale, royalty } = props;
  const now = new Date().getTime();
  const isSale =
    sale && sale.startTime * 1000 <= now && sale.endTime * 1000 >= now;

  let time: string | null = null;
  let timeText = "";
  if (isSale) {
    time = new Date(sale.endTime * 1000).toLocaleString("euc-kr");
    timeText = "판매 종료";
  } else if (sale && sale.startTime * 1000 > now) {
    time = new Date(sale.startTime * 1000).toLocaleString("euc-kr");
    timeText = "판매 시작";
  }

  return (
    <div className="container-nft-detail-intro">
      <div className="nft-detail-image-wrapper">
        <ImageCuniverse src={image} alt={name} fill={true} objectFit="cover" />
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
            <Link href={`/collector?address=${deployer.address}`}>
              {deployer.nickname !== null
                ? deployer.nickname
                : getShortAddress(deployer.address)}
            </Link>
          </div>
          <div>
            <h4>소유자</h4>
            <Link href={`/collectors?address=${owner.address}`}>
              {owner.nickname !== null
                ? owner.nickname
                : getShortAddress(owner.address)}
            </Link>
          </div>
          <div>
            <h4>창작자 수익</h4>
            <span>{royalty}%</span>
          </div>
        </div>
        <Divider />
        <div className="sale-box">
          {time ? (
            <div>
              <span>{timeText}</span>
              <span>{time}</span>
            </div>
          ) : null}
          <div>
            <span>판매 금액</span>
            <span>
              {isSale ? sale.price + " ETH" : "판매중인 상품이 아닙니다."}
            </span>
          </div>

          <ButtonNFTBuy
            disabled={isSale ? false : true}
            sale={sale}
            owner={owner.address}
          />
        </div>
        <Divider />
      </BoxWhite>
    </div>
  );
}

export default ContainerNFTDetailIntro;
