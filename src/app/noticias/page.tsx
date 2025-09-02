"use client";

import { useState } from "react";
import NordexHeader from "@/components/views/landing-page/nordex-header";
import NordexFooterSection from "@/components/views/landing-page/nordex-footer-section";
import NordexBanner from "@/components/ui/nordex-banner";
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

export default function NoticiasPage() {
  // Mock data for blog posts - this will be replaced with Contentful data
  const mockPosts = [
    {
      id: 1,
      title: "Nuevas Regulaciones de Importación 2024",
      excerpt: "Conoce las últimas actualizaciones en normativas de importación que afectan el comercio internacional.",
      date: "2024-01-15",
      category: "Regulaciones",
      image: "/placeholder-blog-1.jpg",
      slug: "nuevas-regulaciones-importacion-2024"
    },
    {
      id: 2,
      title: "Cómo Optimizar los Costos de Envío Internacional",
      excerpt: "Descubre estrategias efectivas para reducir costos en tus operaciones de importación.",
      date: "2024-01-10",
      category: "Consejos",
      image: "/placeholder-blog-2.jpg",
      slug: "optimizar-costos-envio-internacional"
    },
    {
      id: 3,
      title: "Tendencias del Comercio Internacional en América Latina",
      excerpt: "Análisis completo de las tendencias emergentes en el comercio internacional regional.",
      date: "2024-01-05",
      category: "Análisis",
      image: "/placeholder-blog-3.jpg",
      slug: "tendencias-comercio-internacional-latam"
    },
    {
      id: 4,
      title: "Digitalización de Procesos Aduaneros",
      excerpt: "La transformación digital está revolucionando los procesos aduaneros. Te contamos cómo.",
      date: "2024-01-01",
      category: "Tecnología",
      image: "/placeholder-blog-4.jpg",
      slug: "digitalizacion-procesos-aduaneros"
    },
    {
      id: 5,
      title: "Guía Completa para Nuevos Importadores",
      excerpt: "Todo lo que necesitas saber para comenzar en el mundo de las importaciones.",
      date: "2023-12-28",
      category: "Guías",
      image: "/placeholder-blog-5.jpg",
      slug: "guia-completa-nuevos-importadores"
    },
    {
      id: 6,
      title: "Impacto del E-commerce en las Importaciones",
      excerpt: "Cómo el crecimiento del comercio electrónico está transformando las importaciones.",
      date: "2023-12-25",
      category: "E-commerce",
      image: "/placeholder-blog-6.jpg",
      slug: "impacto-ecommerce-importaciones"
    }
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

  return (
    <div className="bg-white min-h-screen">
      <NordexBanner />
      <NordexHeader />
      
      <main className="pt-32 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Hero Section */}
          <div className="flex gap-4 py-12 flex-col items-start mb-16">
            <div>
              <Badge className="bg-[#051D67] text-white hover:bg-[#041655]">
                Blog
              </Badge>
            </div>
            <div className="flex gap-2 flex-col">
              <h1 className="text-3xl md:text-5xl tracking-tighter lg:max-w-xl font-regular text-[#262626] font-sans font-bold">
                Noticias y <span className="text-[#051D67]">Blog</span>
              </h1>
              <p className="text-lg max-w-xl lg:max-w-xl leading-relaxed tracking-tight text-[#262626A3] font-serif">
                Mantente informado sobre las últimas tendencias, regulaciones y consejos 
                del mundo del comercio internacional y las importaciones.
              </p>
            </div>
          </div>

          {/* Categories Tabs */}
          <div className="flex flex-wrap justify-center gap-8 mb-12">
            {categories.map((category) => {
              const IconComponent = category.icon;
              return (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  className={`flex flex-col items-center gap-3 transition-all duration-200 ${
                    activeCategory === category.id
                      ? "text-[#81D843]"
                      : "text-[#6B6B6B] hover:text-[#262626]"
                  }`}
                >
                  <IconComponent className="w-6 h-6" />
                  <div className="text-center">
                    <span className="text-sm font-medium block">
                      {category.name}
                    </span>
                    {activeCategory === category.id && (
                      <div className="w-full h-0.5 bg-[#81D843] mt-2"></div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Featured Post */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden mb-12">
            <div className="md:flex">
              <div className="md:w-1/2">
                <div className="h-64 md:h-full bg-gray-200 flex items-center justify-center">
                  <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              </div>
              <div className="md:w-1/2 p-8">
                <div className="flex items-center mb-4">
                  <span className="bg-[#051D67] text-white text-xs font-medium px-3 py-1 rounded-full">
                    Destacado
                  </span>
                  <span className="ml-4 text-sm text-[#6B6B6B]">15 Enero 2024</span>
                </div>
                <h2 className="text-2xl font-bold font-sans text-[#262626] mb-4">
                  {mockPosts[0].title}
                </h2>
                <p className="text-[#6B6B6B] font-serif mb-6">
                  {mockPosts[0].excerpt}
                </p>
                <button className="bg-[#051D67] hover:bg-[#041655] text-white px-6 py-2 rounded-md font-medium transition-colors">
                  Leer Más
                </button>
              </div>
            </div>
          </div>

          {/* News Gallery */}
          <NewsGallery items={mockPosts.slice(1)} heading="Más Artículos" />

          {/* Load More Button */}
          <div className="text-center mt-12">
            <button className="border border-[#051D67] text-[#051D67] hover:bg-[#051D67] hover:text-white px-8 py-3 rounded-md font-medium transition-colors">
              Cargar Más Artículos
            </button>
          </div>
        </div>
      </main>

      <NordexFooterSection />
    </div>
  );
}