"use client";

import * as ImageCompoennt from "next/image";
import NoPickture from "@/images/no-picture.png";
import { useState } from "react";

function ImageCuniverse(props: ImageCompoennt.ImageProps) {
  const { src } = props;
  const [imageSrc, setImageSrc] = useState(
    typeof src == "string" && !src.includes("/") ? `/${src}` : src
  );

  return (
    <ImageCompoennt.default
      {...props}
      src={imageSrc}
      onError={(err) => setImageSrc(NoPickture)}
    />
  );
}

export default ImageCuniverse;
