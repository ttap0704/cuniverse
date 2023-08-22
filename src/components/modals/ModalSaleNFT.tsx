"use client";

import Divider from "../common/Divider";
import ModalConfirm from "./ModalConfirm";
import ImageCuniverse from "../common/ImageCuniverse";
import { useEffect, useState } from "react";
import useEtherPriceQuery from "@/queries/useEtherPriceQuery";
import InputWithLabel from "../inputs/InputWithLabel";
import validations from "@/utils/validations";
import InputDateTimeWithLabel from "../inputs/InputDateTimeWithLabel";
import Decimal from "decimal.js";
import { useSetAtom } from "jotai";
import { setModalAlertAtom } from "@/store/modalAlert";
import ethersBrowserProvider from "@/utils/ethersBrowserProvider";
import { Contract } from "ethers";
import NFTJson from "@/contracts/NFT.json";
import {
  NFT_SALE_SIGN_TEXT1,
  NFT_SALE_SIGN_TEXT2,
  NFT_SALE_SIGN_TEXT3,
  NFT_SALE_SIGN_TEXT4,
  NFT_SALE_SIGN_TEXT5,
  SUPER_ADMIN_ADDRESS,
} from "../../../constants";
import useAccountQuery from "@/queries/useAccountQuery";
import { fetchInsertSales } from "@/utils/api";

interface ModalSaleNFTProps {
  open: boolean;
  onClose: () => void;
  item: ModalSaleNFTItem;
}

function ModalSaleNFT(props: ModalSaleNFTProps) {
  const { open, onClose, item: NFT } = props;
  const { image, name } = NFT;
  const { data: account } = useAccountQuery();
  const { data: etherPrice } = useEtherPriceQuery();
  const setModalAlert = useSetAtom(setModalAlertAtom);

  const [price, setPrice] = useState({
    text: 0,
    error: false,
  });
  const [wonPrice, setWonPrice] = useState("0");
  const [period, setPeriod] = useState(new Date().getTime());
  const [saleFee, setSaleFee] = useState(2.5);
  const [finalFee, setFinalFee] = useState("0");
  const [finalEarning, setFinalEarning] = useState("0");

  useEffect(() => {
    if (!open) {
      setPrice({ text: 0, error: false });
      setWonPrice("0");
      setFinalEarning("0");
    }
  }, [open]);

  const handlePrice = (text: StringOrNumber, error: boolean) => {
    const splitedText = `${text}`.split(".");
    let finalPriceText = "";
    if (splitedText[0]) finalPriceText = `${Number(splitedText[0])}`;
    if (splitedText[1]) finalPriceText += "." + `${splitedText[1]}`;

    setPrice({ text: Number(finalPriceText), error });
    if (etherPrice) {
      setWonPrice(
        Number((Number(finalPriceText) * etherPrice).toFixed(0)).toLocaleString(
          "euc-kr"
        )
      );
    }

    if (`${finalPriceText}`.length > 0) {
      const curPrice = new Decimal(finalPriceText);
      const totalFee = curPrice.mul(saleFee / 100);

      setFinalFee(totalFee.toString());
      setFinalEarning(curPrice.minus(totalFee).toString());
    } else {
      setFinalEarning("0");
    }
  };

  const handlePeriod = (date: number) => {
    setPeriod(date);
  };

  const createNFTSale = async () => {
    if (price.error || price.text === 0) {
      setModalAlert({
        open: true,
        type: "error",
        text: "올바른 가격을 입력해주세요.",
      });
      return;
    }

    if (period == 0) {
      setModalAlert({
        open: true,
        type: "error",
        text: "정확한 판매 기간을 입력해주세요.",
      });
      return;
    } else if (period < new Date().getTime()) {
      setModalAlert({
        open: true,
        type: "error",
        text: "판매 기간을 현재시간 이후의 시간으로 설정해주세요.",
      });
      return;
    }

    if (ethersBrowserProvider.provider && account) {
      const signer = await ethersBrowserProvider.provider.getSigner();
      const contract = new Contract(NFT.contractAddress, NFTJson.abi, signer);

      let approval = false;
      try {
        // 플랫폼이 해당 컬렉션의 전송권한이 부여되어있는지 확인
        const check: boolean = await (contract.isApprovedForAll as any)(
          account?.address,
          SUPER_ADMIN_ADDRESS
        );

        approval = check;
      } catch (err) {
        console.log("isApprovedForAllError:", err);
      }

      if (!approval) {
        try {
          // 해당 컬렉션의 전송권한 부여
          const setApprovalForAllTx = await (contract.setApprovalForAll as any)(
            SUPER_ADMIN_ADDRESS,
            true
          );

          await setApprovalForAllTx.wait();
        } catch (err) {
          console.log("setApprovalForAllError:", err);
        }
      }

      try {
        // NFT 판매에 관한 Sign
        const signText =
          NFT_SALE_SIGN_TEXT1 +
          NFT_SALE_SIGN_TEXT2 +
          price.text +
          " ETH\n" +
          NFT_SALE_SIGN_TEXT3 +
          NFT.contractAddress +
          "\n" +
          NFT_SALE_SIGN_TEXT4 +
          NFT.tokenId +
          "\n" +
          NFT_SALE_SIGN_TEXT5 +
          signer.address;

        const token = await signer.signMessage(signText);

        const r = token.slice(0, 66);
        const s = "0x" + token.slice(66, 130);
        const v = parseInt(token.slice(130, 132), 16);

        const data: SalesDetail = {
          accountId: account.id,
          contractAddress: NFT.contractAddress,
          tokenId: NFT.tokenId,
          fee: finalFee,
          earning: finalEarning,
          price: `${price.text}`,
          endTime: period / 1000,
          r,
          s,
          v,
        };

        const createRes = await fetchInsertSales(data);
        if (createRes) {
          console.log("성공");
        } else {
          console.log("실패");
        }
      } catch (err) {
        console.log(err);
      }
    }

    // onClose();
  };

  return (
    <ModalConfirm
      title="NFT 판매등록"
      onConfirm={createNFTSale}
      open={open}
      buttonText="등록"
      onClose={onClose}
      useLoading={true}
    >
      <div className="modal-sale-nft-contents">
        <div className="nft-intro">
          <div>
            <ImageCuniverse
              src={image}
              alt={name}
              fill={true}
              objectFit="cover"
            />
          </div>
          <div>
            <h3>{NFT.name}</h3>
            <span>
              {NFT.contractName} (#{NFT.tokenId})
            </span>
          </div>
          <div>
            <span>판매금액</span>
            <span>{price.text} ETH</span>
            <span>{wonPrice} 원</span>
          </div>
        </div>
        <Divider />
        <div className="nft-form">
          <InputWithLabel
            labelText="가격 (ETH)"
            value={price.text}
            type="number"
            id="nft-price"
            dataKey="nft-price"
            required={true}
            onChange={handlePrice}
            direct={true}
            validation={validations["NFTPrice"]}
          />
          <InputDateTimeWithLabel
            labelText="기간"
            date={new Date().toISOString().slice(0, 16)}
            id="nft-period"
            onChange={handlePeriod}
          />
        </div>
        <Divider />
        <div className="nft-sale-info">
          <div>
            <span>판매 금액(ETH)</span>
            <span>{price.text} ETH</span>
          </div>
          <div>
            <span>판매 수수료</span>
            <span>{saleFee}%</span>
          </div>
          <div>
            <span>총 판매 수익(ETH)</span>
            <span className="final-earning">{finalEarning.toString()} ETH</span>
          </div>
        </div>
      </div>
    </ModalConfirm>
  );
}

export default ModalSaleNFT;
