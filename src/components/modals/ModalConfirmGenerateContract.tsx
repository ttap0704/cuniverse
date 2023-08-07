import { useState } from "react";
import ModalConfirm from "./ModalConfirm";
import ButtonRadioWithDescription from "../buttons/ButtonRadioWithDescription";

interface ModalConfirmGenerateContractProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (mode: string) => void;
}

function ModalConfirmGenerateContract(
  props: ModalConfirmGenerateContractProps
) {
  const { open, onClose, onConfirm } = props;
  const [radioOptions, setRadioOptions] = useState<ButtonRadioInterface[]>([
    {
      id: "generate-new",
      title: "생성하기",
      description: "새로운 컬렉션을 생성합니다.",
      checked: true,
    },
    {
      id: "generate-old",
      title: "가져오기",
      description:
        "다른 NFT 마켓에서 등록한 컬렉션을 가져옵니다. (ex. opensea)",
      checked: false,
    },
  ]);

  const handleOptions = (idx: number) => {
    const tmpOptions: ButtonRadioInterface[] = JSON.parse(
      JSON.stringify(radioOptions)
    );
    tmpOptions.map((option, optionIdx) => {
      if (idx == optionIdx) option.checked = true;
      else option.checked = false;

      return option;
    });

    setRadioOptions([...tmpOptions]);
  };

  const confirmGenerate = () => {
    const findOption = radioOptions.find((option) => option.checked);
    console.log(findOption);
    if (findOption) onConfirm(findOption.id);
  };

  return (
    <ModalConfirm
      title="컬렉션 생성 방법"
      onConfirm={confirmGenerate}
      open={open}
      buttonText="생성하기"
      onClose={onClose}
    >
      <div className="modal-confrim-generate-contract-contents">
        {radioOptions.map((option, optionIdx) => {
          return (
            <ButtonRadioWithDescription
              key={`radio-button-${option.id}`}
              {...option}
              onChange={() => handleOptions(optionIdx)}
            />
          );
        })}
      </div>
    </ModalConfirm>
  );
}

export default ModalConfirmGenerateContract;
