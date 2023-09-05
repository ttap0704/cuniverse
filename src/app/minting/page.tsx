"use client";

import Button from "@/components/buttons/Button";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import ContainerForm from "@/components/containers/ContainerForm";
import InputWithLabel from "@/components/inputs/InputWithLabel";
import useAccountQuery from "@/queries/useAccountQuery";
import { setModalAlertAtom } from "@/store/modalAlert";
import { fetchGetAccountContracts, fetchUploadIPFS } from "@/utils/api";
import validations from "@/utils/validations";
import { useSetAtom } from "jotai";
import { use, useEffect, useRef, useState } from "react";
import LoadingWaterDrop from "@/components/common/LoadingWaterDrop";
import { useRouter, useSearchParams } from "next/navigation";
import { base64ToFile } from "@/utils/tools";
import TypographyFormTitle from "@/components/typography/TypographyFormTitle";
import ethersBrowserProvider from "@/utils/ethersBrowserProvider";
import NFT from "@/contracts/NFT.json";
import { Contract } from "ethers";

// Create NFT Metadata
interface CreateNFTMetadata {
  name: string;
  image: string;
  description: string;
  contractAddress: string;
  externalUrl: string;
  youtubeUrl: string;
  // attributes: {
  //   trait_type: string;
  //   value: string;
  // }[];
}

type CreateNFTMetadataKeys =
  | "name"
  | "image"
  | "description"
  | "contractAddress"
  | "externalUrl"
  | "youtubeUrl";
// | "attributes";

const mintingKeys: CreateNFTMetadataKeys[] = [
  "image",
  "name",
  "description",
  "contractAddress",
  "externalUrl",
  "youtubeUrl",
  // "attributes",
];
const mintingKeysData: {
  [key in CreateNFTMetadataKeys]: {
    KR: string;
    type: InputTypes;
    required: boolean;
  };
} = {
  image: {
    KR: "NFT 자원 (이미지 또는 동영상)",
    type: "file",
    required: true,
  },
  name: { KR: "NFT 이름", type: "text", required: true },
  description: { KR: "NFT 설명", type: "textarea", required: true },
  contractAddress: { KR: "배포 컬렉션", type: "dropdown", required: true },
  externalUrl: { KR: "외부 링크", type: "text", required: false },
  youtubeUrl: { KR: "유튜브 링크", type: "text", required: false },
  // attributes: { KR: "속성", type: "text", required: false },
};

const mintingValidations: {
  [key in CreateNFTMetadataKeys]: (text: StringOrNumber) => string;
} = {
  image: () => "",
  name: validations["NFTName"],
  description: () => "",
  contractAddress: () => "",
  externalUrl: validations["webAddress"],
  youtubeUrl: validations["webAddress"],
  // attributes: () => "",
};

const mintingPlaceholder: { [key in CreateNFTMetadataKeys]: string } = {
  image: "",
  name: "NFT 이름을 작성해주세요.",
  description: "NFT 설명을 입력해주세요.",
  contractAddress: "배포할 컬렉션을 선택해주세요.",
  externalUrl: "NFT와 관련된 외부 링크를 입력해주세요.",
  youtubeUrl: "NFT와 관련된 유튜브 링크를 입력해주세요.",
  // attributes: "",
};

function AccountSettings() {
  const { data: account } = useAccountQuery();
  const setModalAlert = useSetAtom(setModalAlertAtom);
  const router = useRouter();

  const [form, setForm] = useState<InputProps[]>([]);
  const [isSetting, setIsSetting] = useState(true);
  const [isMinting, setIsMinting] = useState(false);
  const [contractDropdownItems, setContractDropdownItems] = useState<
    DropdownMenuItem[]
  >([]);

  const mintingData = useRef<
    { [key in CreateNFTMetadataKeys]: { value: string; error: boolean } }
  >({
    image: { value: "", error: false },
    name: { value: "", error: false },
    description: { value: "", error: false },
    contractAddress: { value: "", error: false },
    externalUrl: { value: "", error: false },
    youtubeUrl: { value: "", error: false },
    // attributes: { value: "", error: false },
  });

  useEffect(() => {
    // Account가 바뀔때 실행
    if (account) {
      setIsSetting(true);
      setContractDropdown();
    }
  }, [account]);

  // Mint할 컨트랙트 리스트 불러오기
  const setContractDropdown = async () => {
    const contractRes = await fetchGetAccountContracts();
    console.log({ contractRes });
    if (contractRes) {
      const tmpMenu: DropdownMenuItem[] = contractRes
        .filter((item) => item.created == 1)
        .map((item) => {
          return {
            label: `${item.name} (${item.symbol})`,
            id: item.contractAddress,
          };
        });
      setContractDropdownItems([...tmpMenu]);

      console.log({ tmpMenu });

      setFormData();
    } else {
      setModalAlert({
        open: true,
        type: "error",
        text: "먼저 컬렉션을 등록해주세요.",
      });
      return;
    }
  };

  // 페이지 진입 시, Initial Form Data 생성
  const setFormData = () => {
    const tmpForm: InputProps[] = [];
    for (let i = 0; i < mintingKeys.length; i++) {
      const key = mintingKeys[i];
      tmpForm.push({
        id: `NFT-minting-${key}`,
        value: "",
        type: mintingKeysData[key].type,
        onChange: (text: StringOrNumber, error: boolean) => {
          const tmpUpdateData: {
            [key in CreateNFTMetadataKeys]: { value: string; error: boolean };
          } = JSON.parse(JSON.stringify(mintingData.current));
          tmpUpdateData[key].value = `${text}`;
          tmpUpdateData[key].error = error;
          mintingData.current = { ...tmpUpdateData };
        },
        dataKey: key,
        validation: mintingValidations[key],
        readOnly: false,
        placeholder: mintingPlaceholder[key],
      });
    }
    setForm([...tmpForm]);
    setIsSetting(false);
  };

  const createNFT = async () => {
    if (account) {
      if (mintingData.current["image"].value.length == 0) {
        setModalAlert({
          open: true,
          type: "error",
          text: "NFT를 자원을 업로드해주세요.",
        });
        return;
      } else {
        // NFT 이미지 올리는 로직
        if (!mintingData.current["image"].error) {
          const finalMintingData: CreateNFTMetadata = {
            name: "",
            image: "",
            description: "",
            contractAddress: "",
            externalUrl: "",
            youtubeUrl: "",
          };
          const NFTFile = await base64ToFile(
            mintingData.current["image"].value,
            "tmp-file"
          );
          if (NFTFile) {
            for (let i = 0; i < mintingKeys.length; i++) {
              const key = mintingKeys[i],
                val = mintingData.current[key];
              if (key != "image") {
                // 각 입력란 Validation 확인
                if (val.error) {
                  setModalAlert({
                    open: true,
                    type: "error",
                    text: "정보를 올바르게 입력해주세요.",
                  });
                  return;
                }
                if (val.value.length === 0 && mintingKeysData[key].required) {
                  setModalAlert({
                    open: true,
                    type: "error",
                    text: "필수 정보를 모두 입력해주세요.",
                  });
                  return;
                }
                if (val.value.length != 0) {
                  finalMintingData[key] = val.value;
                } else {
                  delete finalMintingData[key];
                }
              }
            }

            let mintStatus = false;
            setIsMinting(true);

            const NFTFormdata = new FormData();
            NFTFormdata.append("file", NFTFile);
            NFTFormdata.append("fileType", "image");
            // IPFS Image CID Hash
            const uploadNFTUrl = await fetchUploadIPFS(NFTFormdata);

            if (uploadNFTUrl) {
              const MetadataFormdata = new FormData();
              MetadataFormdata.append(
                "file",
                JSON.stringify({
                  image: `https://ipfs.io/ipfs/${uploadNFTUrl}`,
                  name: finalMintingData.name,
                  description: finalMintingData.description,
                  external_url: finalMintingData.externalUrl,
                  youtube_url: finalMintingData.youtubeUrl,
                })
              );
              MetadataFormdata.append("fileType", "json");

              // IPFS CID Hash
              const uploadMetadataHash = await fetchUploadIPFS(
                MetadataFormdata
              );

              if (uploadMetadataHash && ethersBrowserProvider.provider) {
                const signer = await ethersBrowserProvider.provider.getSigner();
                const contract = new Contract(
                  finalMintingData.contractAddress,
                  NFT.abi,
                  signer
                );

                try {
                  // mint 시작
                  const NFTTx = await (contract.mintTo as any)(
                    await signer.getAddress(),
                    uploadMetadataHash
                  );

                  await NFTTx.wait();
                  mintStatus = true;
                } catch (err) {
                  console.log("mintError:", err);
                }
              }
            }

            setIsMinting(false);
            if (mintStatus) {
              setModalAlert({
                open: true,
                type: "success",
                text: "NFT 생성에 성공하였습니다.",
              });

              router.push("/account");
            } else {
              setModalAlert({
                open: true,
                type: "error",
                text: "NFT 생성에 실패하였습니다.\r다시 시도해주세요.",
              });
            }
          }
        }
      }
    }
  };

  if (isSetting) return <LoadingSpinner />;
  else {
    return (
      <ContainerForm>
        {isMinting ? <LoadingWaterDrop /> : null}
        <TypographyFormTitle title="NFT 생성하기" />
        {form.map((data) => {
          return (
            <InputWithLabel
              labelText={
                mintingKeysData[data.dataKey as CreateNFTMetadataKeys].KR
              }
              id={data.id}
              value={data.value}
              onChange={data.onChange}
              type={data.type}
              key={data.id}
              dataKey={data.dataKey}
              validation={data.validation}
              required={
                mintingKeysData[data.dataKey as CreateNFTMetadataKeys].required
              }
              readOnly={data.readOnly}
              placeholder={data.placeholder}
              items={
                data.dataKey == "contractAddress" ? contractDropdownItems : []
              }
            />
          );
        })}
        <Button onClick={createNFT}>생성</Button>
      </ContainerForm>
    );
  }
}

export default AccountSettings;
