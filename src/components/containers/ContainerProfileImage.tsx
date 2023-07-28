import { memo } from "react";
import Image from "next/image";
import ButtonImageUpload from "../buttons/ButtonImageUpload";
import InputImage from "../inputs/InputImage";
import { uploadImageToS3 } from "@/utils/tools";
import useAccountUpdateMutation from "@/queries/useAccountUpdateMutation";
import useAccountImageUploadMutation from "@/queries/useAccountImageUploadMutation";
import LoadingWaterDrop from "../common/LoadingWaterDrop";

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
    <div id="container-profile-image">
      <div>
        <div>
          <Image src={defaultUri} alt="test" fill={true} />
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
