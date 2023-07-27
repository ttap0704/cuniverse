import useAccountQuery from "@/queries/useAccountQuery";
import TypographyContentTitle from "../typography/TypographyContentTitle";
import TypographyContentDescription from "../typography/TypographyContentDescription";
import ContainerSeeMore from "./ContainerSeeMore";
import TypographyCopy from "../typography/TypographyCopy";
import { getShortAddress } from "@/utils/tools";
import etherSvg from "@/images/ethereum-eth-logo.svg";
import Image from "next/image";

function ContainerContentIntro() {
  const { data: account } = useAccountQuery();

  return (
    <div className="container-content-intro">
      <TypographyContentTitle
        title={account?.nickname ? account.nickname : "Unnamed"}
      />
      <div className="address-wrapper">
        <Image src={etherSvg} alt="ethereum-logo" width={16} height={16} />
        <TypographyCopy
          text={account?.address ? getShortAddress(account.address) : ""}
          copyText={account?.address ?? ""}
          className="intro-address"
        />
        <span className="joined">Joined {account?.createdAt}</span>
      </div>
      <ContainerSeeMore defaultMaxHeight={50}>
        <TypographyContentDescription
          description={account?.description ? account.description : ""}
        />
      </ContainerSeeMore>
    </div>
  );
}

export default ContainerContentIntro;
