"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X, Globe } from "lucide-react";
import { AuthHeader } from "./auth-header";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center space-x-2">
            <Globe className="h-8 w-8 text-[#051D67]" />
            <Link href="/" className="text-2xl font-bold text-[#051D67]">
              NORDEX
            </Link>
          </div>
          <div className="hidden md:flex">
            <AuthHeader />
          </div>
          <div className="md:hidden">
            <button
              type="button"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-black"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <div className="px-3 py-2">
              <AuthHeader />
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
