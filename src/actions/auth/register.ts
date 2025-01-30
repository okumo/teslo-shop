"use server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";

export const registerUser = async (
  name: string,
  email: string,
  password: string
) => {
  try {
    if (!name || !email || !password) {
      throw new Error('Todos los campos son obligatorios')
    }
 
    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase() }
    })
 
    if (existingUser) {
      throw new Error('El usuario ya existe')
    }

    const user = await prisma.user.create({
      data: {
        name: name,
        email: email.toLocaleLowerCase(),
        password: bcrypt.hashSync(password),
      },
      select: {
        id: true,
        name: true,
        email: true,
      },
    });
    return {
      ok: true,
      user: user,
      message: "Usuario creado con éxito!",
    };
  } catch (error) {
    console.log(error);

    return {
      ok: false,
      message:  "No se pudo crear el usuario",
    };
  }
};
