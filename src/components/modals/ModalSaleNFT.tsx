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
import { Contract, hashMessage, solidityPackedKeccak256 } from "ethers";
import NFTJson from "@/contracts/NFT.json";
import {
  CUNIVERSE_HUB_ADDRESS,
  NETWORK_SEPOLIA,
  NFT_SALE_SIGN_TEXT1,
  NFT_SALE_SIGN_TEXT2,
  NFT_SALE_SIGN_TEXT3,
  NFT_SALE_SIGN_TEXT4,
  NFT_SALE_SIGN_TEXT5,
  SUPER_ADMIN_ADDRESS,
} from "../../../constants";
import useAccountQuery from "@/queries/useAccountQuery";
import {
  fetchGetContractSpecificMetadata,
  fetchInsertSales,
} from "@/utils/api";
import useAccountSalesCreateMutation from "@/queries/useAccountSalesCreateMutation";

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
  const { mutate: createSaleMutate } = useAccountSalesCreateMutation();
  const setModalAlert = useSetAtom(setModalAlertAtom);

  const [price, setPrice] = useState({
    text: 0,
    error: false,
  });
  const [wonPrice, setWonPrice] = useState("0");
  const [startTime, setStartTime] = useState(new Date().getTime());
  const [endTime, setEndTime] = useState(new Date().getTime());
  const [saleFee, setSaleFee] = useState(2.5);
  const [creatorFee, setCreatorFee] = useState(0);
  // const [finalFee, setFinalFee] = useState("0");
  const [finalEarning, setFinalEarning] = useState("0");
  // const [finalCreatorEarning, setFinalCreatorEarning] = useState("0");

  useEffect(() => {
    if (!open) {
      setPrice({ text: 0, error: false });
      setWonPrice("0");
      setFinalEarning("0");
      // setFinalCreatorEarning("0");
      setCreatorFee(0);
    } else {
      getCreatorFee();
    }
  }, [open]);

  const getCreatorFee = async () => {
    const data = await fetchGetContractSpecificMetadata(
      `contract-address=${NFT.contractAddress}&needs=royaltyInfo&royaltyInfo-args=${NFT.tokenId},10000`
    );

    if (data && data["royaltyInfo"]) {
      setCreatorFee(Number(data["royaltyInfo"][1]) / 100);
    }
  };

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
      const creatorEarning = curPrice.mul(creatorFee / 100);

      // setFinalFee(totalFee.toString());
      // setFinalCreatorEarning(creatorEarning.toString());
      setFinalEarning(curPrice.minus(totalFee.plus(creatorEarning)).toString());
    } else {
      setFinalEarning("0");
      // setFinalCreatorEarning("0");
    }
  };

  const handlePeriod = (date: number, type: string) => {
    if (type == "start") setStartTime(date);
    else setEndTime(date);
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

    const finalStartTime = Math.floor(startTime / 1000);
    const finalEndTime = Math.floor(endTime / 1000);

    if (finalStartTime == 0 || finalEndTime == 0) {
      setModalAlert({
        open: true,
        type: "error",
        text: "정확한 판매 기간을 입력해주세요.",
      });
      return;
    } else if (finalEndTime < new Date().getTime() / 1000) {
      setModalAlert({
        open: true,
        type: "error",
        text: "판매 종료시간을 현재시간 이후의 시간으로 설정해주세요.",
      });
      return;
    } else if (finalEndTime <= finalStartTime) {
      setModalAlert({
        open: true,
        type: "error",
        text: "판매 종료시간은 판매 시작시간보다 빠르거나 같을 수 없습니다.",
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
          CUNIVERSE_HUB_ADDRESS
        );

        approval = check;
      } catch (err) {
        console.log("isApprovedForAllError:", err);
        return;
      }

      if (!approval) {
        try {
          // 해당 컬렉션의 전송권한 부여
          const setApprovalForAllTx = await (contract.setApprovalForAll as any)(
            CUNIVERSE_HUB_ADDRESS,
            true
          );

          await setApprovalForAllTx.wait();
        } catch (err) {
          console.log("setApprovalForAllError:", err);
          return;
        }
      }

      try {
        const domain = {
          name: "Cuniverse",
          version: "1.0",
          chainId: NETWORK_SEPOLIA.toString(),
          verifyingContract: CUNIVERSE_HUB_ADDRESS,
        };

        const value = {
          owner: account.address,
          contractAddress: NFT.contractAddress,
          tokenId: NFT.tokenId,
          price: BigInt(price.text * 10 ** 18).toString(),
          startTime: finalStartTime,
          endTime: finalEndTime,
        };

        const types = {
          EIP712Domain: [
            { name: "name", type: "string" },
            { name: "version", type: "string" },
            { name: "chainId", type: "uint256" },
            { name: "verifyingContract", type: "address" },
          ],
          Order: [
            { name: "owner", type: "address" },
            { name: "contractAddress", type: "address" },
            { name: "tokenId", type: "uint256" },
            { name: "price", type: "uint256" },
            { name: "startTime", type: "uint256" },
            { name: "endTime", type: "uint256" },
          ],
        };

        // const signature = await signer.signTypedData(domain, types, value);

        const typedData = JSON.stringify({
          types,
          primaryType: "Order",
          domain,
          message: value,
        });

        // EIP-712 sign
        const params = [account.address, typedData];
        const signature: any = await window.ethereum.request({
          method: "eth_signTypedData_v4",
          params,
        });

        const r = signature.slice(0, 66);
        const s = "0x" + signature.slice(66, 130);
        const v = parseInt(signature.slice(130, 132), 16);

        const data: CreateSalesDetailRequest = {
          accountId: account.id,
          contractAddress: NFT.contractAddress,
          tokenId: NFT.tokenId,
          price: `${price.text}`,
          startTime: finalStartTime,
          endTime: finalEndTime,
          signature,
          image,
          title: NFT.contractName,
          name: NFT.name,
          v,
          r,
          s,
        };

        await createSaleMutate(
          { data },
          {
            onSuccess(createRes) {
              if (createRes) {
                setModalAlert({
                  open: true,
                  type: "success",
                  text: "축하합니다!\nNFT 판매 등록에 성공하였습니다.",
                });
                onClose();
              } else {
                setModalAlert({
                  open: true,
                  type: "error",
                  text: "NFT 판매 실패에 성공하였습니다.\n다시 시도해주세요.",
                });
              }
            },
          }
        );
      } catch (err) {
        console.log(err);
      }
    }
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
            labelText="판매 시작시간"
            date={new Date().toISOString().slice(0, 16)}
            id="nft-start-time"
            onChange={(date: number) => handlePeriod(date, "start")}
          />
          <InputDateTimeWithLabel
            labelText="판매 종료시간"
            date={new Date().toISOString().slice(0, 16)}
            id="nft-end-time"
            onChange={(date: number) => handlePeriod(date, "end")}
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
            <span>창작자 로열티</span>
            <span>{creatorFee}%</span>
          </div>
          <div>
            <span>총 예상 수익(ETH)</span>
            <span className="final-earning">{finalEarning.toString()} ETH</span>
          </div>
        </div>
      </div>
    </ModalConfirm>
  );
}

export default ModalSaleNFT;
