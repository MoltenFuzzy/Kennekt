import React from "react";
import type { Image as ImageType } from "@prisma/client";
import Image from "next/image";
import { AiOutlineLeft } from "react-icons/ai";
import { AiOutlineRight } from "react-icons/ai";
import { Swiper, SwiperSlide, useSwiper } from "swiper/react";
import "swiper/css";
import RatioNextImage from "./RatioNextImage";

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

      {/* Embed image sizes for a more consistant aspect ratio */}
      {images.map((image, index) => (
        <SwiperSlide key={image.id}>
          <RatioNextImage
            src={images[index]?.url || ""}
            alt={images[index]?.filename || ""}
          />
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

export default ImageCarousel;
