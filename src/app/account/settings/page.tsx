"use client";

import ContainerForm from "@/components/containers/ContainerForm";
import InputWithLabel from "@/components/inputs/InputWithLabel";
import useAccountQuery from "@/queries/useAccountQuery";
import { useEffect, useState } from "react";

const editKeys: UpdateAccountKeys[] = [
  "nickname",
  "description",
  "website",
  "twitter",
  "youtube",
  "afreecatv",
  "instagram",
  "twitch",
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

function AccountSettings() {
  const { data: account } = useAccountQuery();
  const [form, setForm] = useState<InputProps[]>([]);

  useEffect(() => {
    if (account) setFormData();
  }, [account]);

  const setFormData = () => {
    if (account) {
      const tmpForm: InputProps[] = [];
      for (let i = 0; i < editKeys.length; i++) {
        tmpForm.push({
          id: `account-edit-${editKeys[i]}`,
          value: account[editKeys[i]] ?? "",
          type: editKeys[i] == "description" ? "textarea" : "text",
          onChange: test,
          dataKey: editKeys[i],
        });
      }

      setForm([...tmpForm]);
    }
  };

  const test = (text: string | number) => {
    console.log(text);
  };

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
          />
        );
      })}
    </ContainerForm>
  );
}

export default AccountSettings;
