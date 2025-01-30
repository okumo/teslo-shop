import NextAuth, { type NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { z } from "zod";
import prisma from "./lib/prisma";
import bcrypt from "bcryptjs";
export const authConfig: NextAuthConfig = {
  pages: {
    signIn: "/auth/login",
    newUser: "auth/new-account",
  },
  callbacks: {
    authorized() {
      return true;
    },
    jwt({ token, user }) {
      if (user) {
        token.data = user;
      }
      return token;
    },
    session({ token, session }) {
      session.user = token.data as unknown as never;
      return session;
    },
  },
  providers: [
    Credentials({
      async authorize(credentials) {
        const parsedCredentials = z
          .object({ email: z.string().email(), password: z.string().min(6) })
          .safeParse(credentials);

        if (!parsedCredentials.success) return null;

        const { email, password } = parsedCredentials.data;

        // buscar correo
        const user = await prisma.user.findUnique({
          where: {
            email: email.toLowerCase(),
          },
        });
        if (!user) return null;

        // comparar constraseñas
        if (!bcrypt.compareSync(password, user.password)) return null;

        // regresar el usuario
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { password: _, ...rest } = user;

        return rest;
      },
    }),
  ],
};

export const { signIn, signOut, auth, handlers } = NextAuth(authConfig);
