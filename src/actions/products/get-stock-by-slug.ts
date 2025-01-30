"use server";

import prisma from "@/lib/prisma";

export const getStockBySlug = async (slug: string) => {
  try {
    const product = await prisma.product.findUnique({
      where: {
        slug: slug,
      },
      select: {
        inStock: true,
      },
    });

    return product?.inStock ?? null;
  } catch (error) {
    console.log("Error fetching product: ", error);
    return 0
    throw new Error("Failed to retireve the product stock.");
  }
};
