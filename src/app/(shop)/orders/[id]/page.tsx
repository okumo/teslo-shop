import { getOrderById } from "@/actions";
import { OrderStatus, PayPalButton, Title } from "@/components";
import { Size } from "@/interfaces";
import { currencyFormat } from "@/utils";
import Image from "next/image";
import { redirect } from "next/navigation";

interface Props {
  params: Promise<{
    id: string;
  }>;
}

interface CartProduct {
  id: string;
  quantity: number;
  size: Size;
  price: number;
  orderId: string;
  productId: string;
  image: string;
  title: string;
}

export default async function OrdersPage({ params }: Props) {
  const { id } = await params;

  const order = await getOrderById(id);
  const { address, cartProducts, orderInformation, ok } = order;

  if (!ok) {
    redirect("/");
  }

  return (
    <div className="flex justify-center items-center mb-72 px-10 sm:px-0">
      <div className="flex flex-col w-[1000px]">
        <Title title={`Orden #${id}`} />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
          {/* Carrito */}

          <div className="flex flex-col mt-5">
            <OrderStatus isPaid={orderInformation?.isPaid ?? false} />

            {/* Items */}
            {(cartProducts as CartProduct[]).map((product) => (
              <div key={product.id} className="flex mb-5">
                <Image
                  src={`/products/${product.image}`}
                  width={100}
                  height={100}
                  style={{
                    width: "100px",
                    height: "100px",
                  }}
                  className="rounded mr-5 "
                  alt={product.title}
                />

                <div>
                  <p>{product.title}</p>
                  <p>
                    ${product.price} x {product.quantity}
                  </p>
                  <p className="font-bold">Subtotal: ${product.price * 3}</p>

                  <button className="underline mt-3">Remover</button>
                </div>
              </div>
            ))}
          </div>

          {/* Checkout - Resumen de orden*/}

          <div className="bg-white rounded-xl shadow-xl p-7 ">
            <h2 className="text-2xl mb-2">Dirección de entrega</h2>

            <div className="mb-10">
              <p className="text-xl ">
                {address!.firstName} {address!.lastName}
              </p>
              <p>{address!.address}</p>
              <p>{address!.address2}</p>
              <p>{address!.postalCode}</p>
              <p>
                {address!.city}, {address!.country}
              </p>
              <p>{address!.phone}</p>
            </div>

            {/* Divider */}

            <div className="w-full h-0.5 rounded bg-gray-200 mb-10" />

            <h2 className="text-2xl mb-2">Resumen de orden</h2>
            <div className="grid grid-cols-2">
              <span>No. Productos</span>
              <span className="text-right">
                {orderInformation?.itemsInOrder === 1
                  ? "1 artículo"
                  : `${orderInformation?.itemsInOrder} artículos`}
              </span>

              <span>Subtotal</span>
              <span className="text-right">
                {currencyFormat(orderInformation!.subTotal)}
              </span>

              <span>Impuestos (15%)</span>
              <span className="text-right">
                {currencyFormat(orderInformation!.tax)}
              </span>

              <span className="mt-5 text-2xl">Total: </span>
              <span className="text-right mt-5">
                {" "}
                {currencyFormat(orderInformation!.total)}
              </span>
            </div>

            <div className="mt-5 mb-2 w-full">
              {orderInformation?.isPaid ? (
                <OrderStatus isPaid={orderInformation?.isPaid ?? false} />
              ) : (
                <PayPalButton
                  orderId={orderInformation!.id}
                  amount={orderInformation!.total}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
