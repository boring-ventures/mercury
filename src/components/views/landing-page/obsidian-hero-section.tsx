"use client";
import React from "react";
import { MessageCircle, ArrowRight } from "lucide-react";
import dynamic from "next/dynamic";

const GlobeDemo = dynamic(
  () => import("@/components/ui/globe-demo").then((m) => m.GlobeDemo),
  {
    ssr: false,
  }
);

export default function NordexHeroSection() {
  return (
    <section className="bg-[#FCFDFD] text-[#051D67] min-h-screen flex items-center">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Content */}
          <div className="text-left">
            {/* Main Heading */}
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6 bg-gradient-to-r from-[#051D67] to-[#81D843] bg-clip-text text-transparent">
              NORDEX Global
            </h1>

            {/* Subtitle */}
            <p className="text-xl md:text-2xl lg:text-3xl text-[#051D67] mb-8 max-w-4xl">
              Especialistas en internacionalización empresarial
            </p>

            {/* Description */}
            <p className="text-lg md:text-xl text-gray-700 mb-12 max-w-5xl leading-relaxed">
              Somos una empresa boliviana especializada en apoyar a empresas en
              el proceso de internacionalización, facilitando operaciones
              internacionales y comercialización global.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <a
                href="#contacto"
                className="inline-flex items-center justify-center px-8 py-4 bg-[#051D67] hover:bg-[#81D843] rounded-lg text-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl text-[#FCFDFD]"
              >
                <MessageCircle className="w-5 h-5 mr-2" />
                Solicitar Consultoría
              </a>

              <a
                href="#servicios"
                className="inline-flex items-center justify-center px-8 py-4 bg-[#FCFDFD] hover:bg-gray-50 border-2 border-[#81D843] rounded-lg text-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl text-[#81D843]"
              >
                Conocer Nuestros Servicios
                <ArrowRight className="w-5 h-5 ml-2" />
              </a>
            </div>
          </div>

          {/* Right Column - 3D Globe */}
          <div className="flex justify-center items-center h-[600px]">
            <GlobeDemo />
          </div>
        </div>
      </div>
    </section>
  );
}
