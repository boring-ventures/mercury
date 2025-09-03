"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NordexHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 shadow-sm w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">
        <div className="flex justify-between items-center h-16 lg:h-18">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-3">
              <img
                src="/logos/logo Nordex_Mesa de trabajo 1 copia.png"
                alt="NORDEX Logo"
                className="h-8 w-auto sm:h-10 lg:h-12"
              />
            </Link>
          </div>

          <nav className="hidden lg:flex items-center space-x-4 xl:space-x-8">
            <Link
              href="/"
              className="text-[#262626] hover:text-[#051D67] transition-colors duration-200 font-medium font-sans text-[14px]"
            >
              Inicio
            </Link>
            <Link
              href="/servicios"
              className="text-[#262626] hover:text-[#051D67] transition-colors duration-200 font-medium font-sans text-[14px]"
            >
              Servicios
            </Link>
            <Link
              href="/quienes-somos"
              className="text-[#262626] hover:text-[#051D67] transition-colors duration-200 font-medium font-sans text-[14px]"
            >
              Quiénes somos
            </Link>
            <Link
              href="/noticias"
              className="text-[#262626] hover:text-[#051D67] transition-colors duration-200 font-medium font-sans text-[14px]"
            >
              Noticias
            </Link>
            <Button
              asChild
              className="bg-[#051D67] hover:bg-[#041655] text-white px-4 py-2 lg:px-6 lg:py-2 xl:px-8 xl:py-3 text-sm lg:text-base rounded-md transition-colors duration-200"
            >
              <Link href="/sign-in">Iniciar sesión</Link>
            </Button>
          </nav>

          <button
            className="lg:hidden text-[#262626]"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {isMenuOpen && (
          <div className="lg:hidden py-4 border-t border-gray-200 overflow-x-hidden">
            <nav className="flex flex-col space-y-4">
              <Link
                href="/"
                className="text-[#262626] hover:text-[#051D67] transition-colors duration-200 font-medium px-2 py-1 font-sans text-base"
                onClick={() => setIsMenuOpen(false)}
              >
                Inicio
              </Link>
              <Link
                href="/servicios"
                className="text-[#262626] hover:text-[#051D67] transition-colors duration-200 font-medium px-2 py-1 font-sans text-base"
                onClick={() => setIsMenuOpen(false)}
              >
                Servicios
              </Link>
              <Link
                href="/quienes-somos"
                className="text-[#262626] hover:text-[#051D67] transition-colors duration-200 font-medium px-2 py-1 font-sans text-base"
                onClick={() => setIsMenuOpen(false)}
              >
                Quiénes somos
              </Link>
              <Link
                href="/noticias"
                className="text-[#262626] hover:text-[#051D67] transition-colors duration-200 font-medium px-2 py-1 font-sans text-base"
                onClick={() => setIsMenuOpen(false)}
              >
                Noticias
              </Link>
              <Button
                asChild
                className="bg-[#051D67] hover:bg-[#041655] text-white px-6 py-3 rounded-md transition-colors duration-200 w-fit ml-2 text-base"
              >
                <Link href="/sign-in">Iniciar sesión</Link>
              </Button>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
