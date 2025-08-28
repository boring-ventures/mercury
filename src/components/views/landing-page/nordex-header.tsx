"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NordexHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#FFFFFF] border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-[#051D67] rounded-md flex items-center justify-center">
                <span className="text-white font-bold text-lg">N</span>
              </div>
              <span className="text-[#1F1915] font-semibold text-xl">NORDEX</span>
            </Link>
          </div>

          <nav className="hidden md:flex items-center space-x-8">
            <Link 
              href="#inicio" 
              className="text-[#1F1915] hover:text-[#051D67] transition-colors duration-200 font-medium"
            >
              Inicio
            </Link>
            <Link 
              href="#servicios" 
              className="text-[#1F1915] hover:text-[#051D67] transition-colors duration-200 font-medium"
            >
              Servicios
            </Link>
            <Link 
              href="#quienes-somos" 
              className="text-[#1F1915] hover:text-[#051D67] transition-colors duration-200 font-medium"
            >
              Quiénes somos
            </Link>
            <Link 
              href="#noticias" 
              className="text-[#1F1915] hover:text-[#051D67] transition-colors duration-200 font-medium"
            >
              Noticias
            </Link>
            <Button 
              asChild 
              className="bg-[#051D67] hover:bg-[#041655] text-white px-6 py-2 rounded-md transition-colors duration-200"
            >
              <Link href="/sign-in">Iniciar sesión</Link>
            </Button>
          </nav>

          <button
            className="md:hidden text-[#1F1915]"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <nav className="flex flex-col space-y-4">
              <Link 
                href="#inicio" 
                className="text-[#1F1915] hover:text-[#051D67] transition-colors duration-200 font-medium px-2 py-1"
                onClick={() => setIsMenuOpen(false)}
              >
                Inicio
              </Link>
              <Link 
                href="#servicios" 
                className="text-[#1F1915] hover:text-[#051D67] transition-colors duration-200 font-medium px-2 py-1"
                onClick={() => setIsMenuOpen(false)}
              >
                Servicios
              </Link>
              <Link 
                href="#quienes-somos" 
                className="text-[#1F1915] hover:text-[#051D67] transition-colors duration-200 font-medium px-2 py-1"
                onClick={() => setIsMenuOpen(false)}
              >
                Quiénes somos
              </Link>
              <Link 
                href="#noticias" 
                className="text-[#1F1915] hover:text-[#051D67] transition-colors duration-200 font-medium px-2 py-1"
                onClick={() => setIsMenuOpen(false)}
              >
                Noticias
              </Link>
              <Button 
                asChild 
                className="bg-[#051D67] hover:bg-[#041655] text-white px-6 py-2 rounded-md transition-colors duration-200 w-fit ml-2"
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