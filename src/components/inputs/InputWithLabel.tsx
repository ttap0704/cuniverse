import Image from "next/image";
import ButtonImageUpload from "../buttons/ButtonImageUpload";
import Input from "./Input";
import InputImage from "./InputImage";
import { HiOutlinePhoto } from "react-icons/hi2";
import { useEffect, useState } from "react";

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
        onChange(reader.result, false);
        setImagePath(reader.result as string);
      };
    }
  };

  return (
    <div className="input-width-label">
      <label htmlFor={id}>
        {labelText}
        {required ? <span>*</span> : null}
      </label>
      {type == "file" ? (
        <div className={`file-input-wrapper ${id}-wrapper`}>
          <ButtonImageUpload targetId={id} />
          <InputImage id={id} onChange={handleFile} />
          {imagePath.length !== 0 ? (
            fileType == "image" ? (
              <Image
                src={imagePath}
                alt="uploaded-image"
                objectFit="cover"
                fill={true}
              />
            ) : (
              <video src={imagePath} loop={true} />
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
