"use client";

import { setModalAlertAtom } from "@/store/modalAlert";
import { useSetAtom } from "jotai";
import React from "react";

// Image Upload를 위한 Input Component

interface InputImageProps {
  id: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

function InputImage(props: InputImageProps) {
  const id = props.id;
  const onChange = props.onChange;
  const setModalAlert = useSetAtom(setModalAlertAtom);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0]) {
      const file = files[0];
      const limit = 20000000; // 10MB;

      if (limit < file.size) {
        setModalAlert({
          type: "error",
          text: "이미지는 최대 20MB까지 업로드가 가능합니다.",
          open: true,
        });
        return;
      }
    }
    onChange(e);
  };

  return (
    <input
      type="file"
      id={id}
      name={id}
      onChange={handleFile}
      accept="image/*"
    />
  );
}

export default InputImage;
