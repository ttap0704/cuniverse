"use client";

import ModalConfirm from "./ModalConfirm";

interface ModalSaleNFTProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

function ModalSaleNFT(props: ModalSaleNFTProps) {
  const { open, onClose, onConfirm } = props;

  return (
    <ModalConfirm
      title="NFT 판매등록"
      onConfirm={onConfirm}
      open={open}
      buttonText="생성하기"
      onClose={onClose}
    >
      <div className="modal-sale-nft-contents"></div>
    </ModalConfirm>
  );
}

export default ModalSaleNFT;
