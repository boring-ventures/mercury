"use client";
import React from "react";
import { ArrowRight, MessageCircle, TrendingUp } from "lucide-react";
import dynamic from "next/dynamic";

const GlobeDemo = dynamic(
  () => import("@/components/ui/globe-demo").then((m) => m.GlobeDemo),
  {
    ssr: false,
  }
);

export default function NordexHeroSection() {
  return (
    <section
      id="inicio"
      className="relative bg-white min-h-screen flex items-center overflow-hidden"
    >
      {/* Subtle Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div
          className="absolute left-0 top-0 w-full h-full"
          style={{
            backgroundImage: `linear-gradient(90deg, #051D67 1px, transparent 1px), linear-gradient(0deg, #051D67 1px, transparent 1px)`,
            backgroundSize: "50px 50px",
          }}
        ></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left Column - Content */}
          <div className="text-left">
            {/* Main Headline */}
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-8 font-sans leading-tight text-[#051D67]">
              Conectamos
              <br />
              <span className="text-[#81D843]">Bolivia</span>
              <br />
              <span className="text-[#051D67]">con el Mundo</span>
            </h1>

            {/* Tagline */}
            <p className="text-xl md:text-2xl text-gray-700 mb-8 font-serif font-medium leading-relaxed">
              Facilitamos. Internacionalizamos. Escalamos.
            </p>

            {/* Description */}
            <p className="text-lg md:text-xl text-gray-600 mb-12 max-w-2xl leading-relaxed font-serif">
              Somos la empresa boliviana líder en facilitación comercial
              internacional. Transformamos la manera en que las empresas locales
              se conectan con el mundo, optimizando procesos y acelerando el
              crecimiento global.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-6 mb-12">
              <a
                href="#contacto"
                className="inline-flex items-center justify-center px-8 py-4 bg-[#051D67] hover:bg-[#0a2b7a] rounded-lg text-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl text-white font-sans"
              >
                <MessageCircle className="w-5 h-5 mr-2" />
                Solicitar Consultoría
              </a>

              <a
                href="#servicios"
                className="inline-flex items-center justify-center px-8 py-4 bg-white hover:bg-gray-50 border-2 border-[#051D67] rounded-lg text-lg font-semibold transition-all duration-300 transform hover:scale-105 text-[#051D67] font-sans"
              >
                Conocer Servicios
                <ArrowRight className="w-5 h-5 ml-2" />
              </a>
            </div>

            {/* Program Description */}
            <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <div className="w-8 h-8 bg-[#81D843] rounded-full flex items-center justify-center">
                <TrendingUp className="w-4 h-4 text-white" />
              </div>
              <p className="text-gray-700 font-serif font-medium">
                El programa líder de internacionalización empresarial en Bolivia
              </p>
            </div>
          </div>

          {/* Right Column - 3D Globe */}
          <div className="flex justify-center items-center h-[600px] relative">
            {/* Globe Container with Subtle Background */}
            <div className="relative w-full h-full">
              <div className="absolute inset-0 bg-gray-50 rounded-full opacity-50"></div>
              <div className="relative z-10">
                <GlobeDemo />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Arrow Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <ArrowRight className="w-6 h-6 text-[#051D67] rotate-90" />
      </div>
    </section>
  );
}
