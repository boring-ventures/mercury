import React from "react";
import { MessageCircle, ArrowRight } from "lucide-react";

export default function NordexHeroSection() {
  return (
    <section className="bg-white text-black min-h-screen flex items-center">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          {/* Main Heading */}
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6 bg-gradient-to-r from-[#051D67] to-black bg-clip-text text-transparent">
            Conectamos tu empresa boliviana con el mundo
          </h1>

          {/* Subtitle */}
          <p className="text-xl md:text-2xl lg:text-3xl text-gray-600 mb-8 max-w-4xl mx-auto">
            Facilitamos el comercio internacional para empresas bolivianas que
            buscan expandir sus operaciones globalmente. Soluciones eficientes,
            seguras y transparentes para tus transacciones internacionales.
          </p>

          {/* Description */}
          <p className="text-lg md:text-xl text-gray-700 mb-12 max-w-5xl mx-auto leading-relaxed">
            En NORDEX transformamos la manera en que las empresas bolivianas se
            conectan con proveedores internacionales. Ofrecemos servicios
            especializados de facilitación comercial que simplifican procesos
            complejos y aceleran tus operaciones de importación.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <a
              href="#contacto"
              className="inline-flex items-center justify-center px-8 py-4 bg-[#051D67] hover:bg-black rounded-lg text-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl text-white"
            >
              <MessageCircle className="w-5 h-5 mr-2" />
              Solicitar Consultoría Gratuita
            </a>

            <a
              href="#servicios"
              className="inline-flex items-center justify-center px-8 py-4 bg-white hover:bg-gray-50 border-2 border-[#051D67] rounded-lg text-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl text-[#051D67]"
            >
              Conocer Nuestros Servicios
              <ArrowRight className="w-5 h-5 ml-2" />
            </a>
          </div>

          {/* Hero Image Placeholder */}
          <div className="relative mx-auto max-w-6xl">
            <div className="relative z-10 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg shadow-2xl border border-gray-200 p-12 text-gray-500">
              <div className="text-center">
                <div className="text-6xl mb-4">🌍</div>
                <h3 className="text-2xl font-semibold mb-2 text-[#051D67]">
                  Comercio Internacional Simplificado
                </h3>
                <p className="text-lg">
                  Conectando Bolivia con más de 50 países
                </p>
              </div>
            </div>

            {/* Decorative elements */}
            <div className="absolute -top-4 -left-4 w-32 h-32 bg-[#051D67] rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
            <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-black rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-1000"></div>
          </div>
        </div>
      </div>
    </section>
  );
}
