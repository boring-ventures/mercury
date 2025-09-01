"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { InfiniteSlider } from "@/components/ui/infinite-slider";
import { ProgressiveBlur } from "@/components/ui/progressive-blur";
import { World } from "@/components/ui/globe";

export default function NordexHeroSection() {
  // Data for the globe showing NORDEX's international connections
  const globeData = [
    {
      order: 1,
      startLat: -16.5, // Bolivia
      startLng: -68.1,
      endLat: 40.7, // United States
      endLng: -74.0,
      arcAlt: 0.3,
      color: "#051D67",
    },
    {
      order: 2,
      startLat: -16.5, // Bolivia
      startLng: -68.1,
      endLat: 51.5, // United Kingdom
      endLng: -0.1,
      arcAlt: 0.4,
      color: "#81D843",
    },
    {
      order: 3,
      startLat: -16.5, // Bolivia
      startLng: -68.1,
      endLat: 35.7, // Japan
      endLng: 139.7,
      arcAlt: 0.5,
      color: "#051D67",
    },
    {
      order: 4,
      startLat: -16.5, // Bolivia
      startLng: -68.1,
      endLat: -14.2, // Brazil
      endLng: -51.9,
      arcAlt: 0.2,
      color: "#81D843",
    },
    {
      order: 5,
      startLat: -16.5, // Bolivia
      startLng: -68.1,
      endLat: 20.6, // India
      endLng: 78.9,
      arcAlt: 0.6,
      color: "#051D67",
    },
    {
      order: 6,
      startLat: -16.5, // Bolivia
      startLng: -68.1,
      endLat: 35.9, // China
      endLng: 104.2,
      arcAlt: 0.7,
      color: "#81D843",
    },
  ];

  const globeConfig = {
    globeColor: "#F2EFE9",
    atmosphereColor: "#051D67",
    showAtmosphere: true,
    atmosphereAltitude: 0.15,
    polygonColor: "rgba(5, 29, 103, 0.3)",
    ambientLight: "#ffffff",
    directionalLeftLight: "#ffffff",
    directionalTopLight: "#ffffff",
    pointLight: "#ffffff",
    autoRotate: true,
    autoRotateSpeed: 0.5,
  };

  return (
    <section id="inicio" className="bg-white overflow-x-hidden">
      {/* Hero Section with reduced spacing from navbar */}
      <div className="pt-20 pb-16 md:pt-24 md:pb-20 lg:pt-28 lg:pb-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left Column - Text Content */}
            <div className="space-y-6">
              {/* Main Heading */}
              <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl text-[#1F1915] font-serif font-bold leading-tight">
                Conectamos Bolivia con el Mundo
              </h1>

              {/* Descriptive Text */}
              <div className="space-y-3">
                <p className="text-[#1F1915] font-serif text-lg md:text-xl font-semibold">
                  Facilitamos. Internacionalizamos. Escalamos.
                </p>
                <p className="text-[#1F1915A3] text-base md:text-lg leading-relaxed max-w-xl">
                  Somos la empresa boliviana líder en facilitación comercial
                  internacional. Transformamos la manera en que las empresas
                  locales se conectan con el mundo, optimizando procesos y
                  acelerando el crecimiento global.
                </p>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-2">
                <Button
                  asChild
                  size="lg"
                  className="px-8 py-3 bg-[#051D67] hover:bg-[#041655] text-white rounded-md font-medium transition-all duration-200"
                >
                  <Link href="#servicios">Conocer servicios</Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="ghost"
                  className="px-8 py-3 border-[#051D67] text-[#051D67] hover:bg-[#051D67] hover:text-white rounded-md font-medium transition-all duration-200"
                >
                  <Link href="#quienes-somos">Sobre nosotros</Link>
                </Button>
              </div>
            </div>

            {/* Right Column - Interactive Globe */}
            <div className="relative h-96 lg:h-[500px] w-full">
              <World globeConfig={globeConfig} data={globeData} />
            </div>
          </div>
        </div>
      </div>

      {/* Company Logos Section with reduced spacing */}
      <section className="bg-white py-12 border-t border-[#1F1915]/10">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-col items-center md:flex-row">
            <div className="md:max-w-48 md:border-r md:pr-8 mb-6 md:mb-0">
              <p className="text-center md:text-end text-base text-[#1F1915] font-medium">
                Empresas líderes confían en NORDEX
              </p>
            </div>
            <div className="relative md:w-[calc(100%-12rem)]">
              <InfiniteSlider speedOnHover={20} speed={40} gap={112}>
                <div className="flex">
                  <div className="mx-auto h-6 w-fit text-[#051D67] font-bold text-sm">
                    TECNOLOGÍA
                  </div>
                </div>
                <div className="flex">
                  <div className="mx-auto h-5 w-fit text-[#051D67] font-bold text-sm">
                    MAQUINARIA
                  </div>
                </div>
                <div className="flex">
                  <div className="mx-auto h-5 w-fit text-[#051D67] font-bold text-sm">
                    TEXTIL
                  </div>
                </div>
                <div className="flex">
                  <div className="mx-auto h-6 w-fit text-[#051D67] font-bold text-sm">
                    FARMACÉUTICO
                  </div>
                </div>
                <div className="flex">
                  <div className="mx-auto h-6 w-fit text-[#051D67] font-bold text-sm">
                    ALIMENTARIA
                  </div>
                </div>
                <div className="flex">
                  <div className="mx-auto h-5 w-fit text-[#051D67] font-bold text-sm">
                    INDUSTRIAL
                  </div>
                </div>
                <div className="flex">
                  <div className="mx-auto h-7 w-fit text-[#051D67] font-bold text-sm">
                    LOGÍSTICA
                  </div>
                </div>
                <div className="flex">
                  <div className="mx-auto h-6 w-fit text-[#051D67] font-bold text-sm">
                    COMERCIO
                  </div>
                </div>
              </InfiniteSlider>

              <div className="bg-gradient-to-r from-white absolute inset-y-0 left-0 w-20"></div>
              <div className="bg-gradient-to-l from-white absolute inset-y-0 right-0 w-20"></div>
              <ProgressiveBlur
                className="pointer-events-none absolute left-0 top-0 h-full w-20"
                direction="left"
                blurIntensity={1}
              />
              <ProgressiveBlur
                className="pointer-events-none absolute right-0 top-0 h-full w-20"
                direction="right"
                blurIntensity={1}
              />
            </div>
          </div>
        </div>
      </section>
    </section>
  );
}
