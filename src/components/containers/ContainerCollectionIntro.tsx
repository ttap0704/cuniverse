import TypographyContentTitle from "../typography/TypographyContentTitle";
import TypographyContentDescription from "../typography/TypographyContentDescription";
import ContainerSeeMore from "./ContainerSeeMore";
import TypographyCopy from "../typography/TypographyCopy";
import { getShortAddress } from "@/utils/tools";
import etherSvg from "@/images/ethereum-eth-logo.svg";
import Image from "next/image";
import ImageCuniverse from "../common/ImageCuniverse";

interface ContainerCollectionIntroProps {
  name: string;
  contractAddress: string;
  description: string;
  totalSupply: number;
  deployerAddress: string;
  symbol: string;
}

function ContainerCollectionIntro(props: ContainerCollectionIntroProps) {
  const {
    name,
    contractAddress,
    description,
    totalSupply,
    deployerAddress,
    symbol,
  } = props;

  return (
    <div className="container-content-intro">
      <div className="nickname-wrapper">
        <TypographyContentTitle title={name} />
      </div>
      <div className="count-wrapper">
        <div>
          <span>NFT</span>
          <p>
            {totalSupply.toLocaleString("euc-kr")}
            <span>개</span>
          </p>
        </div>
        <div className="count-divider" />
        <div>
          <span>Symbol</span>
          <p>{symbol}</p>
        </div>
      </div>
      <div className="address-container">
        <div className="address-wrapper with-title">
          <span>콘트랙트</span>
          <div>
            <ImageCuniverse
              src={etherSvg}
              alt="ethereum-logo"
              width={16}
              height={16}
            />
            <TypographyCopy
              text={getShortAddress(contractAddress)}
              copyText={contractAddress}
              className="intro-address"
            />
          </div>
        </div>
        <div className="address-wrapper with-title">
          <span>창작자</span>
          <div>
            <ImageCuniverse
              src={etherSvg}
              alt="ethereum-logo"
              width={16}
              height={16}
            />
            <TypographyCopy
              text={getShortAddress(deployerAddress)}
              copyText={deployerAddress}
              className="intro-address"
            />
          </div>
        </div>
      </div>

      <ContainerSeeMore defaultMaxHeight={50}>
        <TypographyContentDescription description={description} />
      </ContainerSeeMore>
    </div>
  );
}

export default ContainerCollectionIntro;
