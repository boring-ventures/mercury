"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  fadeInUp,
  fadeInLeft,
  scaleIn,
  staggerContainer,
  buttonHover,
  cardHover,
} from "@/lib/animations";

export default function NordexNewsSection() {
  const news = [
    {
      id: 1,
      title: "Bolivia Registra Déficit Comercial de $US 496 Millones",
      excerpt:
        "Pese a tres meses consecutivos de superávit, la balanza comercial acumulada muestra un déficit significativo que impacta las reservas internacionales...",
      category: "Economía",
      date: "4 Sep 2025",
      readTime: "3 min",
      image: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&h=400&fit=crop",
      featured: true,
    },
    {
      id: 2,
      title: "Reservas Internacionales Alcanzan $US 2.881 Millones",
      excerpt:
        "Las RIN aumentaron principalmente por la revalorización del oro, que representa el 92% del total de las reservas bolivianas...",
      category: "Economía",
      date: "3 Sep 2025",
      readTime: "2 min",
      image: "https://images.unsplash.com/photo-1640340434855-6084b1f4901c?w=600&h=300&fit=crop",
    },
    {
      id: 3,
      title: "Inteligencia Artificial Revoluciona el Comercio Exterior",
      excerpt:
        "La IA optimiza rutas logísticas, automatiza trámites aduaneros y facilita comunicación internacional en tiempo real...",
      category: "Tecnología",
      date: "2 Sep 2025",
      readTime: "4 min",
      image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=600&h=300&fit=crop",
    },
    {
      id: 4,
      title: "Crisis de Talento Afecta Logística Internacional",
      excerpt:
        "El Foro Económico Mundial advierte sobre la escasez de profesionales especializados en cadenas de suministro globales...",
      category: "Mercado",
      date: "2 Sep 2025",
      readTime: "3 min",
      image: "https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=600&h=300&fit=crop",
    },
  ];

  return (
    <section id="noticias" className="bg-[#FFFFFF] py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="flex gap-4 py-12 flex-col items-start mb-8"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true, amount: 0.3 }}
        >
          <motion.div {...fadeInUp}>
            <Badge className="bg-[#051D67] text-white hover:bg-[#041655]">
              Noticias
            </Badge>
          </motion.div>
          <motion.div
            className="flex gap-2 flex-col"
            {...fadeInLeft}
            transition={{ ...fadeInLeft.transition, delay: 0.2 }}
          >
            <h2 className="text-[30px] sm:text-[48px] tracking-tighter lg:max-w-xl font-regular text-[#262626] font-sans font-bold">
              Noticias y Actualizaciones
            </h2>
            <p className="text-[16px] max-w-xl lg:max-w-xl leading-relaxed tracking-tight text-[#262626A3] font-serif">
              Mantente informado sobre nuestros logros, nuevos servicios y las
              últimas tendencias en comercio internacional.
            </p>
          </motion.div>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-12"
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, amount: 0.3 }}
        >
          {news.map((article, index) => (
            <motion.div
              key={article.id}
              className="bg-white rounded-xl p-4 sm:p-6 hover:shadow-lg transition-all duration-300 group border border-gray-100 h-full flex flex-col"
              variants={scaleIn}
              whileHover={{
                y: -5,
                scale: 1.02,
                boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.15)",
                transition: { duration: 0.3 },
              }}
            >
              <div className="space-y-4 flex-1">
                <div className="aspect-[16/9] bg-gray-200 rounded-lg mb-4 overflow-hidden">
                  <img 
                    src={article.image} 
                    alt={article.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                      e.currentTarget.parentElement?.classList.add('bg-gray-200');
                    }}
                  />
                </div>

                <div className="flex items-center space-x-3">
                  <span className="bg-[#051D67]/10 text-[#051D67] px-2 py-1 rounded-md text-xs font-medium">
                    {article.category}
                  </span>
                  <span className="text-[#262626A3] text-xs font-serif">
                    {article.date}
                  </span>
                </div>

                <h4 className="text-[#262626] font-sans text-base sm:text-lg font-bold leading-tight group-hover:text-[#051D67] transition-colors duration-200">
                  {article.title}
                </h4>

                <p className="text-[#262626A3] text-sm leading-relaxed flex-1 font-serif">
                  {article.excerpt}
                </p>

                <div className="flex items-center justify-between pt-4">
                  <span className="text-[#262626A3] text-xs font-serif">
                    {article.readTime} lectura
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-[#051D67] hover:text-[#041655] p-0 h-auto font-medium text-sm"
                  >
                    Leer más →
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          className="text-center"
          {...fadeInUp}
          transition={{ ...fadeInUp.transition, delay: 0.4 }}
        >
          <motion.div {...buttonHover}>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="bg-transparent border-2 border-[#051D67] text-[#051D67] hover:bg-[#051D67] hover:text-white px-8 py-3 rounded-md font-medium transition-all duration-200"
            >
              <Link href="/noticias">Ver todas las noticias</Link>
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
