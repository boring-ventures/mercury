"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";

export default function NordexHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.header
      className={`fixed top-0 left-0 right-0 z-50 w-full transition-all duration-300 ${
        isScrolled
          ? "bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-lg"
          : "bg-white border-b border-gray-200 shadow-sm"
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6 }}
    >
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

          <motion.button
            className="lg:hidden text-[#262626] p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            whileTap={{ scale: 0.95 }}
          >
            <AnimatePresence mode="wait">
              {isMenuOpen ? (
                <motion.div
                  key="close"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <X className="w-6 h-6" />
                </motion.div>
              ) : (
                <motion.div
                  key="menu"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Menu className="w-6 h-6" />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
        </div>

        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              className="lg:hidden border-t border-gray-200 bg-white/95 backdrop-blur-md"
              initial={{ opacity: 0, blockSize: 0 }}
              animate={{ opacity: 1, blockSize: "auto" }}
              exit={{ opacity: 0, blockSize: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              <motion.nav
                className="flex flex-col space-y-2 py-4"
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.3, delay: 0.1 }}
              >
                <Link
                  href="/"
                  className="text-[#262626] hover:text-[#051D67] transition-colors duration-200 font-medium px-4 py-3 font-sans text-base hover:bg-gray-50 rounded-lg"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Inicio
                </Link>
                <Link
                  href="/servicios"
                  className="text-[#262626] hover:text-[#051D67] transition-colors duration-200 font-medium px-4 py-3 font-sans text-base hover:bg-gray-50 rounded-lg"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Servicios
                </Link>
                <Link
                  href="/quienes-somos"
                  className="text-[#262626] hover:text-[#051D67] transition-colors duration-200 font-medium px-4 py-3 font-sans text-base hover:bg-gray-50 rounded-lg"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Quiénes somos
                </Link>
                <Link
                  href="/noticias"
                  className="text-[#262626] hover:text-[#051D67] transition-colors duration-200 font-medium px-4 py-3 font-sans text-base hover:bg-gray-50 rounded-lg"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Noticias
                </Link>
                <div className="px-4 pt-2">
                  <Button
                    asChild
                    className="bg-[#051D67] hover:bg-[#041655] text-white px-6 py-3 rounded-md transition-colors duration-200 w-full text-base"
                  >
                    <Link href="/sign-in">Iniciar sesión</Link>
                  </Button>
                </div>
              </motion.nav>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.header>
  );
}
