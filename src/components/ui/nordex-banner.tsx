"use client";

import React from "react";
import Link from "next/link";
import { StickyBanner } from "@/components/ui/sticky-banner";
import { ArrowRight } from "lucide-react";

export default function NordexBanner() {
  return (
    <StickyBanner 
      className="bg-[#051D67] text-white z-50"
      hideOnScroll={false}
    >
      <div className="flex items-center justify-center gap-4 text-center">
        <span className="text-sm font-normal font-serif">
          ¡Registra tu empresa y automatiza tus procesos comerciales internacionales!
        </span>
        <Link
          href="/registro"
          className="inline-flex items-center gap-1 bg-white/10 hover:bg-white/20 px-3 py-1 rounded-full text-xs font-medium transition-colors duration-200"
        >
          Registrarse
          <ArrowRight className="h-3 w-3" />
        </Link>
      </div>
    </StickyBanner>
  );
}