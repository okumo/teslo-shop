"use client";

import { placeOrder } from "@/actions/order/place-order";
import { useAddressStore } from "@/store/address/address-store";
import { useCartStore } from "@/store/cart/cart-store";
import { currencyFormat } from "@/utils";
import clsx from "clsx";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useShallow } from "zustand/shallow";

export const PlaceOrder = () => {
  const [loaded, setLoaded] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | undefined>("");
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);

  const router = useRouter();
  const address = useAddressStore((state) => state.address);
  const { itemsCart, subTotal, tax, total } = useCartStore(
    useShallow((state) => state.getSummaryInformation())
  );

  const cart = useCartStore((state) => state.cart);
  const clearCart = useCartStore((state) => state.clearCart);

  useEffect(() => {
    setLoaded(true);
  }, []);

  const onPlaceOrder = async () => {
    const productsToOrder = cart.map((product) => ({
      productId: product.id,
      quantity: product.quantity,
      size: product.size,
    }));

    setIsPlacingOrder(true);
    const response = await placeOrder(productsToOrder, address);
    if (!response.ok) {
      setIsPlacingOrder(false);
      setErrorMessage(response.message);
      return;
    }

    // todo salió bien
    clearCart();
    router.replace("/orders/" + response.order?.id);
  };

  if (!loaded) {
    return <p>Cargando...</p>;
  }

  return (
    <div className="bg-white rounded-xl shadow-xl p-7 ">
      <h2 className="text-2xl mb-2">Dirección de entrega</h2>

      <div className="mb-10">
        <p className="text-xl ">
          {address.firstName} {address.lastName}
        </p>
        <p>{address.address}</p>
        <p>{address.address2}</p>
        <p>{address.postalCode}</p>
        <p>
          {address.city}, {address.country}
        </p>
        <p>{address.phone}</p>
      </div>

      {/* Divider */}

      <div className="w-full h-0.5 rounded bg-gray-200 mb-10" />

      <h2 className="text-2xl mb-2">Resumen de orden</h2>
      <div className="grid grid-cols-2">
        <span>No. Productos</span>
        <span className="text-right">
          {itemsCart === 1 ? "1 artículo" : `${itemsCart} artículos`}
        </span>

        <span>Subtotal</span>
        <span className="text-right">{currencyFormat(subTotal)}</span>

        <span>Impuestos (15%)</span>
        <span className="text-right">{currencyFormat(tax)}</span>

        <span className="mt-5 text-2xl">Total: </span>
        <span className="text-right mt-5"> {currencyFormat(total)}</span>
      </div>

      <div className="mt-5 mb-2 w-full">
        <p className="mb-5">
          {/* Disclaimer */}

          <span className="text-xs">
            Al hacer clic en {`"Colocar orden"`}, aceptas nuestros{" "}
            <a href="#" className="underline">
              Términos y Condiciones
            </a>{" "}
            y{" "}
            <a href="#" className="underline">
              Políticas de privacidad
            </a>
          </span>
        </p>
        {errorMessage ?? <p>{errorMessage}</p>}

        <button
          className={clsx({
            "btn-primary": !isPlacingOrder,
            "btn-disabled": isPlacingOrder,
          })}
          onClick={onPlaceOrder}
        >
          Colocar orden
        </button>
      </div>
    </div>
  );
};
