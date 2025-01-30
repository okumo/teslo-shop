"use client";
import { getStockBySlug } from "@/actions";
import { titleFont } from "@/config/fonts";
import React, { useEffect, useState } from "react";

interface Props {
  slug: string;
}
export const StockLabel = ({ slug }: Props) => {
  const [isLoading, setIsLoading] = useState(true);
  const [stock, setStock] = useState<number | null>(0);

  useEffect(() => {
    getStock();
  }, []);

  const getStock = async () => {
    const stockResult = await getStockBySlug(slug);
    setStock(stockResult);
    setIsLoading(false);
  };

  return (
    <>
      {isLoading ? (
        <h1
          className={`${titleFont.className} antialised font-bold text-md animate-pulse bg-gray-200`}
        >
          &nbsp;
        </h1>
      ) : (
        <h1 className={`${titleFont.className} antialised font-bold text-md`}>
          Stock: {stock}
        </h1>
      )}
    </>
  );
};
