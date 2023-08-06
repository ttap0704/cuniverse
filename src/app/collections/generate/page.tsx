"use client";

import Button from "@/components/buttons/Button";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import ContainerForm from "@/components/containers/ContainerForm";
import InputWithLabel from "@/components/inputs/InputWithLabel";
import useAccountQuery from "@/queries/useAccountQuery";
import useAccountUpdateMutation from "@/queries/useAccountUpdateMutation";
import { setModalAlertAtom } from "@/store/modalAlert";
import validations from "@/utils/validations";
import { useSetAtom } from "jotai";
import { useEffect, useRef, useState } from "react";

const editKeys: UpdateAccountKeys[] = [
  "nickname",
  "description",
  "website",
  "instagram",
  "youtube",
  "afreecatv",
  "twitch",
  "twitter",
];
const editKeysKR: { [key in UpdateAccountKeys]: string } = {
  nickname: "닉네임",
  description: "소개글",
  website: "웹사이트 링크",
  twitter: "트위터 링크",
  youtube: "유튜브 링크",
  afreecatv: "아프리카tv 링크",
  instagram: "인스타그램 링크",
  twitch: "트위치tv 링크",
};

const editValidations: {
  [key in UpdateAccountKeys]: (text: StringOrNumber) => string;
} = {
  nickname: validations["nickname"],
  description: () => "",
  website: validations["webAddress"],
  twitter: validations["webAddress"],
  youtube: validations["webAddress"],
  afreecatv: validations["webAddress"],
  instagram: validations["webAddress"],
  twitch: validations["webAddress"],
};

function AccountSettings() {
  const { data: account } = useAccountQuery();
  const { mutate: updateAccount, isSuccess } = useAccountUpdateMutation();
  const setModalAlert = useSetAtom(setModalAlertAtom);

  const [form, setForm] = useState<InputProps[]>([]);
  const [isSetting, setIsSetting] = useState(true);

  const updateAccountData = useRef<
    { [key in UpdateAccountKeys]: { value: string; error: boolean } }
  >({
    nickname: { value: "", error: false },
    description: { value: "", error: false },
    website: { value: "", error: false },
    twitter: { value: "", error: false },
    youtube: { value: "", error: false },
    afreecatv: { value: "", error: false },
    instagram: { value: "", error: false },
    twitch: { value: "", error: false },
  });

  useEffect(() => {
    // Account가 바뀔때 실행
    if (account) setIsSetting(true), setFormData();
  }, [account]);

  useEffect(() => {
    // Account Update 성공하면 실행
    if (isSuccess) openModalAlert();
  }, [isSuccess]);

  // 페이지 진입 시, Initial Form Data 생성
  const setFormData = () => {
    if (account) {
      const tmpForm: InputProps[] = [];
      for (let i = 0; i < editKeys.length; i++) {
        tmpForm.push({
          id: `account-edit-${editKeys[i]}`,
          value: account[editKeys[i]] ?? "",
          type: editKeys[i] == "description" ? "textarea" : "text",
          onChange: (text: StringOrNumber, error: boolean) => {
            const tmpUpdateData = { ...updateAccountData.current };
            tmpUpdateData[editKeys[i]].value = `${text}`;
            tmpUpdateData[editKeys[i]].error = error;
            updateAccountData.current = { ...tmpUpdateData };
          },
          dataKey: editKeys[i],
          validation: editValidations[editKeys[i]],
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

  const updateSettings = async () => {
    if (account) {
      const finalUpdateData: { [key: string]: string } = {};

      for (let i = 0; i < editKeys.length; i++) {
        const key = editKeys[i],
          val = updateAccountData.current[key];
        // 각 입력란 Validation 확인
        if (val.error) {
          alert("정보를 올바르게 입력해주세요.");
          return;
        }

        // 기존값과 입력란이 같지 않다면 Update Data에 추가
        if (val.value.length != 0 && account[key] != val.value) {
          finalUpdateData[key] = val.value;
        }
      }

      // Update 내용 여부에 따라
      // Update 또는 Modal 생성
      if (Object.keys(finalUpdateData).length != 0) {
        await updateAccount({ data: finalUpdateData });
      } else {
        openModalAlert();
      }
    }
  };

  if (isSetting) return <LoadingSpinner />;

  return (
    <ContainerForm>
      {form.map((data) => {
        return (
          <InputWithLabel
            labelText={editKeysKR[data.dataKey as UpdateAccountKeys]}
            id={data.id}
            value={data.value}
            onChange={data.onChange}
            type={data.type}
            key={data.id}
            dataKey={data.dataKey}
            validation={data.validation}
          />
        );
      })}
      <Button onClick={updateSettings}>저장</Button>
    </ContainerForm>
  );
}

export default AccountSettings;
