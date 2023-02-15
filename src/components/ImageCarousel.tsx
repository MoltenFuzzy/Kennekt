import React, { useEffect, useState } from "react";
import type { Image as ImageType } from "@prisma/client";
import { default as NextImage } from "next/image";

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
    <div className="relative overflow-hidden text-red-500">
      <button
        className="absolute top-0 left-0 p-5"
        onClick={() => setSelectedIndex(selectedIndex - 1)}
        disabled={selectedIndex === 0}
      >
        Prev
      </button>

      <button
        className="absolute top-0 right-0 p-5"
        onClick={() => setSelectedIndex(selectedIndex + 1)}
        disabled={selectedIndex === images.length - 1}
      >
        Next
      </button>

      <NextImage
        src={images[selectedIndex]?.url || ""}
        alt={images[selectedIndex]?.filename || ""}
        className={`w-full ${
          true
            ? "h-64 object-cover object-center"
            : "h-full object-cover object-top"
        }`}
        width={500}
        height={500}
      />
    </div>
  );
};

export default ImageCarousel;
