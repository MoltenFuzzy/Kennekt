import React from "react";
import type { Image as ImageType } from "@prisma/client";
import { Carousel } from "flowbite-react";
import Image from "next/image";

interface ImageCarouselProps {
  images: ImageType[];
}

const ImageCarousel = ({ images }: ImageCarouselProps) => {
  return (
    <div className="h-56 sm:h-64 xl:h-80 2xl:h-96">
      {images.length > 1 ? (
        <Carousel slide={false}>
          {images.map((image) => (
            <Image
              key={image.id}
              src={image.url}
              alt={image.filename || ""}
              width={400}
              height={400}
            />
          ))}
        </Carousel>
      ) : (
        <Carousel slide={false} leftControl rightControl indicators={false}>
          {images.map((image) => (
            <Image
              key={image.id}
              src={image.url}
              alt={image.filename || ""}
              width={400}
              height={400}
            />
          ))}
        </Carousel>
      )}
    </div>
  );
};

export default ImageCarousel;
