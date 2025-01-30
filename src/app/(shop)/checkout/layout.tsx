import { auth } from "@/auth.config";
import { redirect } from "next/navigation";
import React from "react";

export default async function CheckLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  const session = await auth()

  if(!session?.user){
    redirect('/auth/login?redirectTo=/checkout/address')
  }
  return <>{children}</>;
}
