import React from "react";
import {
  Newspaper,
  TrendingUp,
  Globe,
  Users,
  Calendar,
  ArrowRight,
} from "lucide-react";

export default function Features() {
  const newsArticles = [
    {
      icon: TrendingUp,
      title: "Nuevas Oportunidades de Exportación en Asia",
      excerpt: "Descubre cómo las empresas bolivianas pueden aprovechar los acuerdos comerciales recientes con países asiáticos.",
      date: "15 Enero 2025",
      category: "Mercados Internacionales",
      color: "bg-[#051D67]",
      readTime: "5 min lectura",
    },
    {
      icon: Globe,
      title: "Actualizaciones en Regulaciones ASFI",
      excerpt: "Conoce los cambios más importantes en las regulaciones financieras que afectan el comercio internacional.",
      date: "12 Enero 2025",
      category: "Regulaciones",
      color: "bg-[#81D843]",
      readTime: "7 min lectura",
    },
    {
      icon: Users,
      title: "Casos de Éxito: Empresa Textil en Europa",
      excerpt: "Historia inspiradora de cómo una empresa textil boliviana logró expandirse exitosamente al mercado europeo.",
      date: "10 Enero 2025",
      category: "Casos de Éxito",
      color: "bg-[#051D67]",
      readTime: "6 min lectura",
    },
    {
      icon: Calendar,
      title: "Eventos de Networking Internacional 2025",
      excerpt: "Calendario completo de ferias comerciales y eventos de networking para empresas bolivianas.",
      date: "8 Enero 2025",
      category: "Eventos",
      color: "bg-[#81D843]",
      readTime: "4 min lectura",
    },
  ];

  const industryInsights = [
    {
      title: "Tendencias del Comercio Internacional",
      description: "Análisis de las principales tendencias que están transformando el comercio global y cómo afectan a las empresas bolivianas.",
      icon: "📊",
    },
    {
      title: "Guías de Internacionalización",
      description: "Recursos prácticos y guías paso a paso para empresas que buscan expandir sus operaciones internacionalmente.",
      icon: "📚",
    },
    {
      title: "Análisis de Mercados",
      description: "Estudios detallados de mercados internacionales con oportunidades específicas para productos y servicios bolivianos.",
      icon: "🔍",
    },
  ];

  return (
    <section id="noticias" className="bg-white py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-bold text-[#051D67] mb-6 font-['Helvetica']">
            Noticias y Actualizaciones
          </h2>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto font-['Helvetica']">
            Mantente informado sobre las últimas novedades en comercio
            internacional y nuestros servicios
          </p>
        </div>

        {/* Featured News */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-[#051D67] mb-4 font-['Helvetica']">
              Últimas Noticias
            </h3>
            <p className="text-xl text-gray-600 font-['Helvetica']">
              Información relevante para tu estrategia de internacionalización
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {newsArticles.map((article, index) => {
              const IconComponent = article.icon;
              return (
                <div
                  key={index}
                  className="bg-white rounded-lg p-6 hover:shadow-md transition-all duration-300 hover:scale-105 border border-gray-100 group"
                >
                  <div className="mb-4">
                    <div
                      className={`inline-flex items-center justify-center w-12 h-12 rounded-lg ${article.color} shadow-sm`}
                    >
                      <IconComponent className="w-6 h-6 text-[#FCFDFD]" />
                    </div>
                  </div>

                  <div className="mb-3">
                    <span className="text-xs font-semibold text-[#81D843] uppercase tracking-wide font-['Helvetica']">
                      {article.category}
                    </span>
                  </div>

                  <h4 className="text-lg font-bold text-[#051D67] mb-3 group-hover:text-[#81D843] transition-colors line-clamp-2 font-['Helvetica']">
                    {article.title}
                  </h4>

                  <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-3 font-['Helvetica']">
                    {article.excerpt}
                  </p>

                  <div className="flex items-center justify-between text-xs text-gray-500 mb-4 font-['Helvetica']">
                    <span>{article.date}</span>
                    <span>{article.readTime}</span>
                  </div>

                  <a
                    href="#"
                    className="inline-flex items-center text-[#051D67] hover:text-[#81D843] font-semibold text-sm group-hover:translate-x-1 transition-all duration-300 font-['Helvetica']"
                  >
                    Leer más
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </a>
                </div>
              );
            })}
          </div>
        </div>

        {/* Industry Insights */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-[#051D67] mb-4 font-['Helvetica']">
              Insights de la Industria
            </h3>
            <p className="text-xl text-gray-600 font-['Helvetica']">
              Recursos y análisis especializados para tu crecimiento
              internacional
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {industryInsights.map((insight, index) => (
              <div
                key={index}
                className="bg-[#051D67] rounded-lg p-8 text-[#FCFDFD] hover:scale-105 transition-all duration-300"
              >
                <div className="text-4xl mb-4">{insight.icon}</div>
                <h4 className="text-xl font-bold mb-4 font-['Helvetica']">{insight.title}</h4>
                <p className="text-[#FCFDFD] opacity-90 leading-relaxed font-['Helvetica']">
                  {insight.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Newsletter Signup */}
        <div className="bg-[#81D843] rounded-lg p-12 text-[#051D67] text-center">
          <div className="max-w-2xl mx-auto">
            <Newspaper className="w-16 h-16 mx-auto mb-6 text-[#051D67]" />
            <h3 className="text-3xl font-bold mb-4 font-['Helvetica']">Mantente Informado</h3>
            <p className="text-xl opacity-90 mb-8 font-['Helvetica']">
              Suscríbete a nuestro boletín para recibir las últimas noticias,
              insights y oportunidades de comercio internacional.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
              <input
                type="email"
                placeholder="Tu correo electrónico"
                className="flex-1 px-4 py-3 rounded-lg text-[#051D67] placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#051D67] font-['Helvetica']"
              />
              <button className="px-8 py-3 bg-[#051D67] hover:bg-[#0a2b7a] text-white rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 font-['Helvetica']">
                Suscribirse
              </button>
            </div>

            <p className="text-sm opacity-80 mt-4 font-['Helvetica']">
              No spam, solo contenido valioso para tu negocio.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
