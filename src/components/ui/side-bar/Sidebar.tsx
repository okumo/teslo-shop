"use client";
import { logout } from "@/actions";
import { useUIStore } from "@/store";
import clsx from "clsx";
import { useSession } from "next-auth/react";
import Link from "next/link";
import React from "react";
import {
  IoCloseOutline,
  IoLogInOutline,
  IoLogOutOutline,
  IoPeopleOutline,
  IoPersonOutline,
  IoSearchOutline,
  IoShirtOutline,
  IoTicketOutline,
} from "react-icons/io5";

export const Sidebar = () => {
  const isSideMenuOpen = useUIStore((state) => state.isSideMenuOpen);
  const closeSideMenu = useUIStore((state) => state.closeSideMenu);

  const { data: session } = useSession();

  const isAuthenticated = !!session?.user;

  const isAdmin = session?.user.role === "admin";
  return (
    <div className="">
      {/* Black background */}

      {isSideMenuOpen && (
        <div className="fixed top-0 left-0 w-screen h-screen z-10 bg-black opacity-30" />
      )}

      {/* Blue background */}

      {isSideMenuOpen && (
        <div
          className="fade-in fixed top-0 left-0 w-screen h-screen z-10 backdrop-filter backdrop-blur-sm"
          onClick={closeSideMenu}
        />
      )}

      {/* Sidemenu */}
      {/* TODO: EFECTO DE SLIDE */}
      <nav
        className={clsx(
          "fixed p-5 right-0 top-0 w-[500px] h-screen bg-white z-20 shadow-2xl transform transition-all duration-300",
          {
            "translate-x-full": !isSideMenuOpen,
          }
        )}
      >
        <IoCloseOutline
          size={50}
          className="absolute top-50 right-5 cursor-pointer"
          onClick={() => closeSideMenu()}
        />

        {/* Input */}

        <div className="relative mt-14">
          <IoSearchOutline size={20} className="absolute top-2 left-2" />
          <input className="w-full bg-gray-50 rounded pl-10 py-1 border-b-2 text-xl border-gray-200 focus:outline-none focus:border-blue-500" />
        </div>

        {/* Menú */}

        {isAuthenticated && (
          <>
            <Link
              href={"/profile"}
              className="flex items-center mt-10 p-2 hover:bg-gray-100 rounded transition-all"
              onClick={() => closeSideMenu()}
            >
              <IoPersonOutline size={30} />
              <span className="ml-3 text-xl">Perfil</span>
            </Link>
            <Link
              href={"/orders"}
              onClick={() => closeSideMenu()}
              className="flex items-center mt-10 p-2 hover:bg-gray-100 rounded transition-all"
            >
              <IoTicketOutline size={30} />
              <span className="ml-3 text-xl">Ordenes</span>
            </Link>
          </>
        )}

        {!isAuthenticated && (
          <Link
            href={"/auth/login"}
            className="flex items-center mt-10 p-2 hover:bg-gray-100 rounded transition-all"
            onClick={() => closeSideMenu()}
          >
            <IoLogInOutline size={30} />
            <span className="ml-3 text-xl">Ingresar</span>
          </Link>
        )}

        {isAuthenticated && (
          <button
            onClick={() => {
              logout();
            }}
            className="flex items-center mt-10 p-2 hover:bg-gray-100 rounded transition-all w-full"
          >
            <IoLogOutOutline size={30} />
            <span className="ml-3 text-xl">Salir</span>
          </button>
        )}

        {/* Line separator */}

        <div className="w-full h-px bg-gray-200 my-10" />

        {isAdmin && (
          <>
            <Link
              href={"/admin/products"}
              onClick={() => closeSideMenu()}
              className="flex items-center mt-10 p-2 hover:bg-gray-100 rounded transition-all"
            >
              <IoShirtOutline size={30} />
              <span className="ml-3 text-xl">Productos</span>
            </Link>

            <Link
              onClick={() => closeSideMenu()}
              href={"/admin/orders"}
              className="flex items-center mt-10 p-2 hover:bg-gray-100 rounded transition-all"
            >
              <IoTicketOutline size={30} />
              <span className="ml-3 text-xl">Ordenes</span>
            </Link>
            <Link
              onClick={() => closeSideMenu()}
              href={"/admin/users"}
              className="flex items-center mt-10 p-2 hover:bg-gray-100 rounded transition-all"
            >
              <IoPeopleOutline size={30} />
              <span className="ml-3 text-xl">Usuarios</span>
            </Link>
          </>
        )}
      </nav>
    </div>
  );
};
