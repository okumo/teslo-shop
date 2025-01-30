"use server";

import { auth } from "@/auth.config";
import prisma from "@/lib/prisma";

export const getPaginatedOrders = async () => {
  const session = await auth();

  if (!session?.user) {
    return {
      ok: false,
      message: "Debe estar autenticado!",
    };
  }

  try {
    const orders = await prisma.order.findMany({
      orderBy: {
        createdAt: "desc",
      },
      include: {
        OrderAddress: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    return {
      ok: true,
      orders: orders,
    };
  } catch (error) {
    console.log(error);
    return {
      ok: false,
      message: "Ocurrió un error al obtener órdenes del usuario.",
    };
  }
};
