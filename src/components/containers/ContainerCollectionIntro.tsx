import TypographyContentTitle from "../typography/TypographyContentTitle";
import TypographyContentDescription from "../typography/TypographyContentDescription";
import ContainerSeeMore from "./ContainerSeeMore";
import TypographyCopy from "../typography/TypographyCopy";
import { getShortAddress } from "@/utils/tools";
import etherSvg from "@/images/ethereum-eth-logo.svg";
import Image from "next/image";

interface ContainerCollectionIntroProps {
  name: string;
  contractAddress: string;
  description: string;
  totalSupply: number;
  owners: number;
  deployerAddress: string;
  symbol: string;
}

function ContainerCollectionIntro(props: ContainerCollectionIntroProps) {
  const {
    name,
    contractAddress,
    description,
    totalSupply,
    owners,
    deployerAddress,
    symbol,
  } = props;

  return (
    <div className="container-content-intro">
      <div className="nickname-wrapper">
        <TypographyContentTitle title={name} />
      </div>
      <div className="address-container">
        <div className="address-wrapper">
          <Image src={etherSvg} alt="ethereum-logo" width={16} height={16} />
          <TypographyCopy
            text={getShortAddress(contractAddress)}
            copyText={contractAddress}
            className="intro-address"
          />
        </div>
        <div className="address-wrapper">
          <Image src={etherSvg} alt="ethereum-logo" width={16} height={16} />
          <TypographyCopy
            text={getShortAddress(deployerAddress)}
            copyText={deployerAddress}
            className="intro-address"
          />
        </div>
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
          <span>소유자</span>
          <p>
            {owners.toLocaleString("euc-kr")}
            <span>명</span>
          </p>
        </div>
        <div className="count-divider" />
        <div>
          <span>Symbol</span>
          <p>{symbol}</p>
        </div>
      </div>
      <ContainerSeeMore defaultMaxHeight={50}>
        <TypographyContentDescription description={description} />
      </ContainerSeeMore>
    </div>
  );
}

export default ContainerCollectionIntro;
