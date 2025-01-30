"use server";

import { auth } from "@/auth.config";
import prisma from "@/lib/prisma";
import { Role } from "@prisma/client";
import { revalidatePath } from "next/cache";

export const changeUserRole = async (userId: string, newRole: Role) => {
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
    await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        role: newRole,
      },
    });

    revalidatePath("/admin/users");

    return {
      ok: true,
    };
  } catch (error) {
    console.log(error);
    return {
      ok: false,
      message: "Ocurrió un error al obtener órdenes del usuario.",
    };
  }
};
