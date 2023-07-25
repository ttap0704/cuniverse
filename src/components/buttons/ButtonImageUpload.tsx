import useAccountQuery from "@/queries/useAccountQuery";
import { PiNotePencil } from "react-icons/pi";

interface ButtonImageUploadProps {
  targetId: string;
}

function ButtonImageUpload(props: ButtonImageUploadProps) {
  const targetId = props.targetId;

  const clickUploadInput = () => {
    const inputEl = document.getElementById(targetId);
    if (inputEl) inputEl.click();
  };

  return (
    <button className="button-image-upload" onClick={clickUploadInput}>
      <PiNotePencil />
    </button>
  );
}

export default ButtonImageUpload;
