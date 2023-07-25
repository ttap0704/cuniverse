import Image from "next/image";
import ButtonImageUpload from "../buttons/ButtonImageUpload";
import InputImage from "../inputs/InputImage";
import { uploadImageToS3 } from "@/utils/tools";
import useAccountUpdateMutation from "@/queries/useAccountUpdateMutation";

interface ContainerProfileImageProps {
  defaultUri: string;
  edit: boolean;
}

function ContainerProfileImage(props: ContainerProfileImageProps) {
  const { mutate: updateAccount } = useAccountUpdateMutation();
  const defaultUri = props.defaultUri;
  const edit = props.edit;

  const uploadProfile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length) {
      const uploadedFile: File = e.target.files[0];
      const profileImage = await uploadImageToS3(uploadedFile);
      const updateRes = await updateAccount({
        data: { profile: profileImage },
      });
    }
  };

  return (
    <div id="container-profile-image">
      <div>
        <div>
          <Image src={defaultUri} alt="test" fill={true} />
          {edit ? (
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

export default ContainerProfileImage;
