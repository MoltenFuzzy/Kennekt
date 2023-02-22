import React, { useEffect, useState } from "react";
import type { Image as ImageType } from "@prisma/client";
import { default as NextImage } from "next/image";
import { AiOutlineLeft } from "react-icons/ai";
import { AiOutlineRight } from "react-icons/ai";

interface ImageCarouselProps {
  images: ImageType[];
}

const ImageCarousel: React.FC<ImageCarouselProps> = ({ images }) => {
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    if (selectedIndex < 0) {
      setSelectedIndex(images.length - 1);
    } else if (selectedIndex > images.length - 1) {
      setSelectedIndex(0);
    }
  }, [selectedIndex, images.length]);

  return (
    <div className="relative overflow-hidden">
      {images.length > 1 && (
        <>
          <button
            type="button"
            className="absolute top-1/2 left-0 ml-2 -translate-y-1/2  transform rounded-full bg-black p-2 opacity-60"
            onClick={() => setSelectedIndex(selectedIndex - 1)}
            disabled={selectedIndex === 0}
          >
            <AiOutlineLeft size={20} />
          </button>

          <button
            type="button"
            className="absolute top-1/2 right-0 mr-2 -translate-y-1/2 transform rounded-full bg-black p-2 opacity-60"
            onClick={() => setSelectedIndex(selectedIndex + 1)}
            disabled={selectedIndex === images.length - 1}
          >
            <AiOutlineRight size={20} />
          </button>
        </>
      )}

      <NextImage
        src={images[selectedIndex]?.url || ""}
        alt={images[selectedIndex]?.filename || ""}
        className={`w-full ${
          true
            ? "h-full object-cover object-center"
            : "h-full object-cover object-top"
        }`}
        width={500}
        height={500}
      />
    </div>
  );
};

export default ImageCarousel;
