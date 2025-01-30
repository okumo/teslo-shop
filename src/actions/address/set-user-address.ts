"use server";
import prisma from "@/lib/prisma";
import type { Address } from "../../interfaces/index";
export const setUserAddress = async (address: Address, userId: string) => {
  try {
    const newAddress = await createOrReplaceAddress(address, userId);

    return {
      ok: true,
      address: newAddress,
    };
  } catch (error) {
    console.log(error);
    return {
      ok: false,
      message: "No se pudo grabar la dirección",
    };
  }
};

const createOrReplaceAddress = async (address: Address, userId: string) => {
  try {
    const storedAddress = await prisma.userAddress.findUnique({
      where: {
        userId,
      },
    });

    const addressToSave = {
      userId: userId,
      address: address.address,
      firstName: address.firstName,
      lastName: address.lastName,
      address2: address.address2,
      postalCode: address.postalCode,
      countryId: address.country,
      phone: address.phone,
      city: address.city
    };
    if (!storedAddress) {
      const newAddress = await prisma.userAddress.create({
        data: addressToSave,
      });
      return newAddress;
    }

    const updatedAddress = await prisma.userAddress.update({
      where: {
        userId,
      },
      data: addressToSave,
    });
    return updatedAddress;
  } catch (error) {
    console.log(error);
  }
};
