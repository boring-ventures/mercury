"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { InfiniteSlider } from "@/components/ui/infinite-slider";
import { ProgressiveBlur } from "@/components/ui/progressive-blur";
import { World } from "@/components/ui/globe";
import NordexBanner from "@/components/ui/nordex-banner";
import NordexHeader from "@/components/views/landing-page/nordex-header";
import {
  Laptop2,
  Package,
  Shirt,
  Pill,
  Utensils,
  Building2,
  Truck,
  ShoppingCart,
} from "lucide-react";

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
    <>
      <NordexBanner />
      <NordexHeader />
      <section id="inicio" className="bg-white overflow-x-hidden">
        {/* Hero Section with reduced spacing from navbar */}
        <div className="pt-16 pb-8 sm:pt-18 sm:pb-10 md:pt-20 md:pb-12 lg:pt-24 lg:pb-16 xl:pt-28 xl:pb-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">
            <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 xl:gap-20 items-center">
              {/* Left Column - Text Content */}
              <div className="space-y-4 sm:space-y-6 lg:space-y-8">
                {/* Main Heading */}
                <h1 className="text-[28px] sm:text-[36px] md:text-[42px] lg:text-[46px] xl:text-[52px] 2xl:text-[58px] text-[#262626] font-sans font-bold leading-tight">
                  Conectamos Bolivia
                  <br />
                  con el <span className="text-[#051D67]">Mundo</span>
                </h1>

                {/* Descriptive Text */}
                <div className="space-y-3 sm:space-y-4">
                  <p className="text-[#262626] font-serif text-base sm:text-lg lg:text-xl xl:text-2xl font-semibold">
                    Facilitamos. Internacionalizamos. Escalamos.
                  </p>
                  <p className="text-[#262626A3] text-sm sm:text-base lg:text-lg xl:text-xl leading-relaxed max-w-none lg:max-w-xl xl:max-w-2xl font-serif">
                    Somos la empresa boliviana líder en facilitación comercial
                    internacional. Transformamos la manera en que las empresas
                    locales se conectan con el mundo, optimizando procesos y
                    acelerando el crecimiento global.
                  </p>
                </div>

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-2 sm:pt-4">
                  <Button
                    asChild
                    size="lg"
                    className="px-6 py-2 sm:px-8 sm:py-3 lg:px-10 lg:py-4 text-sm sm:text-base lg:text-lg bg-[#051D67] hover:bg-[#041655] text-white rounded-md font-medium transition-all duration-200"
                  >
                    <Link href="#servicios">Conocer servicios</Link>
                  </Button>
                  <Button
                    asChild
                    size="lg"
                    variant="outline"
                    className="px-6 py-2 sm:px-8 sm:py-3 lg:px-10 lg:py-4 text-sm sm:text-base lg:text-lg border-2 border-[#051D67] text-[#051D67] hover:bg-[#051D67] hover:text-white rounded-md font-medium transition-all duration-200"
                  >
                    <Link href="#quienes-somos">Sobre nosotros</Link>
                  </Button>
                </div>
              </div>

              {/* Right Column - Interactive Globe */}
              <div className="relative h-64 sm:h-80 md:h-96 lg:h-[450px] xl:h-[500px] 2xl:h-[550px] w-full">
                <World globeConfig={globeConfig} data={globeData} />
              </div>
            </div>
          </div>
        </div>

        {/* Metrics Section */}
        <section className="bg-white py-4 sm:py-6 lg:py-8">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
              <div className="text-center">
                <div className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-bold text-[#051D67] mb-1 font-sans">
                  $2.8B
                </div>
                <div className="text-xs sm:text-sm lg:text-base text-[#262626] font-serif">
                  Exportaciones en MM
                </div>
              </div>
              <div className="text-center lg:border-l lg:border-[#262626]/20">
                <div className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-bold text-[#051D67] mb-1 font-sans">
                  $4.2B
                </div>
                <div className="text-xs sm:text-sm lg:text-base text-[#262626] font-serif">
                  Importaciones en MM
                </div>
              </div>
              <div className="text-center lg:border-l lg:border-[#262626]/20">
                <div className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-bold text-[#051D67] mb-1 font-sans">
                  $1.4B
                </div>
                <div className="text-xs sm:text-sm lg:text-base text-[#262626] font-serif">
                  Saldo comercial MM
                </div>
              </div>
              <div className="text-center lg:border-l lg:border-[#262626]/20">
                <div className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-bold text-[#051D67] mb-1 font-sans">
                  $3.5B
                </div>
                <div className="text-xs sm:text-sm lg:text-base text-[#262626] font-serif">
                  Reservas Internacionales MM
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Company Logos Section with reduced spacing */}
        <section className="bg-white py-8 sm:py-10 lg:py-12 xl:py-16 border-t border-[#262626]/10">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">
            <div className="flex flex-col items-center lg:flex-row">
              <div className="lg:max-w-48 xl:max-w-64 lg:border-r lg:pr-8 mb-6 lg:mb-0">
                <p className="text-center lg:text-end text-sm sm:text-base lg:text-lg xl:text-xl text-[#262626] font-medium font-serif">
                  Empresas líderes confían en NORDEX
                </p>
              </div>
              <div className="relative lg:w-[calc(100%-12rem)] xl:w-[calc(100%-16rem)]">
                <InfiniteSlider duration={25} durationOnHover={15} gap={80}>
                  <div className="flex flex-col items-center">
                    <Laptop2
                      className="h-5 w-5 sm:h-6 sm:w-6 lg:h-7 lg:w-7 text-[#051D67] mb-2"
                      strokeWidth={1.5}
                    />
                    <div className="text-[#051D67] font-medium text-xs sm:text-sm lg:text-base">
                      TECNOLOGÍA
                    </div>
                  </div>
                  <div className="flex flex-col items-center">
                    <Package
                      className="h-5 w-5 sm:h-6 sm:w-6 lg:h-7 lg:w-7 text-[#051D67] mb-2"
                      strokeWidth={1.5}
                    />
                    <div className="text-[#051D67] font-medium text-xs sm:text-sm lg:text-base">
                      MAQUINARIA
                    </div>
                  </div>
                  <div className="flex flex-col items-center">
                    <Shirt
                      className="h-5 w-5 sm:h-6 sm:w-6 lg:h-7 lg:w-7 text-[#051D67] mb-2"
                      strokeWidth={1.5}
                    />
                    <div className="text-[#051D67] font-medium text-xs sm:text-sm lg:text-base">
                      TEXTIL
                    </div>
                  </div>
                  <div className="flex flex-col items-center">
                    <Pill
                      className="h-5 w-5 sm:h-6 sm:w-6 lg:h-7 lg:w-7 text-[#051D67] mb-2"
                      strokeWidth={1.5}
                    />
                    <div className="text-[#051D67] font-medium text-xs sm:text-sm lg:text-base">
                      FARMACÉUTICO
                    </div>
                  </div>
                  <div className="flex flex-col items-center">
                    <Utensils
                      className="h-5 w-5 sm:h-6 sm:w-6 lg:h-7 lg:w-7 text-[#051D67] mb-2"
                      strokeWidth={1.5}
                    />
                    <div className="text-[#051D67] font-medium text-xs sm:text-sm lg:text-base">
                      ALIMENTARIA
                    </div>
                  </div>
                  <div className="flex flex-col items-center">
                    <Building2
                      className="h-5 w-5 sm:h-6 sm:w-6 lg:h-7 lg:w-7 text-[#051D67] mb-2"
                      strokeWidth={1.5}
                    />
                    <div className="text-[#051D67] font-medium text-xs sm:text-sm lg:text-base">
                      INDUSTRIAL
                    </div>
                  </div>
                  <div className="flex flex-col items-center">
                    <Truck
                      className="h-5 w-5 sm:h-6 sm:w-6 lg:h-7 lg:w-7 text-[#051D67] mb-2"
                      strokeWidth={1.5}
                    />
                    <div className="text-[#051D67] font-medium text-xs sm:text-sm lg:text-base">
                      LOGÍSTICA
                    </div>
                  </div>
                  <div className="flex flex-col items-center">
                    <ShoppingCart
                      className="h-5 w-5 sm:h-6 sm:w-6 lg:h-7 lg:w-7 text-[#051D67] mb-2"
                      strokeWidth={1.5}
                    />
                    <div className="text-[#051D67] font-medium text-xs sm:text-sm lg:text-base">
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
    </>
  );
}
