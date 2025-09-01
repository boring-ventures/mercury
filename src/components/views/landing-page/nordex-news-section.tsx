"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function NordexNewsSection() {
  const news = [
    {
      id: 1,
      title: "NORDEX expande sus operaciones a 5 nuevos países sudamericanos",
      excerpt:
        "Nuestra empresa consolida su presencia en la región con nuevas alianzas estratégicas que beneficiarán a empresas bolivianas...",
      category: "Expansión",
      date: "15 Dic 2024",
      readTime: "3 min",
      image: "/api/placeholder/400/250",
      featured: true,
    },
    {
      id: 2,
      title: "Nuevo récord: $12M en transacciones gestionadas este mes",
      excerpt:
        "Los servicios de facilitación de pagos internacionales de NORDEX alcanzaron cifras históricas durante noviembre...",
      category: "Resultados",
      date: "10 Dic 2024",
      readTime: "2 min",
      image: "/api/placeholder/300/200",
    },
    {
      id: 3,
      title: "Certificación ISO 9001:2015 para procesos de comercio exterior",
      excerpt:
        "NORDEX obtiene la certificación internacional que garantiza la calidad y eficiencia en todos sus procesos...",
      category: "Certificaciones",
      date: "5 Dic 2024",
      readTime: "4 min",
      image: "/api/placeholder/300/200",
    },
    {
      id: 4,
      title: "Seminario gratuito: 'Claves para exportar desde Bolivia'",
      excerpt:
        "Únete a nuestro webinar exclusivo donde compartiremos estrategias probadas para el éxito en mercados internacionales...",
      category: "Eventos",
      date: "1 Dic 2024",
      readTime: "1 min",
      image: "/api/placeholder/300/200",
    },
  ];


  return (
    <section id="noticias" className="bg-[#FFFFFF] py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-[#1F1915] font-serif text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
            Noticias y Actualizaciones
          </h2>
          <p className="text-[#1F1915A3] text-base md:text-lg max-w-3xl mx-auto leading-relaxed mb-8">
            Mantente informado sobre nuestros logros, nuevos servicios y las
            últimas tendencias en comercio internacional.
          </p>

        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {news.map((article, index) => (
            <div
              key={article.id}
              className="bg-white rounded-xl p-6 hover:shadow-lg transition-all duration-300 group border border-gray-100 h-full flex flex-col"
            >
              <div className="space-y-4 flex-1">
                <div className="aspect-[16/9] bg-gray-200 rounded-lg mb-4"></div>
                
                <div className="flex items-center space-x-3">
                  <span className="bg-[#051D67]/10 text-[#051D67] px-2 py-1 rounded-md text-xs font-medium">
                    {article.category}
                  </span>
                  <span className="text-[#1F1915A3] text-xs">
                    {article.date}
                  </span>
                </div>

                <h4 className="text-[#1F1915] font-serif text-lg font-bold leading-tight group-hover:text-[#051D67] transition-colors duration-200">
                  {article.title}
                </h4>

                <p className="text-[#1F1915A3] text-sm leading-relaxed flex-1">
                  {article.excerpt}
                </p>

                <div className="flex items-center justify-between pt-4">
                  <span className="text-[#1F1915A3] text-xs">
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
            </div>
          ))}
        </div>

        <div className="text-center">
          <Button
            size="lg"
            variant="outline"
            className="border-[#051D67] text-[#051D67] hover:bg-[#051D67] hover:text-white px-8 py-3 rounded-md font-medium transition-all duration-200"
          >
            Ver todas las noticias
          </Button>
        </div>

      </div>
    </section>
  );
}
