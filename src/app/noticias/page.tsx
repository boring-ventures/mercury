"use client";

import { useState } from "react";
import NordexHeader from "@/components/views/landing-page/nordex-header";
import NordexFooterSection from "@/components/views/landing-page/nordex-footer-section";
import { Badge } from "@/components/ui/badge";
import { NewsGallery } from "@/components/ui/news-gallery";
import {
  FileText,
  Scale,
  Lightbulb,
  BarChart,
  Laptop,
  BookOpen,
  ShoppingCart,
} from "lucide-react";
import { motion } from "framer-motion";
import {
  fadeInUp,
  fadeInLeft,
  fadeInRight,
  scaleIn,
  staggerContainer,
  buttonHover,
  cardHover,
} from "@/lib/animations";

export default function NoticiasPage() {
  // Recent news articles with economic data
  const mockPosts = [
    {
      id: 1,
      title: "Balanza Comercial Acumula Déficit de $US 500 Millones",
      excerpt:
        "Pese a tres meses consecutivos de superávit, Bolivia mantiene un déficit comercial acumulado de $496 millones hasta julio de 2025.",
      date: "2025-09-04",
      category: "Análisis",
      image: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&h=400&fit=crop",
      slug: "balanza-comercial-deficit-2025",
    },
    {
      id: 2,
      title: "Reservas Internacionales Suben a $US 2.881 Millones",
      excerpt:
        "Las RIN aumentaron $905 millones respecto a 2024, principalmente por revalorización del oro, pero siguen lejos del pico histórico de 2014.",
      date: "2025-09-03",
      category: "Análisis",
      image: "https://images.unsplash.com/photo-1640340434855-6084b1f4901c?w=800&h=400&fit=crop",
      slug: "reservas-internacionales-2025",
    },
    {
      id: 3,
      title: "Propuesta para Estabilizar el Dólar en 8 Bolivianos",
      excerpt:
        "Ex-director del Banco Central propone tres medidas clave para estabilizar el tipo de cambio y restaurar la confianza en el sistema financiero.",
      date: "2025-09-03",
      category: "Análisis",
      image: "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=800&h=400&fit=crop",
      slug: "estabilizar-dolar-8-bolivianos",
    },
    {
      id: 4,
      title: "IA se Convierte en Aliada del Comercio Exterior",
      excerpt:
        "La inteligencia artificial está transformando el comercio internacional mediante optimización de rutas, traducción en tiempo real y análisis predictivo.",
      date: "2025-09-02",
      category: "Tecnología",
      image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=400&fit=crop",
      slug: "ia-comercio-exterior-2025",
    },
    {
      id: 5,
      title: "Escasez de Talento Impacta Logística y Comercio Exterior",
      excerpt:
        "El Foro Económico Mundial advierte sobre la crisis de talento en logística que afecta la competitividad de las cadenas de suministro globales.",
      date: "2025-09-02",
      category: "Análisis",
      image: "https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=800&h=400&fit=crop",
      slug: "escasez-talento-logistica-2025",
    },
    {
      id: 6,
      title: "Exportaciones Bolivianas Muestran Recuperación",
      excerpt:
        "Exportaciones minerales crecieron 16.5% en julio, con incrementos notables en plata (24.8%), plomo (12.1%) y zinc (4.6%).",
      date: "2025-09-01",
      category: "Regulaciones",
      image: "https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=800&h=400&fit=crop",
      slug: "exportaciones-bolivianas-recuperacion",
    },
  ];

  const categories = [
    { id: "todos", name: "Todos", icon: FileText },
    { id: "regulaciones", name: "Regulaciones", icon: Scale },
    { id: "consejos", name: "Consejos", icon: Lightbulb },
    { id: "analisis", name: "Análisis", icon: BarChart },
    { id: "tecnologia", name: "Tecnología", icon: Laptop },
    { id: "guias", name: "Guías", icon: BookOpen },
    { id: "ecommerce", name: "E-commerce", icon: ShoppingCart },
  ];

  const [activeCategory, setActiveCategory] = useState("todos");

  // Filter posts based on active category
  const filteredPosts = activeCategory === "todos" 
    ? mockPosts 
    : mockPosts.filter(post => {
        const postCategory = post.category.toLowerCase();
        if (activeCategory === "analisis") return postCategory === "análisis";
        if (activeCategory === "tecnologia") return postCategory === "tecnología";
        return postCategory === activeCategory.toLowerCase();
      });

  return (
    <div className="bg-white min-h-screen">
      <NordexHeader />

      <main className="pt-24 pb-8 sm:pt-18 sm:pb-10 lg:pt-20 lg:pb-12 xl:pt-24 xl:pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">
          {/* Hero Section */}
          <motion.div
            className="flex gap-3 sm:gap-4 py-4 sm:py-6 lg:py-8 flex-col items-start mb-8 sm:mb-10 lg:mb-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            <motion.div {...fadeInUp}>
              <Badge className="bg-[#051D67] text-white hover:bg-[#041655] text-xs sm:text-sm">
                Blog
              </Badge>
            </motion.div>
            <motion.div
              className="flex gap-2 sm:gap-3 flex-col"
              {...fadeInLeft}
              transition={{ ...fadeInLeft.transition, delay: 0.2 }}
            >
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl tracking-tighter max-w-full lg:max-w-xl xl:max-w-2xl font-regular text-[#262626] font-sans font-bold">
                Noticias y <span className="text-[#051D67]">Blog</span>
              </h1>
              <p className="text-base sm:text-lg lg:text-xl max-w-full sm:max-w-xl lg:max-w-2xl xl:max-w-3xl leading-relaxed tracking-tight text-[#262626A3] font-serif">
                Mantente informado sobre las últimas tendencias, regulaciones y
                consejos del mundo del comercio internacional y las
                importaciones.
              </p>
            </motion.div>
          </motion.div>

          {/* Categories Tabs */}
          <motion.div
            className="flex flex-wrap justify-center gap-4 sm:gap-6 lg:gap-8 mb-8 sm:mb-10 lg:mb-12"
            variants={staggerContainer}
            initial="initial"
            animate="animate"
          >
            {categories.map((category, index) => {
              const IconComponent = category.icon;
              return (
                <motion.button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  className={`flex flex-col items-center gap-2 sm:gap-3 transition-all duration-200 p-2 sm:p-3 rounded-lg hover:bg-gray-50 ${
                    activeCategory === category.id
                      ? "text-[#81D843] bg-gray-50"
                      : "text-[#6B6B6B] hover:text-[#262626]"
                  }`}
                  variants={scaleIn}
                  transition={{
                    ...scaleIn.transition,
                    delay: index * 0.1 + 0.4,
                  }}
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <IconComponent className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7" />
                  <div className="text-center">
                    <span className="text-xs sm:text-sm lg:text-base font-medium block">
                      {category.name}
                    </span>
                    {activeCategory === category.id && (
                      <motion.div
                        className="w-full h-0.5 bg-[#81D843] mt-1 sm:mt-2"
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: 1 }}
                        transition={{ duration: 0.3, ease: "easeOut" }}
                      ></motion.div>
                    )}
                  </div>
                </motion.button>
              );
            })}
          </motion.div>

          {/* Featured Post */}
          <motion.div
            className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden mb-8 sm:mb-10 lg:mb-12"
            {...fadeInUp}
            transition={{ ...fadeInUp.transition, delay: 1.1 }}
            whileHover={{
              y: -5,
              boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.15)",
              transition: { duration: 0.3 },
            }}
          >
            <div className="lg:flex">
              <motion.div
                className="lg:w-1/2"
                {...fadeInLeft}
                transition={{ ...fadeInLeft.transition, delay: 1.3 }}
              >
                <div className="h-48 sm:h-64 lg:h-full bg-gray-200 overflow-hidden">
                  <img 
                    src={filteredPosts[0]?.image || mockPosts[0].image}
                    alt={filteredPosts[0]?.title || mockPosts[0].title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                      e.currentTarget.nextElementSibling?.setAttribute('style', 'display: flex');
                    }}
                  />
                  <div className="w-full h-full bg-gray-200 flex items-center justify-center" style={{display: 'none'}}>
                    <svg
                      className="w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                </div>
              </motion.div>
              <motion.div
                className="lg:w-1/2 p-4 sm:p-6 lg:p-8"
                {...fadeInRight}
                transition={{ ...fadeInRight.transition, delay: 1.3 }}
              >
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mb-3 sm:mb-4">
                  <span className="bg-[#051D67] text-white text-xs sm:text-sm font-medium px-3 py-1 rounded-full w-fit">
                    Destacado
                  </span>
                  <span className="text-xs sm:text-sm lg:text-base text-[#6B6B6B]">
                    4 Septiembre 2025
                  </span>
                </div>
                <h2 className="text-lg sm:text-xl lg:text-2xl xl:text-3xl font-bold font-sans text-[#262626] mb-3 sm:mb-4">
                  {filteredPosts[0]?.title || mockPosts[0].title}
                </h2>
                <p className="text-[#6B6B6B] font-serif text-sm sm:text-base lg:text-lg mb-4 sm:mb-6">
                  {filteredPosts[0]?.excerpt || mockPosts[0].excerpt}
                </p>
                <motion.button
                  className="bg-[#051D67] hover:bg-[#041655] text-white px-4 py-2 sm:px-6 sm:py-3 lg:px-8 lg:py-4 text-sm sm:text-base lg:text-lg rounded-md font-medium transition-colors"
                  {...buttonHover}
                >
                  Leer Más
                </motion.button>
              </motion.div>
            </div>
          </motion.div>

          {/* News Gallery */}
          <motion.div
            {...fadeInUp}
            transition={{ ...fadeInUp.transition, delay: 1.5 }}
          >
            <NewsGallery items={filteredPosts.slice(1)} heading="Más Artículos" />
          </motion.div>

          {/* Load More Button */}
          <motion.div
            className="text-center mt-8 sm:mt-10 lg:mt-12"
            {...fadeInUp}
            transition={{ ...fadeInUp.transition, delay: 1.7 }}
          >
            <motion.button
              className="border border-[#051D67] text-[#051D67] hover:bg-[#051D67] hover:text-white px-6 py-3 sm:px-8 sm:py-3 lg:px-10 lg:py-4 text-sm sm:text-base lg:text-lg rounded-md font-medium transition-colors"
              {...buttonHover}
            >
              Cargar Más Artículos
            </motion.button>
          </motion.div>
        </div>
      </main>

      <NordexFooterSection />
    </div>
  );
}
