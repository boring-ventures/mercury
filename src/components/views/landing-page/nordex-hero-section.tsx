"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function NordexHeroSection() {
  return (
    <section id="inicio" className="bg-[#F2EFE9] pt-24 pb-20 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="space-y-6">
              <h1 className="text-[#1F1915] font-serif text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                Conectamos Bolivia con el Mundo
              </h1>
              <div className="space-y-3">
                <p className="text-[#1F1915] font-serif text-lg md:text-xl font-semibold">
                  Facilitamos. Internacionalizamos. Escalamos.
                </p>
                <p className="text-[#1F1915A3] text-sm md:text-base leading-relaxed max-w-lg">
                  Somos la empresa boliviana líder en facilitación comercial internacional. 
                  Transformamos la manera en que las empresas locales se conectan con el mundo, 
                  optimizando procesos y acelerando el crecimiento global.
                </p>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                asChild
                size="lg"
                className="bg-[#051D67] hover:bg-[#041655] text-white px-8 py-3 rounded-md font-medium transition-all duration-200"
              >
                <Link href="#servicios">Conocer servicios</Link>
              </Button>
              <Button 
                asChild
                variant="outline"
                size="lg"
                className="border-[#051D67] text-[#051D67] hover:bg-[#051D67] hover:text-white px-8 py-3 rounded-md font-medium transition-all duration-200"
              >
                <Link href="#quienes-somos">Sobre nosotros</Link>
              </Button>
            </div>
          </div>

          <div className="relative">
            <div className="relative bg-gradient-to-br from-[#051D67] to-[#041655] rounded-2xl p-8 shadow-2xl">
              <div className="absolute top-4 right-4 w-3 h-3 bg-[#81D843] rounded-full animate-pulse"></div>
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-white">150+</div>
                    <div className="text-sm text-white/80">Empresas atendidas</div>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-white">45+</div>
                    <div className="text-sm text-white/80">Países conectados</div>
                  </div>
                </div>
                
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-white/80">Crecimiento anual</span>
                    <span className="text-sm font-semibold text-[#81D843]">+340%</span>
                  </div>
                  <div className="w-full bg-white/20 rounded-full h-2">
                    <div className="bg-[#81D843] h-2 rounded-full w-[85%] animate-pulse"></div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div className="bg-white/5 backdrop-blur-sm rounded-lg p-3 text-center">
                    <div className="text-lg font-bold text-white">24/7</div>
                    <div className="text-xs text-white/70">Soporte</div>
                  </div>
                  <div className="bg-white/5 backdrop-blur-sm rounded-lg p-3 text-center">
                    <div className="text-lg font-bold text-white">ISO</div>
                    <div className="text-xs text-white/70">Certificado</div>
                  </div>
                  <div className="bg-white/5 backdrop-blur-sm rounded-lg p-3 text-center">
                    <div className="text-lg font-bold text-white">98%</div>
                    <div className="text-xs text-white/70">Satisfacción</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}