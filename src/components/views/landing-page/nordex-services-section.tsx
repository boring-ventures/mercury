"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Building2,
  CreditCard,
  Ship,
  Lightbulb,
  GraduationCap,
  Headphones,
} from "lucide-react";
import { WavePath } from "@/components/wave-path";
import { motion } from "framer-motion";

const NordexServicesSection = () => {
  const advantages = [
    {
      title: "Intermediación Comercial",
      description:
        "Negociación directa con proveedores internacionales y representación de tus intereses en el mercado global.",
      icon: Building2,
    },
    {
      title: "Gestión de Pagos",
      description:
        "Procesamiento seguro de pagos internacionales con cumplimiento normativo ASFI y gestión de divisas.",
      icon: CreditCard,
    },
    {
      title: "Operaciones de Comercio Exterior",
      description:
        "Gestión logística integral, trámites aduaneros y coordinación de envíos internacionales.",
      icon: Ship,
    },
    {
      title: "Consultoría Especializada",
      description:
        "Asesoría en estrategias de internacionalización y análisis de mercados internacionales.",
      icon: Lightbulb,
    },
    {
      title: "Capacitación Empresarial",
      description:
        "Programas de formación en comercio exterior y desarrollo de planes de expansión global.",
      icon: GraduationCap,
    },
    {
      title: "Soporte Continuo",
      description:
        "Acompañamiento 24/7 en todo el proceso de internacionalización de tu empresa.",
      icon: Headphones,
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: {
      opacity: 0,
      x: -50,
      scale: 0.9,
    },
    visible: {
      opacity: 1,
      x: 0,
      scale: 1,
      transition: {
        duration: 0.6,
      },
    },
  };

  const slideInFromRight = {
    hidden: {
      opacity: 0,
      x: 100,
      y: 20,
    },
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      transition: {
        duration: 0.8,
      },
    },
  };

  return (
    <section
      id="servicios"
      className="bg-[#FFFFFF] pt-8 sm:pt-10 md:pt-12 pb-16 sm:pb-18 md:pb-20"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 overflow-x-hidden">
        <motion.div
          className="flex gap-4 py-8 sm:py-10 md:py-12 flex-col items-start"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={containerVariants}
        >
          <motion.div
            className="flex gap-2 flex-col"
            variants={slideInFromRight}
          >
            <Badge className="bg-[#051D67] text-white hover:bg-[#041655] self-start">
              Servicios
            </Badge>
            <h2 className="text-3xl md:text-5xl tracking-tighter lg:max-w-xl font-regular text-[#262626] font-sans font-bold">
              Nuestros Servicios
            </h2>
            <p className="text-[16px] max-w-xl lg:max-w-xl leading-relaxed tracking-tight text-[#262626A3] font-serif">
              Soluciones integrales para conectar tu empresa con el mercado
              internacional, desde la negociación hasta la entrega final.
            </p>
          </motion.div>
          <motion.div
            className="flex gap-10 pt-8 sm:pt-10 md:pt-12 flex-col w-full"
            variants={containerVariants}
          >
            <motion.div
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 items-start gap-8 sm:gap-10 w-full"
              variants={containerVariants}
            >
              {advantages.map((advantage, index) => {
                const IconComponent = advantage.icon;
                return (
                  <motion.div
                    key={index}
                    className="flex flex-row gap-4 sm:gap-6 w-full items-start min-w-0 group"
                    variants={itemVariants}
                    whileHover={{
                      x: 10,
                      scale: 1.02,
                      transition: { duration: 0.3 },
                    }}
                  >
                    <motion.div
                      className="w-10 h-10 border-2 border-[#051D67] rounded-lg flex items-center justify-center mt-2 shrink-0 group-hover:bg-[#051D67] transition-colors duration-300"
                      whileHover={{
                        rotate: 360,
                        transition: { duration: 0.6 },
                      }}
                    >
                      <IconComponent className="w-5 h-5 text-[#051D67] group-hover:text-white transition-colors duration-300" />
                    </motion.div>
                    <div className="flex flex-col gap-1 min-w-0">
                      <p className="font-medium text-[#262626] font-sans break-words group-hover:text-[#051D67] transition-colors duration-300">
                        {advantage.title}
                      </p>
                      <p className="text-[#262626A3] text-sm leading-relaxed font-serif break-words">
                        {advantage.description}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Contact CTA Section */}
        <motion.div
          className="text-center mt-12"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <motion.div
            className="bg-gradient-to-r from-[#051D67]/5 to-[#051D67]/10 rounded-2xl p-8 sm:p-12 border border-[#051D67]/20"
            whileHover={{
              scale: 1.02,
              boxShadow: "0 20px 40px -12px rgba(5, 29, 103, 0.15)",
              transition: { duration: 0.3 },
            }}
          >
            <h3 className="text-2xl sm:text-3xl font-bold text-[#262626] mb-4 font-sans">
              ¿Necesitas ayuda con tu proyecto internacional?
            </h3>
            <p className="text-[#262626A3] text-base sm:text-lg mb-8 max-w-2xl mx-auto font-serif">
              Nuestro equipo de expertos está listo para asesorarte y encontrar
              la mejor solución para tu empresa.
            </p>
            <div className="flex justify-center">
              <Button
                size="lg"
                className="bg-[#051D67] hover:bg-[#041655] text-white px-8 py-3 rounded-md font-medium transition-all duration-200"
              >
                Contactar ahora
              </Button>
            </div>
          </motion.div>
        </motion.div>

        {/* CTA Section with Wave Path */}
        <div className="mt-12 sm:mt-14 md:mt-16 text-center">
          <div className="relative">
            {/* Wave Path Component */}
            <div className="flex justify-center mb-8">
              <WavePath className="text-[#051D67]" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default NordexServicesSection;
