"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { InfiniteSlider } from "@/components/ui/infinite-slider";
import { ProgressiveBlur } from "@/components/ui/progressive-blur";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import {
  fadeInUp,
  fadeInLeft,
  fadeInRight,
  staggerContainer,
  buttonHover,
  scaleIn,
} from "@/lib/animations";

import NordexHeader from "@/components/views/landing-page/nordex-header";

const World = dynamic(
  () => import("@/components/ui/globe").then((mod) => ({ default: mod.World })),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full bg-gray-100 animate-pulse rounded-lg" />
    ),
  }
);
import {
  Laptop2,
  Package,
  Shirt,
  Pill,
  Utensils,
  Building2,
  Truck,
  ShoppingCart,
  Pickaxe,
  Fuel,
  Wheat,
  Beef,
  Factory,
  Car,
  Settings,
  Wrench,
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
      color: "#051D67",
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
      color: "#051D67",
    },
    {
      order: 4,
      startLat: -13.5, // Bolivia
      startLng: -78.1,
      endLat: 14.2, // Brazil
      endLng: 81.9,
      arcAlt: 0.2,
      color: "#051D67",
    },
    {
      order: 4,
      startLat: -2.5, // Bolivia
      startLng: -62.1,
      endLat: 42.2, // Brazil
      endLng: 102.9,
      arcAlt: 0.2,
      color: "#051D67",
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
      color: "#051D67",
    },
    {
      order: 7,
      startLat: -16.5, // Bolivia
      startLng: -68.1,
      endLat: 21.2, // China
      endLng: 144.2,
      arcAlt: 0.7,
      color: "#051D67",
    },
    {
      order: 8,
      startLat: -16.5, // Bolivia
      startLng: -68.1,
      endLat: 76.9, // China
      endLng: 94.2,
      arcAlt: 0.7,
      color: "#051D67",
    },
  ];

  const globeConfig = {
    globeColor: "#ffffff",
    atmosphereColor: "#000000",
    showAtmosphere: true,
    atmosphereAltitude: 0.15,
    polygonColor: "rgb(0, 0, 0)",
    ambientLight: "#ffffff",
    directionalLeftLight: "#ffffff",
    directionalTopLight: "#ffffff",
    pointLight: "#051D67",
    autoRotate: true,
    autoRotateSpeed: 0.5,
  };

  return (
    <>
      <NordexHeader />
      <section id="inicio" className="bg-white overflow-x-hidden">
        {/* Hero Section with improved mobile spacing from navbar */}
        <div className="pt-24 pb-4 sm:pt-18 sm:pb-6 md:pt-20 md:pb-8 lg:pt-24 lg:pb-10 xl:pt-28 xl:pb-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 overflow-x-hidden">
            <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 xl:gap-20 items-center overflow-x-hidden">
              {/* Left Column - Text Content */}
              <motion.div
                className="space-y-4 sm:space-y-6 lg:space-y-8"
                variants={staggerContainer}
                initial="initial"
                animate="animate"
              >
                {/* Main Heading */}
                <motion.h1
                  className="text-[28px] sm:text-[36px] md:text-[42px] lg:text-[46px] xl:text-[52px] 2xl:text-[58px] text-[#262626] font-sans font-bold leading-tight"
                  {...fadeInLeft}
                  transition={{ ...fadeInLeft.transition, delay: 0.2 }}
                >
                  Conectamos Bolivia
                  <br />
                  con el <span className="text-[#051D67]">Mundo</span>
                </motion.h1>

                {/* Descriptive Text */}
                <motion.div
                  className="space-y-3 sm:space-y-4"
                  {...fadeInLeft}
                  transition={{ ...fadeInLeft.transition, delay: 0.4 }}
                >
                  <p className="text-[#262626] font-serif text-base sm:text-lg lg:text-xl xl:text-2xl font-semibold">
                    Facilitamos. Internacionalizamos. Escalamos.
                  </p>
                  <p className="text-[#262626A3] text-sm sm:text-base lg:text-lg xl:text-xl leading-relaxed max-w-none lg:max-w-xl xl:max-w-2xl font-serif">
                    Líder en comercio internacional. Conectamos empresas
                    bolivianas con mercados globales, optimizando procesos y
                    maximizando el crecimiento.
                  </p>
                </motion.div>

                {/* CTA Buttons */}
                <motion.div
                  className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-2 sm:pt-4"
                  {...fadeInUp}
                  transition={{ ...fadeInUp.transition, delay: 0.6 }}
                >
                  <motion.div {...buttonHover}>
                    <Button
                      asChild
                      size="lg"
                      className="px-6 py-2 sm:px-8 sm:py-3 lg:px-10 lg:py-4 text-sm sm:text-base lg:text-lg bg-[#051D67] hover:bg-[#041655] text-white rounded-md font-medium transition-all duration-200"
                    >
                      <Link href="#servicios">Conocer servicios</Link>
                    </Button>
                  </motion.div>
                  <motion.div {...buttonHover}>
                    <Button
                      asChild
                      size="lg"
                      variant="outline"
                      className="px-6 py-2 sm:px-8 sm:py-3 lg:px-10 lg:py-4 text-sm sm:text-base lg:text-lg bg-transparent border-2 border-[#051D67] text-[#051D67] hover:bg-[#051D67] hover:text-white rounded-md font-medium transition-all duration-200"
                    >
                      <Link href="#quienes-somos">Sobre nosotros</Link>
                    </Button>
                  </motion.div>
                </motion.div>
              </motion.div>

              {/* Right Column - Interactive Globe */}
              <motion.div
                className="relative h-64 sm:h-80 md:h-96 lg:h-[450px] xl:h-[500px] 2xl:h-[550px] w-full overflow-hidden"
                {...fadeInRight}
                transition={{ ...fadeInRight.transition, delay: 0.3 }}
              >
                <World globeConfig={globeConfig} data={globeData} />
              </motion.div>
            </div>
          </div>
        </div>

        {/* Metrics Section */}
        <motion.section
          className="bg-white pt-2 sm:pt-3 lg:pt-4 pb-4 sm:pb-6 lg:pb-8"
          {...fadeInUp}
          transition={{ ...fadeInUp.transition, delay: 0.8 }}
        >
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 overflow-x-hidden">
            {/* Title with Bolivian Flag */}
            <motion.div
              className="flex items-center gap-4 mb-6 sm:mb-8 lg:mb-10"
              {...fadeInLeft}
              transition={{ ...fadeInLeft.transition, delay: 0.6 }}
            >
              {/* Bolivian Flag */}
              <div className="flex-shrink-0">
                <div className="w-8 h-5 rounded-sm overflow-hidden shadow-sm border border-gray-200">
                  <div className="h-1/3 bg-red-500"></div>
                  <div className="h-1/3 bg-yellow-400"></div>
                  <div className="h-1/3 bg-green-500"></div>
                </div>
              </div>

              {/* Title */}
              <div className="flex items-baseline gap-2">
                <h2 className="text-2xl font-bold text-[#051D67] font-sans">
                  Datos estadísticos de Bolivia
                </h2>
                <span className="text-base font-normal text-[#051D67] opacity-75">
                  (julio 2025)
                </span>
              </div>
            </motion.div>

            <motion.div
              className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8"
              variants={staggerContainer}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true, amount: 0.3 }}
            >
              <motion.div className="text-center" variants={scaleIn}>
                <div className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-bold text-[#051D67] mb-1 font-sans">
                  $4.938
                </div>
                <div className="text-xs sm:text-sm lg:text-base text-[#262626] font-serif">
                  Exportaciones en MM
                </div>
              </motion.div>
              <motion.div
                className="text-center lg:border-l lg:border-[#262626]/20"
                variants={scaleIn}
              >
                <div className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-bold text-[#051D67] mb-1 font-sans">
                  $5.458
                </div>
                <div className="text-xs sm:text-sm lg:text-base text-[#262626] font-serif">
                  Importaciones en MM
                </div>
              </motion.div>
              <motion.div
                className="text-center lg:border-l lg:border-[#262626]/20"
                variants={scaleIn}
              >
                <div className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-bold text-[#051D67] mb-1 font-sans">
                  -495$
                </div>
                <div className="text-xs sm:text-sm lg:text-base text-[#262626] font-serif">
                  Saldo comercial MM
                </div>
              </motion.div>
              <motion.div
                className="text-center lg:border-l lg:border-[#262626]/20"
                variants={scaleIn}
              >
                <div className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-bold text-[#051D67] mb-1 font-sans">
                  $2.881
                </div>
                <div className="text-xs sm:text-sm lg:text-base text-[#262626] font-serif">
                  Reservas Internacionales MM
                </div>
              </motion.div>
            </motion.div>
          </div>
        </motion.section>

        {/* Company Logos Section with reduced spacing */}
        <motion.section
          className="bg-white pt-8 sm:pt-10 lg:pt-12 xl:pt-14 pb-6 sm:pb-8 lg:pb-10 xl:pb-12 border-t border-[#262626]/10"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true, amount: 0.3 }}
        >
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 overflow-x-hidden">
            <div className="flex flex-col items-center lg:flex-row w-full overflow-x-hidden">
              <motion.div
                className="lg:max-w-48 xl:max-w-64 lg:border-r lg:pr-8 mb-6 lg:mb-0"
                {...fadeInLeft}
                transition={{ ...fadeInLeft.transition, delay: 0.3 }}
              >
                <p className="text-center lg:text-end text-sm sm:text-base lg:text-lg xl:text-xl text-[#262626] font-medium font-serif">
                  Sectores con mayor <span className="text-[#051D67] font-bold">exportación</span>
                </p>
              </motion.div>
              <motion.div
                className="relative lg:w-[calc(100%-12rem)] xl:w-[calc(100%-16rem)] overflow-hidden"
                {...fadeInRight}
                transition={{ ...fadeInRight.transition, delay: 0.4 }}
              >
                <InfiniteSlider duration={25} durationOnHover={15} gap={80}>
                  <div className="flex flex-col items-center">
                    <Pickaxe
                      className="h-5 w-5 sm:h-6 sm:w-6 lg:h-7 lg:w-7 text-[#051D67] mb-2"
                      strokeWidth={1.5}
                    />
                    <div className="text-[#051D67] font-medium text-xs sm:text-sm lg:text-base">
                      MINERÍA
                    </div>
                  </div>
                  <div className="flex flex-col items-center">
                    <Fuel
                      className="h-5 w-5 sm:h-6 sm:w-6 lg:h-7 lg:w-7 text-[#051D67] mb-2"
                      strokeWidth={1.5}
                    />
                    <div className="text-[#051D67] font-medium text-xs sm:text-sm lg:text-base">
                      HIDROCARBUROS
                    </div>
                  </div>
                  <div className="flex flex-col items-center">
                    <Wheat
                      className="h-5 w-5 sm:h-6 sm:w-6 lg:h-7 lg:w-7 text-[#051D67] mb-2"
                      strokeWidth={1.5}
                    />
                    <div className="text-[#051D67] font-medium text-xs sm:text-sm lg:text-base">
                      AGRICULTURA
                    </div>
                  </div>
                  <div className="flex flex-col items-center">
                    <Beef
                      className="h-5 w-5 sm:h-6 sm:w-6 lg:h-7 lg:w-7 text-[#051D67] mb-2"
                      strokeWidth={1.5}
                    />
                    <div className="text-[#051D67] font-medium text-xs sm:text-sm lg:text-base">
                      GANADERÍA
                    </div>
                  </div>
                  <div className="flex flex-col items-center">
                    <Factory
                      className="h-5 w-5 sm:h-6 sm:w-6 lg:h-7 lg:w-7 text-[#051D67] mb-2"
                      strokeWidth={1.5}
                    />
                    <div className="text-[#051D67] font-medium text-xs sm:text-sm lg:text-base">
                      MANUFACTURA
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

                <div className="bg-gradient-to-r from-white absolute inset-y-0 left-0 w-12 sm:w-16 md:w-20"></div>
                <div className="bg-gradient-to-l from-white absolute inset-y-0 right-0 w-12 sm:w-16 md:w-20"></div>
                <ProgressiveBlur
                  className="pointer-events-none absolute left-0 top-0 h-full w-12 sm:w-16 md:w-20"
                  direction="left"
                  blurIntensity={1}
                />
                <ProgressiveBlur
                  className="pointer-events-none absolute right-0 top-0 h-full w-12 sm:w-16 md:w-20"
                  direction="right"
                  blurIntensity={1}
                />
              </motion.div>
            </div>
          </div>
        </motion.section>

        {/* Importation Sectors Section */}
        <motion.section
          className="bg-white pt-4 sm:pt-6 lg:pt-8 xl:pt-10 pb-6 sm:pb-8 lg:pb-10 xl:pb-12"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true, amount: 0.3 }}
        >
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 overflow-x-hidden">
            <div className="flex flex-col items-center lg:flex-row w-full overflow-x-hidden">
              <motion.div
                className="lg:max-w-48 xl:max-w-64 lg:border-r lg:pr-8 mb-6 lg:mb-0"
                {...fadeInLeft}
                transition={{ ...fadeInLeft.transition, delay: 0.3 }}
              >
                <p className="text-center lg:text-end text-sm sm:text-base lg:text-lg xl:text-xl text-[#262626] font-medium font-serif">
                  Sectores de mayor <span className="text-[#051D67] font-bold">importación</span>
                </p>
              </motion.div>
              <motion.div
                className="relative lg:w-[calc(100%-12rem)] xl:w-[calc(100%-16rem)] overflow-hidden"
                {...fadeInRight}
                transition={{ ...fadeInRight.transition, delay: 0.4 }}
              >
                <InfiniteSlider duration={25} durationOnHover={15} gap={80}>
                  <div className="flex flex-col items-center">
                    <Fuel
                      className="h-5 w-5 sm:h-6 sm:w-6 lg:h-7 lg:w-7 text-[#051D67] mb-2"
                      strokeWidth={1.5}
                    />
                    <div className="text-[#051D67] font-medium text-xs sm:text-sm lg:text-base">
                      COMBUSTIBLE
                    </div>
                  </div>
                  <div className="flex flex-col items-center">
                    <Car
                      className="h-5 w-5 sm:h-6 sm:w-6 lg:h-7 lg:w-7 text-[#051D67] mb-2"
                      strokeWidth={1.5}
                    />
                    <div className="text-[#051D67] font-medium text-xs sm:text-sm lg:text-base">
                      VEHÍCULOS
                    </div>
                  </div>
                  <div className="flex flex-col items-center">
                    <Settings
                      className="h-5 w-5 sm:h-6 sm:w-6 lg:h-7 lg:w-7 text-[#051D67] mb-2"
                      strokeWidth={1.5}
                    />
                    <div className="text-[#051D67] font-medium text-xs sm:text-sm lg:text-base">
                      BIENES DE CAPITAL
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
                    <Wrench
                      className="h-5 w-5 sm:h-6 sm:w-6 lg:h-7 lg:w-7 text-[#051D67] mb-2"
                      strokeWidth={1.5}
                    />
                    <div className="text-[#051D67] font-medium text-xs sm:text-sm lg:text-base">
                      MAQUINARIA
                    </div>
                  </div>
                </InfiniteSlider>

                <div className="bg-gradient-to-r from-white absolute inset-y-0 left-0 w-12 sm:w-16 md:w-20"></div>
                <div className="bg-gradient-to-l from-white absolute inset-y-0 right-0 w-12 sm:w-16 md:w-20"></div>
                <ProgressiveBlur
                  className="pointer-events-none absolute left-0 top-0 h-full w-12 sm:w-16 md:w-20"
                  direction="left"
                  blurIntensity={1}
                />
                <ProgressiveBlur
                  className="pointer-events-none absolute right-0 top-0 h-full w-12 sm:w-16 md:w-20"
                  direction="right"
                  blurIntensity={1}
                />
              </motion.div>
            </div>
          </div>
        </motion.section>
      </section>
    </>
  );
}
