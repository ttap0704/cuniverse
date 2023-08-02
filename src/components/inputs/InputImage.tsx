"use client";

import React from "react";

// Image Upload를 위한 Input Component

interface InputImageProps {
  id: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

function InputImage(props: InputImageProps) {
  const id = props.id;
  const onChange = props.onChange;

  return <input type="file" id={id} name={id} onChange={onChange} />;
}

export default InputImage;
