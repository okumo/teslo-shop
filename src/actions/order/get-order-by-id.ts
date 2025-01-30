"use server";

import { auth } from "@/auth.config";
import { Address, Size } from "@/interfaces";
import prisma from "@/lib/prisma";
interface OrderBase {
  id: string;
  subTotal: number;
  tax: number;
  total: number;
  itemsInOrder: number;
  isPaid: boolean;
  paidAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
}

interface ProductToOrder {
  productId: string;
  size: Size;
  quantity: number;
}

interface OrderInformation extends OrderBase {
  OrderAddress: Address;
  OrderItem: ProductToOrder[];
}

export const getOrderById = async (orderId: string) => {
  try {
    const session = await auth();

    const userId = session?.user.id;

    // verificar sesión de usuario

    if (!userId) {
      return {
        ok: false,
        message: "No hay sesión de usuario",
      };
    }
    const orderInformation = await prisma.order.findUnique({
      where: {
        id: orderId,
      },
      include: {
        OrderAddress: true,
        OrderItem: true,
      },
    });

    const { OrderAddress, OrderItem, ...restOrder } =
      orderInformation as unknown as OrderInformation;

    const products = await prisma.product.findMany({
      where: {
        id: {
          in: OrderItem.map((p) => p.productId),
        },
      },
    });

    const productImages = await prisma.productImage.findMany({
      where: {
        productId: {
          in: products.map((p) => p.id),
        },
      },
    });

    return {
      ok: true,
      orderInformation: restOrder,
      address: OrderAddress,
      cartProducts: OrderItem.map((cartProduct) => {
        const image = productImages.find(
          (p) => p.productId === cartProduct.productId
        )?.url;
        const productBasicInformation = products.find(
          (p) => p.id === cartProduct.productId
        );
        return {
          ...cartProduct,
          image: image,
          title: productBasicInformation?.title,
        };
      }),
    };
  } catch (error) {
    console.log(error);
    return {
      ok: false,
      message: "An error ocurred trying to get order by Id",
    };
  }
};
