"use server";

import { auth } from "@/auth.config";
import prisma from "@/lib/prisma";

export const getPaginatedUsers = async () => {
  const session = await auth();

  if (!session?.user) {
    return {
      ok: false,
      message: "Debe estar autenticado!",
    };
  }

  if (session.user.role !== "admin") {
    return {
      ok: false,
      message: "Debe tener el rol de tipo Admin",
    };
  }

  try {
    const users = await prisma.user.findMany({
      orderBy: {
        name: "desc",
      },
    });

    return {
      ok: true,
      users: users,
    };
  } catch (error) {
    console.log(error);
    return {
      ok: false,
      message: "Ocurrió un error al obtener órdenes del usuario.",
    };
  }
};
