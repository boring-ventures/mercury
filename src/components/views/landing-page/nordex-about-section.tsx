"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  fadeInUp,
  fadeInDown,
  scaleIn,
  staggerContainer,
  buttonHover,
  cardHover,
} from "@/lib/animations";

export default function NordexAboutSection() {
  return (
    <section id="quienes-somos" className="bg-[#051D67] py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true, amount: 0.3 }}
        >
          <motion.h2
            className="text-white font-sans text-3xl md:text-4xl lg:text-5xl font-bold leading-tight mb-6"
            {...fadeInDown}
            transition={{ ...fadeInDown.transition, delay: 0.2 }}
          >
            Quiénes somos
          </motion.h2>
          <motion.p
            className="text-white/90 text-[14px] max-w-3xl mx-auto leading-relaxed font-serif"
            {...fadeInUp}
            transition={{ ...fadeInUp.transition, delay: 0.4 }}
          >
            Somos el puente que conecta Bolivia con el mundo. NORDEX nació con
            la visión de transformar el panorama del comercio internacional en
            Bolivia, especializándonos en eliminar las barreras que limitan el
            crecimiento global de las empresas bolivianas.
          </motion.p>
        </motion.div>

        <motion.div
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16"
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, amount: 0.3 }}
        >
          <motion.div
            className="border border-white/20 rounded-xl p-6 text-center bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-all duration-300"
            variants={scaleIn}
            whileHover={{
              y: -5,
              scale: 1.02,
              boxShadow: "0 25px 50px -12px rgba(255, 255, 255, 0.1)",
              transition: { duration: 0.3 },
            }}
          >
            <div className="text-2xl md:text-3xl font-bold text-white mb-2 font-sans">
              10+
            </div>
            <div className="text-white/80 text-sm font-medium font-serif">
              Años de experiencia
            </div>
          </motion.div>
          <motion.div
            className="border border-white/20 rounded-xl p-6 text-center bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-all duration-300"
            variants={scaleIn}
            whileHover={{
              y: -5,
              scale: 1.02,
              boxShadow: "0 25px 50px -12px rgba(255, 255, 255, 0.1)",
              transition: { duration: 0.3 },
            }}
          >
            <div className="text-2xl md:text-3xl font-bold text-white mb-2 font-sans">
              30+
            </div>
            <div className="text-white/80 text-sm font-medium font-serif">
              Empresas
            </div>
          </motion.div>
          <motion.div
            className="border border-white/20 rounded-xl p-6 text-center bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-all duration-300"
            variants={scaleIn}
            whileHover={{
              y: -5,
              scale: 1.02,
              boxShadow: "0 25px 50px -12px rgba(255, 255, 255, 0.1)",
              transition: { duration: 0.3 },
            }}
          >
            <div className="text-2xl md:text-3xl font-bold text-white mb-2 font-sans">
              10+
            </div>
            <div className="text-white/80 text-sm font-medium font-serif">
              Países destino
            </div>
          </motion.div>
          <motion.div
            className="border border-white/20 rounded-xl p-6 text-center bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-all duration-300"
            variants={scaleIn}
            whileHover={{
              y: -5,
              scale: 1.02,
              boxShadow: "0 25px 50px -12px rgba(255, 255, 255, 0.1)",
              transition: { duration: 0.3 },
            }}
          >
            <div className="text-2xl md:text-3xl font-bold text-white mb-2 font-sans">
              $50M+
            </div>
            <div className="text-white/80 text-sm font-medium font-serif">
              En transacciones gestionadas
            </div>
          </motion.div>
        </motion.div>

        <motion.div
          className="text-center"
          {...fadeInUp}
          transition={{ ...fadeInUp.transition, delay: 0.6 }}
        >
          <motion.div {...buttonHover}>
            <Button
              asChild
              size="lg"
              className="bg-white hover:bg-gray-100 text-[#051D67] px-8 py-3 rounded-md font-medium transition-all duration-200"
            >
              <Link href="/quienes-somos">Conoce más sobre nosotros</Link>
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
