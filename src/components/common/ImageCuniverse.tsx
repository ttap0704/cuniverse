import * as ImageCompoennt from "next/image";

function ImageCuniverse(props: ImageCompoennt.ImageProps) {
  const { src } = props;

  return (
    <ImageCompoennt.default
      {...props}
      src={typeof src == "string" && !src.includes("/") ? `/${src}` : src}
    />
  );
}

export default ImageCuniverse;
