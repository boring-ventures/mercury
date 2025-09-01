"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function NordexAboutSection() {
  return (
    <section id="quienes-somos" className="bg-[#051D67] py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-white font-serif text-3xl md:text-4xl lg:text-5xl font-bold leading-tight mb-6">
            Quiénes somos
          </h2>
          <p className="text-white/90 text-[18px] max-w-3xl mx-auto leading-relaxed">
            Somos el puente que conecta Bolivia con el mundo. NORDEX nació con
            la visión de transformar el panorama del comercio internacional en
            Bolivia, especializándonos en eliminar las barreras que limitan el
            crecimiento global de las empresas bolivianas.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          <div className="border border-white/20 rounded-xl p-6 text-center bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-all duration-300">
            <div className="text-2xl md:text-3xl font-bold text-white mb-2">
              10+
            </div>
            <div className="text-white/80 text-sm font-medium">
              Años de experiencia
            </div>
          </div>
          <div className="border border-white/20 rounded-xl p-6 text-center bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-all duration-300">
            <div className="text-2xl md:text-3xl font-bold text-white mb-2">
              30+
            </div>
            <div className="text-white/80 text-sm font-medium">Empresas</div>
          </div>
          <div className="border border-white/20 rounded-xl p-6 text-center bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-all duration-300">
            <div className="text-2xl md:text-3xl font-bold text-white mb-2">
              10+
            </div>
            <div className="text-white/80 text-sm font-medium">
              Países destino
            </div>
          </div>
          <div className="border border-white/20 rounded-xl p-6 text-center bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-all duration-300">
            <div className="text-2xl md:text-3xl font-bold text-white mb-2">
              $50M+
            </div>
            <div className="text-white/80 text-sm font-medium">
              En transacciones gestionadas
            </div>
          </div>
        </div>

        <div className="text-center">
          <Button
            asChild
            size="lg"
            className="bg-white hover:bg-gray-100 text-[#051D67] px-8 py-3 rounded-md font-medium transition-all duration-200"
          >
            <Link href="/quienes-somos">Conoce más sobre nosotros</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
