"use client";

import * as ImageCompoennt from "next/image";
import NoPickture from "@/images/no-picture.png";
import { useEffect, useState } from "react";

interface ImageCuniverseProps extends ImageCompoennt.ImageProps {
  fixed?: boolean;
}

function ImageCuniverse(props: ImageCuniverseProps) {
  const { src, fixed, width, height } = props;
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
      style={
        fixed
          ? { width, height }
          : { objectFit: "cover", width: "100%", height: "100%" }
      }
    />
  );
}

export default ImageCuniverse;
