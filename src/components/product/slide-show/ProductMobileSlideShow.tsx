"use client";

import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";

import { Autoplay, FreeMode, Pagination } from "swiper/modules";
import Image from "next/image";

// Import Swiper styles
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/pagination";

import "./slide-show.css";

interface Props {
  images: string[];
  title: string;
  className?: string;
}

export const ProductMobileSlideShow = ({ className, images, title }: Props) => {
  return (
    <div className={className}>
      <Swiper
        modules={[FreeMode, Autoplay, Pagination]}
        className="mySwiper2"
        autoplay={{ delay: 2500 }}
        style={{
          width: "100vw",
          height: "500px",
        }}
        pagination
      >
        {images.map((image) => (
          <SwiperSlide key={image}>
            <Image
              width={600}
              height={500}
              src={`/products/${image}`}
              alt={title}
              className=" object-fill"
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};
