"use server";
import { auth } from "@/auth.config";
import { Address, Size } from "@/interfaces";
import prisma from "@/lib/prisma";

interface ProductToOrder {
  productId: string;
  size: Size;
  quantity: number;
}

export const placeOrder = async (
  productsToOrder: ProductToOrder[],
  address: Address
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

    // obtener info de los productos
    // Nota: recuerden que podemos llevar más de 2 productos con el mismo ID

    const products = await prisma.product.findMany({
      where: {
        id: {
          in: productsToOrder.map((product) => product.productId),
        },
      },
    });

    const itemsQuantity = productsToOrder.reduce(
      (count, p) => count + p.quantity,
      0
    );

    // los totales de tax, subtotal y total
    const { subTotal, tax, total } = productsToOrder.reduce(
      (totals, item) => {
        const productQuantity = item.quantity;
        const product = products.find(
          (product) => product.id === item.productId
        );

        if (!product) throw new Error(`${item.productId} no existe - 500`);

        const subTotal = product.price * productQuantity;

        totals.subTotal += subTotal;
        totals.tax += subTotal * 0.15;
        totals.total += subTotal * 1.15;

        return totals;
      },
      { subTotal: 0, tax: 0, total: 0 }
    );

    // Crear la transacción de base de datos

    const prismaTx = await prisma.$transaction(async (tx) => {
      // 1. Actualizar el stock de los productos

      const updatedProductsPromises = products.map((product) => {
        // Acumular los valores
        const productQuantity = productsToOrder
          .filter((p) => p.productId === product.id)
          .reduce((acc, item) => item.quantity + acc, 0);

        if (productQuantity === 0) {
          throw new Error(`${product.id} no tiene cantidad definida`);
        }

        return tx.product.update({
          where: {
            id: product.id,
          },
          data: {
            // nohacer inStock: product.inStock - productQuantity // no hacer
            inStock: {
              decrement: productQuantity,
            },
          },
        });
      });

      const updatedProducts = await Promise.all(updatedProductsPromises);

      // Verificar valores negativos en la existencia = no hay stock

      updatedProducts.forEach((product) => {
        if (product.inStock < 0) {
          throw new Error(`${product.title} no tiene inventario suficiente`);
        }
      });

      // 2. Crear la orden - Encabezado - Detalles

      const order = await tx.order.create({
        data: {
          userId: userId,
          itemsInOrder: itemsQuantity,
          subTotal: subTotal,
          tax: tax,
          total: total,

          OrderItem: {
            createMany: {
              data: productsToOrder.map((product) => ({
                quantity: product.quantity,
                size: product.size,
                productId: product.productId,
                price:
                  products.find((p) => p.id === product.productId)?.price ?? 0,
              })),
            },
          },
          // otra forma de crear el order address
          // OrderAddress: {
          //   create: {
          //     address: address.address,
          //     city: address.city,
          //     firstName: address.firstName,
          //     lastName: address.lastName,
          //     phone: address.phone,
          //     postalCode: address.postalCode,
          //     address2: address.address2,
          //   },
          // },
        },
      });

      // Validar si el price es 0

      // 3. Crear la dirección de la orden

      const { country, ...restAddress } = address;

      const orderAddress = await tx.orderAddress.create({
        data: {
          ...restAddress,
          countryId: country,
          orderId: order.id,
        },
      });

      return {
        order: order,
        updatedProducts: updatedProducts,
        orderAddress: orderAddress,
      };
    });
    return {
      ok: true,
      order: prismaTx.order,
      prismaTx: prismaTx,
    };
  } catch (error) {
    console.log(error);
    return {
      ok: false,
      message: "Ocurrió un error",
    };
  }
};
