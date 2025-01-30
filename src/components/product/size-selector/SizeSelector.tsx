import { Size } from "@/seed/seed";
import clsx from "clsx";
import React from "react";

interface Props {
  selectedSize: Size | undefined;
  availableSizes: Size[];
  onSizeChanged: (size: Size) => void;
}

export const SizeSelector = ({ availableSizes, selectedSize, onSizeChanged }: Props) => {
  return (
    <div className="my-5">
      <h3 className="font-bold mb-4">Tallas disponibles</h3>
      <div className="flex">
        {availableSizes.map((size) => (
          <button
            className={clsx("mx-2 hover:underline text-lg", {
              underline: size === selectedSize,
            })}
            onClick={()=> onSizeChanged(size)}
            key={size}
          >
            {size}
          </button>
        ))}
      </div>
    </div>
  );
};
