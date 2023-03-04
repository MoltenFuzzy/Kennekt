import React, { useEffect, useState } from "react";
import type { Image as ImageType } from "@prisma/client";
import Image from "next/image";
import { AiOutlineLeft } from "react-icons/ai";
import { AiOutlineRight } from "react-icons/ai";
import { Swiper, SwiperSlide, useSwiper } from "swiper/react";
import "swiper/css";

interface SwipperButtonProps {
  children: React.ReactNode;
  type: "prev" | "next";
}

const SwiperButton = ({ children, type }: SwipperButtonProps) => {
  const swiper = useSwiper();

  return (
    <>
      {type === "prev" ? (
        <button
          type="button"
          className="absolute top-1/2 left-0 z-10 ml-2 -translate-y-1/2 transform rounded-full bg-black/40 p-2 "
          onClick={() => swiper.slidePrev()}
        >
          {children}
        </button>
      ) : (
        <button
          type="button"
          className="absolute top-1/2 right-0 z-10 mr-2 -translate-y-1/2 transform rounded-full bg-black/40 p-2 "
          onClick={() => swiper.slideNext()}
        >
          {children}
        </button>
      )}
    </>
  );
};

interface ImageCarouselProps {
  images: ImageType[];
}

const ImageCarousel: React.FC<ImageCarouselProps> = ({ images }) => {
  return (
    <Swiper>
      {images.length > 1 && (
        <>
          <SwiperButton type="prev">
            <AiOutlineLeft size={20} />
          </SwiperButton>

          <SwiperButton type="next">
            <AiOutlineRight size={20} />
          </SwiperButton>
        </>
      )}

      {images.map((image, index) => (
        <SwiperSlide key={image.id} className="flex">
          <Image
            src={images[index]?.url || ""}
            alt={images[index]?.filename || ""}
            width="0"
            height="0"
            sizes="100vw"
            className="h-full w-full self-center justify-self-center"
            priority={true}
          />
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

export default ImageCarousel;
