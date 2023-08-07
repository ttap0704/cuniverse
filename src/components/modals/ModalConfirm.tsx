"use client";

import { PropsWithChildren, useEffect, useState } from "react";
import Button from "../buttons/Button";
import { IoClose } from "react-icons/io5";

interface ModalConfirmProps extends PropsWithChildren {
  open: boolean;
  title: string;
  onConfirm: () => void;
  onClose: () => void;
  buttonText: string;
}

function ModalConfirm(props: ModalConfirmProps) {
  const { title, children, onConfirm, open, buttonText, onClose } = props;

  const [modalOpen, setModalOpen] = useState(false);
  const [opacity, setOpacity] = useState(0);

  useEffect(() => {
    if (open) setOpacity(1), setModalOpen(open);
    else setOpacity(0), setTimeout(() => setModalOpen(open), 300);
  }, [open]);

  return open || modalOpen ? (
    <div className="modal-confirm-wrapper" style={{ opacity: opacity }}>
      <div>
        <div className="modal-confrim-header">
          <h2>{title}</h2>
          <IoClose onClick={onClose} />
        </div>
        <div className="modal-confirm-contents">{children}</div>
        <div className="modal-confirm-button">
          <Button onClick={onConfirm}>{buttonText}</Button>
        </div>
      </div>
    </div>
  ) : null;
}

export default ModalConfirm;
