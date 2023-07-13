import NextImage from "next/image";
import { useState } from "react";

interface Props {
  src: string;
  alt: string;
}

const RatioNextImage = ({ src, alt }: Props) => {
  const [ratio, setRatio] = useState(16 / 9); // this value can be anything by default, could be 1 if you want a square
  return (
    <NextImage
      src={src}
      width={500}
      height={500 / ratio}
      onLoadingComplete={({ naturalWidth, naturalHeight }) => {
        // sometimes returns NaN, so we need to check for that
        if (naturalWidth && naturalHeight)
          setRatio(naturalWidth / naturalHeight);
      }}
      alt={alt}
      unoptimized
    />
  );
};
export default RatioNextImage;
