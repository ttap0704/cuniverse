"use client";

import Image from "next/image";
import InputImage from "../inputs/InputImage";
import React, { memo } from "react";
import ButtonImageUpload from "../buttons/ButtonImageUpload";
import LoadingWaterDrop from "../common/LoadingWaterDrop";
import useAccountImageUploadMutation from "@/queries/useAccountImageUploadMutation";

interface ContainerBannerProps {
  defaultUri: string;
  edit: boolean;
}

function ContainerBanner(props: ContainerBannerProps) {
  const { mutate: uploadImage, isLoading } = useAccountImageUploadMutation();
  const defaultUri = props.defaultUri;
  const edit = props.edit;

  const uploadBanner = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length) {
      const uploadedFile: File = e.target.files[0];
      uploadImage({ image: uploadedFile, key: "banner" });
    }
  };

  return (
    <div className="container-banner">
      <Image src={defaultUri} alt="test" loading="lazy" fill={true} />
      {isLoading ? (
        <LoadingWaterDrop />
      ) : edit ? (
        <>
          <ButtonImageUpload targetId="input-image-banner" />
          <InputImage id="input-image-banner" onChange={uploadBanner} />
        </>
      ) : null}
    </div>
  );
}

export default memo(ContainerBanner, (prev, cur) => {
  return prev.defaultUri === cur.defaultUri;
});