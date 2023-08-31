"use client";

import { PropsWithChildren, useEffect, useState } from "react";
import Button from "../buttons/Button";
import { IoClose } from "react-icons/io5";
import LoadingWaterDrop from "../common/LoadingWaterDrop";

interface ModalConfirmProps extends PropsWithChildren {
  open: boolean;
  title: string;
  onConfirm: () => void;
  onClose: () => void;
  buttonText: string;
  useLoading?: boolean;
}

function ModalConfirm(props: ModalConfirmProps) {
  const { title, children, onConfirm, open, buttonText, onClose, useLoading } =
    props;

  const [modalOpen, setModalOpen] = useState(false);
  const [opacity, setOpacity] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) setOpacity(1), setModalOpen(open);
    else setOpacity(0), setTimeout(() => setModalOpen(open), 300);
  }, [open]);

  const handleConfirm = async () => {
    if (useLoading) setLoading(true);
    await onConfirm();
    if (useLoading) setLoading(false);
  };

  return open || modalOpen ? (
    <div className="modal-confirm-wrapper" style={{ opacity: opacity }}>
      <div className="modal-confrim-contents-wrapper">
        {loading ? <LoadingWaterDrop /> : null}
        <div className="modal-confirm-contents">
          <div className="modal-confrim-header">
            <h2>{title}</h2>
            <IoClose onClick={onClose} />
          </div>
          <div className="modal-confirm-contents">{children}</div>
          <div className="modal-confirm-button">
            <Button onClick={handleConfirm}>{buttonText}</Button>
          </div>
        </div>
      </div>
    </div>
  ) : null;
}

export default ModalConfirm;
