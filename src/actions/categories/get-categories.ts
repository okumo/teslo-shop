"use server";

import prisma from "@/lib/prisma";

export const getCategories = async () => {
  try {
    const categories = await prisma.category.findMany({
      orderBy:{
        name: 'asc'
      }
    });

    return {
      ok: true,
      data: categories,
    };
  } catch (error) {
    console.log(error);
    return {
      ok: false,
      message: "Ocurrió un error para obtener las categorias.",
    };
  }
};
