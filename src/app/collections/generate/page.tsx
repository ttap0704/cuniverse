"use client";

import Button from "@/components/buttons/Button";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import ContainerForm from "@/components/containers/ContainerForm";
import InputWithLabel from "@/components/inputs/InputWithLabel";
import useAccountQuery from "@/queries/useAccountQuery";
import useAccountUpdateMutation from "@/queries/useAccountUpdateMutation";
import { setModalAlertAtom } from "@/store/modalAlert";
import { fetchCreateConllection } from "@/utils/api";
import { base64ToFile, uploadImageToS3 } from "@/utils/tools";
import validations from "@/utils/validations";
import { useSetAtom } from "jotai";
import { useEffect, useRef, useState } from "react";
import ethersBrowserProvider from "@/utils/ethersBrowserProvider";
import { ethers } from "ethers";
import NFT from "@/contracts/NFT.json";
import LoadingWaterDrop from "@/components/common/LoadingWaterDrop";
import { useRouter } from "next/navigation";

const generateKeys: UpdateContractKeys[] = [
  "banner",
  "profile",
  "name",
  "symbol",
  "description",
];
const generateKeysData: {
  [key in UpdateContractKeys]: {
    KR: string;
    type: InputTypes;
    required: boolean;
  };
} = {
  banner: { KR: "배너 사진", type: "file", required: false },
  profile: { KR: "프로필 사진", type: "file", required: false },
  name: { KR: "컬렉션 이름", type: "text", required: true },
  symbol: { KR: "컬렉션 심볼", type: "text", required: true },
  description: { KR: "컬렉션 소개", type: "textarea", required: true },
};

const generateValidations: {
  [key in UpdateContractKeys]: (text: StringOrNumber) => string;
} = {
  banner: () => "",
  profile: () => "",
  name: validations["collectionName"],
  symbol: validations["collectionSymbol"],
  description: () => "",
};

function AccountSettings() {
  const { data: account } = useAccountQuery();
  const setModalAlert = useSetAtom(setModalAlertAtom);
  const router = useRouter();

  const [form, setForm] = useState<InputProps[]>([]);
  const [isSetting, setIsSetting] = useState(true);
  const [isDeploying, setIsDeploying] = useState(false);

  const updateAccountData = useRef<
    { [key in UpdateContractKeys]: { value: string; error: boolean } }
  >({
    banner: { value: "", error: false },
    profile: { value: "", error: false },
    name: { value: "", error: false },
    symbol: { value: "", error: false },
    description: { value: "", error: false },
  });

  useEffect(() => {
    if (account) setIsSetting(true), setFormData();
  }, [account]);

  // 페이지 진입 시, Initial Form Data 생성
  const setFormData = () => {
    if (account) {
      const tmpForm: InputProps[] = [];
      for (let i = 0; i < generateKeys.length; i++) {
        tmpForm.push({
          id: `collection-generate-${generateKeys[i]}`,
          value: "",
          type: generateKeysData[generateKeys[i]].type,
          onChange: (text: StringOrNumber, error: boolean) => {
            const tmpUpdateData: {
              [key in UpdateContractKeys]: { value: string; error: boolean };
            } = JSON.parse(JSON.stringify(updateAccountData.current));
            tmpUpdateData[generateKeys[i]].value = `${text}`;
            tmpUpdateData[generateKeys[i]].error = error;
            updateAccountData.current = { ...tmpUpdateData };
          },
          dataKey: generateKeys[i],
          validation: generateValidations[generateKeys[i]],
        });
      }
      setForm([...tmpForm]);
      setIsSetting(false);
    }
  };

  const openModalAlert = () => {
    setModalAlert({
      open: true,
      type: "success",
      text: "프로필이 수정되었습니다.",
    });
  };

  const createContract = async () => {
    if (account) {
      const finalUpdateData: CreateContractRequest = {
        name: "",
        symbol: "",
        description: "",
        banner: "",
        profile: "",
        contract_address: "",
        account_id: account.id,
      };

      for (let i = 0; i < generateKeys.length; i++) {
        const key = generateKeys[i],
          val = updateAccountData.current[key];
        // 각 입력란 Validation 확인
        if (val.error) {
          setModalAlert({
            open: true,
            type: "error",
            text: "정보를 올바르게 입력해주세요.",
          });
          return;
        }

        if (val.value.length === 0 && generateKeysData[key].required) {
          setModalAlert({
            open: true,
            type: "error",
            text: "필수 정보를 모두 입력해주세요.",
          });
          return;
        }

        if (val.value.length != 0) {
          finalUpdateData[key] = val.value;
        }
      }

      const imageKeys: ("banner" | "profile")[] = ["banner", "profile"];

      for (const key of imageKeys) {
        if ((finalUpdateData[key] as string).length != 0) {
          const bannerFile = base64ToFile(
            finalUpdateData[key] as string,
            `tmp-${key}`
          );
          if (bannerFile) {
            const newImageName = await uploadImageToS3(bannerFile);
            if (newImageName) {
              finalUpdateData[key] = newImageName;
            }
          }
        } else {
          delete finalUpdateData[key];
        }
      }

      // Update 내용 여부에 따라
      // Update 또는 Modal 생성
      console.log(finalUpdateData);
      if (ethersBrowserProvider.provider) {
        setIsDeploying(true);
        const signer = await ethersBrowserProvider.provider.getSigner();
        console.log(signer);
        const factory = new ethers.ContractFactory(
          NFT.abi,
          NFT.bytecode,
          signer
        );

        console.log(factory);

        try {
          const contract = await factory.deploy(
            finalUpdateData.name,
            finalUpdateData.symbol
          );
          await contract.waitForDeployment();
          finalUpdateData["contract_address"] = await contract.getAddress();
        } catch (err) {
          setModalAlert({
            open: true,
            type: "error",
            text: "컬렉션 배포에 실패하였습니다.",
          });
        }
      }

      await fetchCreateConllection({ data: finalUpdateData });
      setModalAlert({
        open: true,
        type: "success",
        text: "컬렉션 배포에 성공하였습니다.",
      });
      setIsDeploying(false);
      router.push("/collections");
    }
  };

  if (isSetting) return <LoadingSpinner />;

  return (
    <ContainerForm>
      {isDeploying ? <LoadingWaterDrop /> : null}
      {form.map((data) => {
        return (
          <InputWithLabel
            labelText={generateKeysData[data.dataKey as UpdateContractKeys].KR}
            id={data.id}
            value={data.value}
            onChange={data.onChange}
            type={data.type}
            key={data.id}
            dataKey={data.dataKey}
            validation={data.validation}
            required={
              generateKeysData[data.dataKey as UpdateContractKeys].required
            }
          />
        );
      })}
      <Button onClick={createContract}>저장</Button>
    </ContainerForm>
  );
}

export default AccountSettings;
