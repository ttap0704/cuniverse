"use client";

import * as ImageCompoennt from "next/image";
import NoPickture from "@/images/no-picture.png";
import { useEffect, useState } from "react";

function ImageCuniverse(props: ImageCompoennt.ImageProps) {
  const { src } = props;
  const [imageSrc, setImageSrc] = useState(
    typeof src == "string" && !src.includes("/") ? `/${src}` : src
  );

  useEffect(() => {
    setImageSrc(typeof src == "string" && !src.includes("/") ? `/${src}` : src);
  }, [src]);

  return (
    <ImageCompoennt.default
      {...props}
      src={imageSrc}
      onError={(err) => setImageSrc(NoPickture)}
      style={{ objectFit: "cover" }}
    />
  );
}

export default ImageCuniverse;
