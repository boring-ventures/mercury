"use client";

import React from "react";
import { motion, useAnimation } from "motion/react";
import { useEffect, useState } from "react";
import {
  Building,
  Package,
  ShirtIcon,
  Pill,
  UtensilsIcon,
  Laptop,
} from "lucide-react";
import { BlurFade } from "@/components/magicui/blur-fade";
import { AnimatedShinyText } from "@/components/magicui/animated-shiny-text";

const bolivianCompanies = [
  { name: "Importadoras de Tecnología", icon: Laptop },
  { name: "Distribuidoras de Maquinaria", icon: Package },
  { name: "Empresas Textiles", icon: ShirtIcon },
  { name: "Sector Farmacéutico", icon: Pill },
  { name: "Industria Alimentaria", icon: UtensilsIcon },
  { name: "Empresas Industriales", icon: Building },
];

export function SocialProofSection() {
  const controls = useAnimation();
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex(
        (prevIndex) => (prevIndex + 1) % bolivianCompanies.length
      );
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    controls.start({
      opacity: [0, 1, 1, 0],
      y: [20, 0, 0, -20],
      transition: { duration: 2.5, times: [0, 0.1, 0.9, 1] },
    });
  }, [controls, currentIndex]);

  return (
    <section className="py-16 bg-secondary/20 overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <BlurFade>
          <h2 className="text-2xl md:text-3xl font-bold text-center text-foreground mb-4">
            <AnimatedShinyText>
              Empresas líderes confían en NORDEX
            </AnimatedShinyText>
          </h2>
          <p className="text-center text-muted-foreground mb-8 max-w-2xl mx-auto">
            Facilitamos el comercio internacional para empresas bolivianas de
            diversos sectores industriales
          </p>
        </BlurFade>

        <div className="flex justify-center items-center h-32">
          <motion.div
            key={currentIndex}
            animate={controls}
            className="flex flex-col items-center"
          >
            {React.createElement(bolivianCompanies[currentIndex].icon, {
              size: 56,
              className: "text-primary mb-3",
            })}
            <span className="text-xl font-semibold text-foreground">
              {bolivianCompanies[currentIndex].name}
            </span>
          </motion.div>
        </div>

        <BlurFade delay={0.2}>
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              { value: "+150", label: "Empresas atendidas" },
              { value: "+500", label: "Transacciones procesadas" },
              { value: "98%", label: "Satisfacción del cliente" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-primary mb-1">
                  {stat.value}
                </div>
                <div className="text-sm text-muted-foreground">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </BlurFade>
      </div>
    </section>
  );
}
