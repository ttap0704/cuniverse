"use client";

import useAccountQuery from "@/queries/useAccountQuery";
import Button from "./Button";
import CuniverseHub from "@/contracts/CuniverseHub.json";
import ethersBrowserProvider from "@/utils/ethersBrowserProvider";
import { Contract, ethers } from "ethers";
import { CUNIVERSE_HUB_ADDRESS } from "../../../constants";
import { useState } from "react";
import { fetchUpdateAccountSales } from "@/utils/api";
import { useSetAtom } from "jotai";
import { setModalAlertAtom } from "@/store/modalAlert";
import buttonStyles from "@/css/components/buttons.module.scss";
import LoadingWaterDrop from "../common/LoadingWaterDrop";

interface ButtonNFTBuyProps {
  disabled: boolean;
  sale: SalesDetail | null;
  owner: string;
}

function ButtonNFTBuy(props: ButtonNFTBuyProps) {
  const { disabled, sale, owner } = props;
  const { data: account } = useAccountQuery();
  const setModalAlert = useSetAtom(setModalAlertAtom);

  const [isBuying, setIsBuying] = useState(false);
  const [complete, setComplete] = useState(false);

  const buyNFT = async () => {
    if (
      !isBuying &&
      !complete &&
      sale &&
      account &&
      ethersBrowserProvider.provider
    ) {
      setIsBuying(true);
      const signer = await ethersBrowserProvider.provider.getSigner();
      const contract = new Contract(
        CUNIVERSE_HUB_ADDRESS,
        CuniverseHub.abi,
        signer
      );

      // 구매 계약 실행
      try {
        const transferTx = await contract.proceedOrder(
          owner,
          sale.contractAddress,
          `${sale.tokenId}`,
          ethers.parseEther(`${sale.price}`).toString(),
          sale.startTime,
          sale.endTime,
          sale.v,
          sale.r,
          sale.s,
          { value: ethers.parseEther(`${sale.price}`).toString() }
        );
        await transferTx.wait();

        const updateRes = await fetchUpdateAccountSales({
          data: {
            accountId: sale.accountId,
            contractAddress: sale.contractAddress,
            tokenId: sale.tokenId,
            completedAt: new Date().getTime(),
          },
        });

        if (updateRes) {
          setModalAlert({
            type: "success",
            text: "축하합니다!\n성공적으로 NFT를 구매하였습니다.",
            open: true,
          });
          setComplete(true);
        } else {
          setModalAlert({
            type: "error",
            text: "NFT 구매에 실패하였습니다.\n다시 시도해주세요.",
            open: true,
          });
        }
      } catch (err) {
        console.log({ err });
        setModalAlert({
          type: "error",
          text: "NFT 구매에 실패하였습니다.\n다시 시도해주세요.",
          open: true,
        });
      }

      setIsBuying(false);
    } else {
      if (!account) {
        setModalAlert({
          type: "error",
          text: "로그인 후에 구매해주세요.",
          open: true,
        });
      }
    }
  };

  return (
    <Button
      onClick={buyNFT}
      className={buttonStyles["button-nft-buy"]}
      disabled={disabled || complete}
    >
      {isBuying ? <LoadingWaterDrop /> : null}
      {complete ? "COMPLETE" : "BUY"}
    </Button>
  );
}

export default ButtonNFTBuy;
