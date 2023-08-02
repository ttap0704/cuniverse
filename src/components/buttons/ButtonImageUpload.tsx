import { PiNotePencil } from "react-icons/pi";

// File Upload를 위한 Button Component

interface ButtonImageUploadProps {
  targetId: string;
}

function ButtonImageUpload(props: ButtonImageUploadProps) {
  const targetId = props.targetId;

  // input의 id를 통해
  // File Uploader 생성되도록 설정
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
