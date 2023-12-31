import ButtonImageUpload from "../buttons/ButtonImageUpload";
import Input from "./Input";
import InputImage from "./InputImage";
import { HiOutlinePhoto } from "react-icons/hi2";
import { useState } from "react";
import TypographyInputLabel from "../typography/TypographyInputLabel";
import ImageCuniverse from "../common/ImageCuniverse";
import inputStyles from "@/css/components/inputs.module.scss";

// 정보 수정 / 추가에 사용되는 Input Component

interface InputWithLabelProps extends InputProps {
  labelText: string;
  required: boolean;
}

function InputWithLabel(props: InputWithLabelProps) {
  const id = props.id;
  const labelText = props.labelText;
  const type = props.type;
  const value = props.value;
  const onChange = props.onChange;
  const required = props.required;

  const [imagePath, setImagePath] = useState(value);
  const [fileType, setFileType] = useState("");

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const file: File = e.target.files[0];
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        if (file.type.includes("video")) setFileType("video");
        else setFileType("image");
        if (typeof reader.result == "string") {
          onChange(reader.result, false);
          setImagePath(reader.result as string);
        }
      };
    }
  };

  return (
    <div className={inputStyles["input-width-label"]}>
      <TypographyInputLabel id={id} labelText={labelText} required={required} />
      {type == "file" ? (
        <div
          className={`${inputStyles["file-input-wrapper"]} ${
            id ? inputStyles[`${id}-wrapper`] : ""
          }`}
        >
          <ButtonImageUpload targetId={id} />
          <InputImage id={id} onChange={handleFile} />
          {`${imagePath}`.length !== 0 ? (
            fileType == "image" ? (
              <ImageCuniverse
                src={`${imagePath}`}
                alt="uploaded-image"
                width={210}
                height={210}
              />
            ) : (
              <video src={`${imagePath}`} loop={true} />
            )
          ) : (
            <HiOutlinePhoto />
          )}
        </div>
      ) : (
        <Input {...props} />
      )}
    </div>
  );
}

export default InputWithLabel;
