"use client";
import { QuantitySelector, SizeSelector } from "@/components";
import { CartProduct, Product } from "@/interfaces";
import { Size } from "@/seed/seed";
import { useCartStore } from "@/store/cart/cart-store";
import React, { useState } from "react";

interface Props {
  product: Product;
}

export const AddToCart = ({ product }: Props) => {

  const addProductToCart = useCartStore(state => state.addProductToCart)
  const [size, setSize] = useState<Size | undefined>();
  const [quantity, setQuantity] = useState<number>(1);
  const [posted, setPosted] = useState(false);

  const onQuantityChanged = (value: number) => {
    if (quantity + value < 1) return;
    setQuantity(value + quantity);
  };

  const addToCart = () => {
    setPosted(true);

    if (!size) return;
    
    const cartProduct: CartProduct = {
      id: product.id,
      title: product.title,
      quantity: quantity,
      slug: product.slug,
      price: product.price,
      size: size,
      image: product.images[0]
    }

    addProductToCart(cartProduct)
  };

  return (
    <>
      {posted && !size && (
        <span className="mt-2 text-red-500 fade-in">
          Debe seleccionar una talla
        </span>
      )}
      {/* Selector de tallas */}
      <SizeSelector
        availableSizes={product.sizes}
        selectedSize={size}
        onSizeChanged={setSize}
      />
      {/* Selector de Cantidad */}
      <QuantitySelector
        quantity={quantity}
        onQuantityChanged={onQuantityChanged}
      />
      {/* Button */}
      <button className="btn-primary my-5" onClick={addToCart}>
        Agregar al carrito
      </button>
    </>
  );
};
