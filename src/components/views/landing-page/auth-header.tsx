"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

export function AuthHeader() {
  return (
    <div className="flex items-center">
      <Link href="/sign-in">
        <Button className="bg-[#051D67] hover:bg-[#81D843] text-[#FCFDFD] hover:text-white transition-all duration-300 font-sans font-medium px-6 py-2 rounded-lg">
          Iniciar Sesión
        </Button>
      </Link>
    </div>
  );
}
