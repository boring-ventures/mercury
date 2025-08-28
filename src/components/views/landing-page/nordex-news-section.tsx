"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function NordexNewsSection() {
  const news = [
    {
      id: 1,
      title: "NORDEX expande sus operaciones a 5 nuevos países sudamericanos",
      excerpt: "Nuestra empresa consolida su presencia en la región con nuevas alianzas estratégicas que beneficiarán a empresas bolivianas...",
      category: "Expansión",
      date: "15 Dic 2024",
      readTime: "3 min",
      image: "/api/placeholder/400/250",
      featured: true
    },
    {
      id: 2,
      title: "Nuevo récord: $12M en transacciones gestionadas este mes",
      excerpt: "Los servicios de facilitación de pagos internacionales de NORDEX alcanzaron cifras históricas durante noviembre...",
      category: "Resultados",
      date: "10 Dic 2024",
      readTime: "2 min",
      image: "/api/placeholder/300/200"
    },
    {
      id: 3,
      title: "Certificación ISO 9001:2015 para procesos de comercio exterior",
      excerpt: "NORDEX obtiene la certificación internacional que garantiza la calidad y eficiencia en todos sus procesos...",
      category: "Certificaciones",
      date: "5 Dic 2024",
      readTime: "4 min",
      image: "/api/placeholder/300/200"
    },
    {
      id: 4,
      title: "Seminario gratuito: 'Claves para exportar desde Bolivia'",
      excerpt: "Únete a nuestro webinar exclusivo donde compartiremos estrategias probadas para el éxito en mercados internacionales...",
      category: "Eventos",
      date: "1 Dic 2024",
      readTime: "1 min",
      image: "/api/placeholder/300/200"
    }
  ];

  const categories = ["Todas", "Expansión", "Resultados", "Certificaciones", "Eventos"];

  return (
    <section id="noticias" className="bg-[#FFFFFF] py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-[#1F1915] font-serif text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
            Noticias y Actualizaciones
          </h2>
          <p className="text-[#1F1915A3] text-base md:text-lg max-w-3xl mx-auto leading-relaxed mb-8">
            Mantente informado sobre nuestros logros, nuevos servicios y las últimas tendencias 
            en comercio internacional.
          </p>
          
          <div className="flex flex-wrap justify-center gap-3">
            {categories.map((category, index) => (
              <button
                key={index}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                  index === 0
                    ? 'bg-[#051D67] text-white'
                    : 'bg-gray-100 text-[#1F1915] hover:bg-[#051D67] hover:text-white'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 mb-12">
          <div className="lg:col-span-2">
            <div className="relative bg-gradient-to-br from-[#051D67] to-[#041655] rounded-2xl overflow-hidden shadow-xl group">
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
              <div className="aspect-[16/9] bg-gray-200"></div>
              
              <div className="absolute inset-0 p-8 flex flex-col justify-end">
                <div className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <span className="bg-[#81D843] text-[#051D67] px-3 py-1 rounded-full text-xs font-semibold">
                      DESTACADO
                    </span>
                    <span className="text-white/80 text-sm">{news[0].category}</span>
                  </div>
                  
                  <h3 className="text-white font-serif text-xl md:text-2xl lg:text-3xl font-bold leading-tight">
                    {news[0].title}
                  </h3>
                  
                  <p className="text-white/90 text-sm md:text-base leading-relaxed">
                    {news[0].excerpt}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 text-white/80 text-sm">
                      <span>{news[0].date}</span>
                      <span>•</span>
                      <span>{news[0].readTime} lectura</span>
                    </div>
                    <Button 
                      size="sm"
                      className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white border-white/30 px-4 py-2 rounded-md"
                    >
                      Leer más
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            {news.slice(1).map((article) => (
              <div 
                key={article.id}
                className="bg-[#F2EFE9] rounded-xl p-6 hover:shadow-lg transition-all duration-300 group border border-gray-100"
              >
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <span className="bg-[#051D67]/10 text-[#051D67] px-2 py-1 rounded-md text-xs font-medium">
                      {article.category}
                    </span>
                    <span className="text-[#1F1915A3] text-xs">{article.date}</span>
                  </div>
                  
                  <h4 className="text-[#1F1915] font-serif text-lg font-bold leading-tight group-hover:text-[#051D67] transition-colors duration-200">
                    {article.title}
                  </h4>
                  
                  <p className="text-[#1F1915A3] text-sm leading-relaxed">
                    {article.excerpt}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-[#1F1915A3] text-xs">{article.readTime} lectura</span>
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

        <div className="mt-16 bg-gradient-to-r from-[#F2EFE9] to-white rounded-2xl p-8 border border-gray-100">
          <div className="text-center space-y-6">
            <div className="space-y-3">
              <h3 className="text-[#1F1915] font-serif text-2xl md:text-3xl font-bold">
                Suscríbete a nuestro boletín
              </h3>
              <p className="text-[#1F1915A3] text-sm md:text-base max-w-2xl mx-auto">
                Recibe las últimas noticias, insights del mercado y consejos exclusivos 
                para hacer crecer tu negocio internacionalmente.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Tu email"
                className="flex-1 px-4 py-3 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-[#051D67] focus:border-transparent"
              />
              <Button 
                className="bg-[#051D67] hover:bg-[#041655] text-white px-6 py-3 rounded-md font-medium transition-all duration-200 whitespace-nowrap"
              >
                Suscribirse
              </Button>
            </div>
            
            <p className="text-[#1F1915A3] text-xs">
              No spam. Puedes cancelar tu suscripción en cualquier momento.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}