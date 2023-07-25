"use client";

import Image from "next/image";
import InputImage from "../inputs/InputImage";
import React from "react";
import ButtonImageUpload from "../buttons/ButtonImageUpload";
import { uploadImageToS3 } from "@/utils/tools";
import useAccountUpdateMutation from "@/queries/useAccountUpdateMutation";

interface ContaineraBannerProps {
  defaultUri: string;
  edit: boolean;
}

function ContaineraBanner(props: ContaineraBannerProps) {
  const { mutate: updateAccount } = useAccountUpdateMutation();
  const defaultUri = props.defaultUri;
  const edit = props.edit;

  const uploadImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length) {
      const uploadedFile: File = e.target.files[0];
      const bannerImage = await uploadImageToS3(uploadedFile);
      const updateRes = await updateAccount({ data: { banner: bannerImage } });
      console.log(updateRes);
    }
  };
  return (
    <div className="container-banner">
      <Image src={defaultUri} alt="test" loading="lazy" fill={true} />

      {edit ? (
        <>
          <ButtonImageUpload targetId="input-image-banner" />
          <InputImage id="input-image-banner" onChange={uploadImage} />
        </>
      ) : null}
    </div>
  );
}

export default ContaineraBanner;
