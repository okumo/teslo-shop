"use client";
import React from "react";
import { IoAddCircleOutline, IoRemoveCircleOutline } from "react-icons/io5";

interface Props {
  quantity: number;
  onQuantityChanged: (quantity: number) => void;
}
export const QuantitySelector = ({ quantity, onQuantityChanged }: Props) => {
  return (
    <div className="flex">
      <button onClick={() => onQuantityChanged(-1)}>
        <IoRemoveCircleOutline size={30} />
      </button>

      <span className="w-20 mx-3 px-5 bg-gray-100 text-center rounded">
        {quantity}
      </span>

      <button onClick={() => onQuantityChanged(+1)}>
        <IoAddCircleOutline size={30} />
      </button>
    </div>
  );
};
