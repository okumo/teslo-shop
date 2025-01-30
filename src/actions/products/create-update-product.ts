"use server";

import { Size } from "@/interfaces";
import prisma from "@/lib/prisma";
import { Gender, Product } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { v2 as cloudinary } from "cloudinary";
cloudinary.config(process.env.CLOUDINARY_URL ?? "");

const productSchema = z.object({
  id: z.string().uuid().optional().nullable(),
  title: z.string().min(3).max(255),
  slug: z.string().min(3).max(255),
  description: z.string(),
  price: z.coerce
    .number()
    .min(0)
    .transform((val) => Number(val.toFixed(2))),
  inStock: z.coerce
    .number()
    .min(0)
    .transform((val) => Number(val.toFixed(0))),
  categoryId: z.string().uuid(),
  sizes: z.coerce.string().transform((val) => val.split(",")),
  tags: z.string(),
  gender: z.nativeEnum(Gender),
});

export const createUpdateProduct = async (formData: FormData) => {
  const data = Object.fromEntries(formData);
  const productParsed = productSchema.safeParse(data);

  if (!productParsed.success) {
    console.log(productParsed.error);
    return {
      ok: false,
    };
  }

  const product = productParsed.data;
  product.slug = product.slug.toLowerCase().replace(/ /g, "-").trim();

  const { id, ...restProduct } = product;

  try {
    const prismaTx = await prisma.$transaction(async () => {
      let newProduct: Product;

      const tagsArray = restProduct.tags
        .split(",")
        .map((tag) => tag.trim().toLocaleLowerCase());

      if (id) {
        //actualizar

        newProduct = await prisma.product.update({
          where: {
            id: id,
          },
          data: {
            ...restProduct,
            sizes: {
              set: restProduct.sizes as Size[],
            },
            tags: {
              set: tagsArray,
            },
          },
        });
      } else {
        // create

        newProduct = await prisma.product.create({
          data: {
            ...restProduct,
            sizes: {
              set: restProduct.sizes as Size[],
            },
            tags: {
              set: tagsArray,
            },
          },
        });
      }

      // Todo
      // proceso de carga de imagenes
      // Recorrer las imágenes guardadas
      if (formData.getAll("images")) {
        const images = await uploadImages(formData.getAll("images") as File[]);

        if (!images) {
          throw new Error("No se pudo cargar las imágenes, rollingback");
        }
        await prisma.productImage.createMany({
          data: images.map((image) => ({
            url: image!,
            productId: newProduct.id,
          })),
        });
      }

      return {
        product: newProduct,
      };
    });

    // Todo: RevalidatePaths

    revalidatePath("/admin/products");
    revalidatePath(`/admin/product/${product.slug}`);
    revalidatePath(`/products/${product.slug}`);

    return {
      ok: true,
      product: prismaTx.product,
    };
  } catch (error) {
    console.log(error);
    return {
      ok: false,
      message: "Revisar los logs, no se pudo actualizar/crear",
    };
  }
};

const uploadImages = async (images: File[]) => {
  try {
    const uploadPromises = images.map(async (image) => {
      try {
        const buffer = await image.arrayBuffer();
        const base64Image = Buffer.from(buffer).toString("base64");

        return cloudinary.uploader
          .upload(`data:image/png;base64,${base64Image}`)
          .then((r) => r.secure_url);
      } catch (error) {
        console.log(error);
        return null;
      }
    });

    const uploadedImages = await Promise.all(uploadPromises);
    return uploadedImages;
  } catch (error) {
    console.log(error);
    return null;
  }
};
