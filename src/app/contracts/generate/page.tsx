"use client";

import Button from "@/components/buttons/Button";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import ContainerForm from "@/components/containers/ContainerForm";
import InputWithLabel from "@/components/inputs/InputWithLabel";
import useAccountQuery from "@/queries/useAccountQuery";
import { setModalAlertAtom } from "@/store/modalAlert";
import {
  fetchCheckOwnContract,
  fetchCreateConllection,
  fetchUploadIPFS,
} from "@/utils/api";
import { base64ToFile, uploadImageToS3 } from "@/utils/tools";
import validations from "@/utils/validations";
import { useSetAtom } from "jotai";
import { useEffect, useRef, useState } from "react";
import ethersBrowserProvider from "@/utils/ethersBrowserProvider";
import { ethers } from "ethers";
import NFT from "@/contracts/NFT.json";
import LoadingWaterDrop from "@/components/common/LoadingWaterDrop";
import { useRouter, useSearchParams } from "next/navigation";
import WrongApproach from "@/components/common/WrongApproach";
import TypographyFormTitle from "@/components/typography/TypographyFormTitle";

const generateKeys: UpdateContractKeys[] = [
  "banner",
  "profile",
  "name",
  "symbol",
  "description",
  "royalty",
];
const generateKeysData: {
  [key in UpdateContractKeys]: {
    KR: string;
    type: InputTypes;
    required: boolean;
  };
} = {
  banner: { KR: "배너 사진", type: "file", required: false },
  profile: {
    KR: "프로필 사진",
    type: "file",
    required: false,
  },
  name: {
    KR: "컬렉션 이름",
    type: "text",
    required: true,
  },
  symbol: {
    KR: "컬렉션 심볼",
    type: "text",
    required: true,
  },
  description: {
    KR: "컬렉션 소개",
    type: "textarea",
    required: true,
  },
  royalty: {
    KR: "창작자 수익 (%)",
    type: "number",
    required: true,
  },
};

const generatePlaceholder: { [key in UpdateContractKeys]: string } = {
  banner: "",
  profile: "",
  name: "컬렉션 이름을 입력해주세요.",
  symbol: "컬렉션 심볼을 입력해주세요. (ex. CU)",
  description: "컬렉션 설명을 입력해주세요.",
  royalty: "창작자의 로열티 비율을 설정해주세요. (ex. 3.0%)",
};

const generateValidations: {
  [key in UpdateContractKeys]: (text: StringOrNumber) => string;
} = {
  banner: () => "",
  profile: () => "",
  name: validations["collectionName"],
  symbol: validations["collectionSymbol"],
  description: () => "",
  royalty: validations["royalty"],
};

function AccountSettings() {
  const { data: account } = useAccountQuery();
  const setModalAlert = useSetAtom(setModalAlertAtom);
  const router = useRouter();
  const searchParams = useSearchParams();

  const [form, setForm] = useState<InputProps[]>([]);
  const [isSetting, setIsSetting] = useState(true);
  const [isDeploying, setIsDeploying] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const [validAddress, setValidAddress] = useState(false);
  const [generateMode, setGenedateMode] = useState("");
  const [contractAddress, setContractAddress] = useState({
    value: "",
    error: false,
  });

  const title =
    generateMode == "generate-new" ? "컬렉션 생성하기" : "컬렉션 가져오기";

  useEffect(() => {
    setIsSetting(true);
    const mode = searchParams.get("mode");
    if (mode && ["generate-new", "generate-old"].includes(mode)) {
      setGenedateMode(mode);
      setFormData();
    } else {
      setIsSetting(false);
    }
  }, []);

  const updateAccountData = useRef<
    { [key in UpdateContractKeys]: { value: StringOrNumber; error: boolean } }
  >({
    banner: { value: "", error: false },
    profile: { value: "", error: false },
    name: { value: "", error: false },
    symbol: { value: "", error: false },
    description: { value: "", error: false },
    royalty: { value: "0", error: false },
  });

  // 페이지 진입 시 또는 가져오기 완료 시, Initial Form Data 생성
  const setFormData = (name?: string, symbol?: string) => {
    const tmpForm: InputProps[] = [];
    for (let i = 0; i < generateKeys.length; i++) {
      const key = generateKeys[i];
      let value = "";
      if (key == "name" && name) value = name;
      else if (key == "symbol" && symbol) value = symbol;

      tmpForm.push({
        id: `collection-generate-${key}`,
        value,
        type: generateKeysData[key].type,
        onChange: (text: StringOrNumber, error: boolean) => {
          const tmpUpdateData: {
            [key in UpdateContractKeys]: { value: string; error: boolean };
          } = JSON.parse(JSON.stringify(updateAccountData.current));
          tmpUpdateData[key].value = `${text}`;
          tmpUpdateData[key].error = error;
          updateAccountData.current = { ...tmpUpdateData };
        },
        dataKey: key,
        validation: generateValidations[key],
        readOnly: value.length > 0 ? true : false,
        placeholder: generatePlaceholder[key],
      });

      if (value.length > 0) {
        updateAccountData.current[key].value = value;
      }
    }
    setForm([...tmpForm]);
    setIsSetting(false);
  };

  const checkOwnContract = async () => {
    if (contractAddress.error) {
      setModalAlert({
        open: true,
        type: "error",
        text: "올바른 주소를 입력해주세요.",
      });
    } else {
      setIsChecking(true);
      const check = await fetchCheckOwnContract(contractAddress.value);
      if (!check) {
        setModalAlert({
          open: true,
          type: "error",
          text: "올바른 주소가 아니거나 이미 등록된 주소입니다.",
        });
      } else {
        setValidAddress(true);
        setFormData(check.name, check.symbol);
      }
      setIsChecking(false);
    }
  };

  const createContract = async () => {
    if (account) {
      setIsDeploying(true);
      const finalGenerateData: CreateContractRequest = {
        name: "",
        symbol: "",
        description: "",
        banner: "",
        profile: "",
        contractAddress: "",
        accountId: account.id,
        created: generateMode == "generate-new" ? 1 : 0,
        royalty: "0",
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
          finalGenerateData[key] = val.value;
        }
      }

      const imageKeys: ("banner" | "profile")[] = ["banner", "profile"];

      for (const key of imageKeys) {
        if ((finalGenerateData[key] as string).length != 0) {
          const bannerFile = base64ToFile(
            finalGenerateData[key] as string,
            `tmp-${key}`
          );
          if (bannerFile) {
            const newImageName = await uploadImageToS3(bannerFile);
            if (newImageName) {
              finalGenerateData[key] = newImageName;
            }
          }
        } else {
          delete finalGenerateData[key];
        }
      }

      // Update 내용 여부에 따라
      // Update 또는 Modal 생성
      if (ethersBrowserProvider.provider) {
        if (!validAddress) {
          const signer = await ethersBrowserProvider.provider.getSigner();
          const factory = new ethers.ContractFactory(
            NFT.abi,
            NFT.bytecode,
            signer
          );

          try {
            const contract = await factory.deploy(
              finalGenerateData.name,
              finalGenerateData.symbol,
              Number(finalGenerateData.royalty) * 100
            );

            await contract.waitForDeployment();
            finalGenerateData["contractAddress"] = await contract.getAddress();
          } catch (err) {
            setModalAlert({
              open: true,
              type: "error",
              text: "컬렉션 배포에 실패하였습니다.",
            });
            setIsDeploying(false);
            return;
          }
        } else {
          finalGenerateData["contractAddress"] = contractAddress.value;
        }
      }

      const check = await fetchCreateConllection({ data: finalGenerateData });
      if (check) {
        setModalAlert({
          open: true,
          type: "success",
          text: "컬렉션 배포에 성공하였습니다.",
        });
        router.push("/contracts");
      } else {
        setModalAlert({
          open: true,
          type: "error",
          text: "컬렉션 배포에 실패하였습니다.\n다시 시도해주세요.",
        });
      }

      setIsDeploying(false);
    }
  };

  if (isSetting) return <LoadingSpinner />;
  else {
    if (generateMode.length == 0) {
      return <WrongApproach />;
    } else {
      if (generateMode == "generate-old" && !validAddress) {
        return (
          <ContainerForm>
            <TypographyFormTitle title={title} />
            {isChecking ? <LoadingWaterDrop /> : null}
            <InputWithLabel
              labelText="스마트 콘트랙트 주소"
              id="collection-generate-address"
              value=""
              onChange={(text: StringOrNumber, error: boolean) =>
                setContractAddress({ value: text, error })
              }
              type="text"
              dataKey="contract-address"
              validation={validations["contractAddress"]}
              required={true}
            />
            <Button onClick={checkOwnContract} className="fill">
              불러오기
            </Button>
          </ContainerForm>
        );
      } else {
        return (
          <ContainerForm>
            <TypographyFormTitle title={title} />
            {isDeploying ? <LoadingWaterDrop /> : null}
            {form.map((data) => {
              return (
                <InputWithLabel
                  labelText={
                    generateKeysData[data.dataKey as UpdateContractKeys].KR
                  }
                  id={data.id}
                  value={data.value}
                  onChange={data.onChange}
                  type={data.type}
                  key={data.id}
                  dataKey={data.dataKey}
                  validation={data.validation}
                  required={
                    generateKeysData[data.dataKey as UpdateContractKeys]
                      .required
                  }
                  readOnly={data.readOnly}
                  placeholder={data.placeholder}
                />
              );
            })}
            <Button onClick={createContract}>저장</Button>
          </ContainerForm>
        );
      }
    }
  }
}

export default AccountSettings;
