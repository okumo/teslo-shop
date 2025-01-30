"use client";
import Image from "next/image";
import React from "react";

interface Props {
  src?: string;
  className?: React.StyleHTMLAttributes<HTMLImageElement>["className"];
  alt: string;
  width: number;
  height: number;
  style?: React.StyleHTMLAttributes<HTMLImageElement>["style"];
}

export const ProductImage = ({
  src,
  className,
  alt,
  style,
  width,
  height,
}: Props) => {
  const localSrc = src
    ? src.startsWith("http")
      ? src
      : `/products/${src}`
    : "/imgs/placeholder.jpg";
  return (
    <Image
      width={width}
      height={height}
      src={localSrc}
      alt={alt}
      className={className}
      style={style}
    />
  );
};
