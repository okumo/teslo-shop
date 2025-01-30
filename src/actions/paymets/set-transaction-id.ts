"use server";

import { auth } from "@/auth.config";
import prisma from "@/lib/prisma";

export const setTransactionId = async (
  transactionId: string,
  orderId: string
) => {
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

    const order = await prisma.order.update({
      where: {
        id: orderId,
      },
      data: {
        transactionId: transactionId,
      },
    });
    if (!order) {
      return {
        ok: false,
        message: "No se pudo setear el transaction Id",
      };
    }

    return {
      ok: true,
      order: orderId,
    };
  } catch (error) {
    console.log(error);
    return {
      ok: false,
      message: "Ocurrió un error en la transacción",
    };
  }
};
