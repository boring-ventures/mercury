"use client";

import { InfiniteMovingCards } from "@/components/ui/infinite-moving-cards";
import { motion } from "framer-motion";
import { fadeInUp, fadeInDown, scaleIn } from "@/lib/animations";

const testimonials = [
  {
    quote:
      "NORDEX gestionó nuestra importación de forma impecable. Redujimos tiempos y costos en un 25%.",
    name: "TechCorp Bolivia",
    title: "Director de Operaciones",
  },
  {
    quote:
      "Logística, aduanas y pagos internacionales en un solo flujo. Transparencia total del proceso.",
    name: "MindfulCo",
    title: "Gerente General",
  },
  {
    quote:
      "Cotizaciones automáticas en minutos y seguimiento hasta la entrega. Eficiencia real.",
    name: "InnovateLabs",
    title: "Jefe de Compras",
  },
  {
    quote:
      "NORDEX es nuestro aliado para crecer fuera del país. Cumplimiento y resultados.",
    name: "FutureWorks",
    title: "CEO",
  },
  {
    quote:
      "La gestión de aduanas de NORDEX nos ahorra tiempo y evita problemas. Excelente servicio.",
    name: "Zenith Health",
    title: "Gerente de Importaciones",
  },
];

export default function NordexTestimonialsSection() {
  return (
    <section className="bg-[#051D67] py-20">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          className="text-center mb-10"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true, amount: 0.3 }}
        >
          <motion.h2
            className="text-white font-sans font-bold text-[30px] leading-tight"
            {...fadeInDown}
            transition={{ ...fadeInDown.transition, delay: 0.2 }}
          >
            Testimonios de clientes
          </motion.h2>
          <motion.p
            className="text-white/80 text-[16px] mt-2 font-serif"
            {...fadeInUp}
            transition={{ ...fadeInUp.transition, delay: 0.4 }}
          >
            Resultados medibles. Historias reales de compañías que ya expanden
            su negocio con NORDEX.
          </motion.p>
        </motion.div>

        <motion.div
          className="rounded-2xl border border-white/10 bg-white/5 p-4"
          {...scaleIn}
          transition={{ ...scaleIn.transition, delay: 0.6 }}
        >
          <InfiniteMovingCards
            items={testimonials.map((t) => ({
              quote: t.quote,
              name: `${t.name}`,
              title: t.title,
            }))}
            direction="right"
            speed="normal"
            className="[--duration:40s]"
          />
        </motion.div>
      </div>
    </section>
  );
}
