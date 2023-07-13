import NextImage from "next/image";
import { useEffect, useRef, useState } from "react";

interface Props {
  src: string;
  alt: string;
}

// for vertical images, we need to set the height to 400 and the width to 400 / ratio
// for horizontal images, we need to set the width to 400 and the height to 400 / ratio
const RatioNextImage = ({ src, alt }: Props) => {
  const [ratio, setRatio] = useState(16 / 9); // this value can be anything by default, could be 1 if you want a square
  const [defaultWidth, setDefaultWidth] = useState(500);
  const [defaultHeight, setDefaultHeight] = useState(500);
  const [isVertical, setIsVertical] = useState(false);
  const [isHorizontal, setIsHorizontal] = useState(false);
  const imageRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const handleImageLoad = () => {
      if (imageRef.current) {
        const { naturalHeight, naturalWidth } = imageRef.current;
        const isVert = naturalHeight - naturalWidth > 100;
        console.log("isVert", isVert, naturalHeight, naturalWidth);
        if (isVert && naturalHeight > 600) {
          setDefaultHeight(300);
          setDefaultWidth(300);
        }
      }
    };

    // Add event listener for image load
    if (imageRef.current) {
      imageRef.current.addEventListener("load", handleImageLoad);
    }

    // Clean up the event listener when the component unmounts
    return () => {
      if (imageRef.current) {
        imageRef.current.removeEventListener("load", handleImageLoad);
      }
    };
  }, [isVertical, ratio]);

  return (
    <NextImage
      ref={imageRef}
      src={src}
      width={isHorizontal ? defaultWidth / ratio : defaultWidth}
      height={isVertical ? defaultHeight / ratio : defaultHeight}
      onLoadingComplete={({ naturalWidth, naturalHeight }) => {
        // sometimes returns NaN, so we need to check for that
        if (naturalWidth && naturalHeight) {
          if (naturalWidth > naturalHeight) {
            setIsHorizontal(true);
            setRatio(naturalHeight / naturalWidth);
          } else {
            setIsVertical(true);
            setRatio(naturalWidth / naturalHeight);
          }
        }
      }}
      alt={alt}
      unoptimized
    />
  );
};
export default RatioNextImage;
