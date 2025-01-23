import prisma from "../lib/prisma";
import { initialData } from "./seed";
import { countries } from "./seed-country";

async function main() {
  // 1. Borrar registros previos
  // await Promise.all([
  await prisma.orderAddress.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.userAddress.deleteMany();
  await prisma.user.deleteMany();

  await prisma.productImage.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.country.deleteMany();
  // ]);

  const { categories, products, users } = initialData;

  // countries
  await prisma.country.createMany({
    data: countries,
  });

  // users
  await prisma.user.createMany({
    data: users,
  });

  const categoriesData = categories.map((category) => ({ name: category }));

  // categories
  await prisma.category.createMany({
    data: categoriesData,
  });

  const categoriesDB = await prisma.category.findMany();

  const categoriesMap = categoriesDB.reduce((map, category) => {
    map[category.name.toLowerCase()] = category.id;
    return map;
  }, {} as Record<string, string>); //<string =shirt, string= categoryId>

  // Productos

  products.forEach(async (product) => {
    const { type, images, ...rest } = product;

    const dbProduct = await prisma.product.create({
      data: {
        ...rest,
        categoryId: categoriesMap[type],
      },
    });

    // Images

    const imagesData = images.map((image) => ({
      url: image,
      productId: dbProduct.id,
    }));

    await prisma.productImage.createMany({
      data: imagesData,
    });
  });

  console.log("Se ejecutó correctamente");
}

(() => {
  if (process.env.NODE_ENV === "production") return;

  main();
})();
