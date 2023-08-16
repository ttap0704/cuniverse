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

// Create NFT Metadata
interface CreateNFTMetadata {
  name: string;
  image: string;
  description: string;
  contractAddress: string;
  externalUrl: string;
  youtubeUrl: string;
  attributes: {
    trait_type: string;
    value: string;
  }[];
}

type CreateNFTMetadataKeys =
  | "name"
  | "image"
  | "description"
  | "contractAddress"
  | "externalUrl"
  | "youtubeUrl"
  | "attributes";

const mintingKeys: CreateNFTMetadataKeys[] = [
  "image",
  "name",
  "description",
  "contractAddress",
  "externalUrl",
  "youtubeUrl",
  "attributes",
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
  attributes: { KR: "속성", type: "text", required: false },
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
  attributes: () => "",
};

const mintingPlaceholder: { [key in CreateNFTMetadataKeys]: string } = {
  image: "",
  name: "NFT 이름을 작성해주세요",
  description: "NFT 설명을 입력해주세요.",
  contractAddress: "배포할 컬렉션을 선택해주세요.",
  externalUrl: "NFT와 관련된 외부 링크를 입력해주세요.",
  youtubeUrl: "NFT와 관련된 유튜브 링크를 입력해주세요.",
  attributes: "",
};

function AccountSettings() {
  const { data: account } = useAccountQuery();
  const setModalAlert = useSetAtom(setModalAlertAtom);
  const router = useRouter();
  const searchParams = useSearchParams();

  const [form, setForm] = useState<InputProps[]>([]);
  const [isSetting, setIsSetting] = useState(true);
  const [isDeploying, setIsDeploying] = useState(false);
  const [contractDropdownItems, setContractDropdownItems] = useState<
    DropdownMenuItem[]
  >([]);
  const [contract, setContract] = useState({
    value: "",
    error: false,
  });

  const mintingData = useRef<
    { [key in CreateNFTMetadataKeys]: { value: string; error: boolean } }
  >({
    image: { value: "", error: false },
    name: { value: "", error: false },
    description: { value: "", error: false },
    contractAddress: { value: "", error: false },
    externalUrl: { value: "", error: false },
    youtubeUrl: { value: "", error: false },
    attributes: { value: "", error: false },
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
    if (contractRes) {
      const tmpMenu: DropdownMenuItem[] = contractRes.map((item) => {
        return {
          label: `${item.name} (${item.symbol})`,
          id: item.contractAddress,
        };
      });
      setContractDropdownItems([...tmpMenu]);

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
      }

      // NFT 이미지 올리는 로직
      if (!mintingData.current["image"].error) {
        const finalMintingData: CreateNFTMetadata = {
          name: "",
          image: "",
          description: "",
          contractAddress: "",
          externalUrl: "",
          youtubeUrl: "",
          attributes: [],
        };
        const NFTFile = base64ToFile(
          mintingData.current["image"].value,
          "tmp-file"
        );
        if (NFTFile) {
          for (let i = 0; i < mintingKeys.length; i++) {
            const key = mintingKeys[i],
              val = mintingData.current[key];
            if (key != "attributes" && key != "image") {
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
            } else if (key == "attributes") {
              // console.log;
            }
          }

          const NFTFormdata = new FormData();
          NFTFormdata.append("file", NFTFile);
          NFTFormdata.append("fileType", "image");
          const uploadNFTUrl = await fetchUploadIPFS(NFTFormdata);
          if (uploadNFTUrl) {
            finalMintingData["image"] = uploadNFTUrl;

            const MetadataFormdata = new FormData();
            MetadataFormdata.append("file", JSON.stringify(finalMintingData));
            MetadataFormdata.append("fileType", "json");

            const uploadMetadataUrl = await fetchUploadIPFS(MetadataFormdata);
            console.log("uploadMetadataUrl:", uploadMetadataUrl);
          }
        } else {
          setModalAlert({
            open: true,
            type: "error",
            text: "NFT 업로드에 실패하였습니다.\r다시 시도해주세요.",
          });
          return;
        }
      }

      //   const imageKeys: ("banner" | "profile")[] = ["banner", "profile"];
      //   for (const key of imageKeys) {
      //     if ((finalMintingData[key] as string).length != 0) {
      //       const bannerFile = base64ToFile(
      //         finalMintingData[key] as string,
      //         `tmp-${key}`
      //       );
      //       if (bannerFile) {
      //         const newImageName = await uploadImageToS3(bannerFile);
      //         if (newImageName) {
      //           finalMintingData[key] = newImageName;
      //         }
      //       }
      //     } else {
      //       delete finalMintingData[key];
      //     }
      //   }
      //   // Update 내용 여부에 따라
      //   // Update 또는 Modal 생성
      //   if (ethersBrowserProvider.provider) {
      //     setIsDeploying(true);
      //     if (!validAddress) {
      //       const signer = await ethersBrowserProvider.provider.getSigner();
      //       const factory = new ethers.ContractFactory(
      //         NFT.abi,
      //         NFT.bytecode,
      //         signer
      //       );
      //       try {
      //         const contract = await factory.deploy(
      //           finalMintingData.name,
      //           finalMintingData.symbol
      //         );
      //         await contract.waitForDeployment();
      //         finalMintingData["contractAddress"] = await contract.getAddress();
      //       } catch (err) {
      //         setModalAlert({
      //           open: true,
      //           type: "error",
      //           text: "컬렉션 배포에 실패하였습니다.",
      //         });
      //       }
      //     } else {
      //       finalMintingData["contractAddress"] = contractAddress.value;
      //     }
      //   }
      //   await fetchCreateConllection({ data: finalMintingData });
      //   setModalAlert({
      //     open: true,
      //     type: "success",
      //     text: "컬렉션 배포에 성공하였습니다.",
      //   });
      //   setIsDeploying(false);
      //   router.push("/contracts");
    }
  };

  if (isSetting) return <LoadingSpinner />;
  else {
    return (
      <ContainerForm>
        {isDeploying ? <LoadingWaterDrop /> : null}
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
