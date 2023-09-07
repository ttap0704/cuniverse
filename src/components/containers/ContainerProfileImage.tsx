"use client";

import { memo } from "react";
import ButtonImageUpload from "../buttons/ButtonImageUpload";
import InputImage from "../inputs/InputImage";
import useAccountImageUploadMutation from "@/queries/useAccountImageUploadMutation";
import LoadingWaterDrop from "../common/LoadingWaterDrop";
import ImageCuniverse from "../common/ImageCuniverse";
import containerStyles from "@/css/components/containers.module.scss";

// 사용자 Profile Image Component

interface ContainerProfileImageProps {
  defaultUri: string;
  edit: boolean;
}

function ContainerProfileImage(props: ContainerProfileImageProps) {
  const { mutate: uploadImage, isLoading } = useAccountImageUploadMutation();
  const defaultUri = props.defaultUri;
  const edit = props.edit;

  const uploadProfile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length) {
      const uploadedFile: File = e.target.files[0];
      uploadImage({ image: uploadedFile, key: "profile" });
    }
  };

  return (
    <div
      id="container-profile-image"
      className={containerStyles["container-profile-image"]}
    >
      <div>
        <div>
          <ImageCuniverse
            src={defaultUri}
            alt="account-profile"
            width={180}
            height={180}
          />
          {isLoading ? (
            <LoadingWaterDrop />
          ) : edit ? (
            <>
              <ButtonImageUpload targetId="input-image-profile" />
              <InputImage id="input-image-profile" onChange={uploadProfile} />
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export default memo(ContainerProfileImage, (prev, cur) => {
  return prev.defaultUri === cur.defaultUri;
});
