import React from "react";
import {
  Newspaper,
  TrendingUp,
  Globe,
  Users,
  Calendar,
  ArrowRight,
} from "lucide-react";

export default function NordexNewsSection() {
  const newsArticles = [
    {
      icon: TrendingUp,
      title: "Nuevas Oportunidades de Exportación en Asia",
      excerpt:
        "Descubre cómo las empresas bolivianas pueden aprovechar los acuerdos comerciales recientes con países asiáticos para expandir sus mercados.",
      date: "15 Enero 2025",
      category: "Mercados Internacionales",
      color: "from-[#051D67] to-[#81D843]",
      readTime: "5 min lectura",
    },
    {
      icon: Globe,
      title: "Actualizaciones en Regulaciones ASFI para Comercio Exterior",
      excerpt:
        "Conoce los cambios más importantes en las regulaciones financieras que afectan las operaciones de comercio internacional en Bolivia.",
      date: "12 Enero 2025",
      category: "Regulaciones",
      color: "from-[#81D843] to-[#051D67]",
      readTime: "7 min lectura",
    },
    {
      icon: Users,
      title: "Casos de Éxito: Empresa Textil Boliviana en Europa",
      excerpt:
        "Historia inspiradora de cómo una empresa textil boliviana logró expandirse exitosamente al mercado europeo con nuestra asistencia.",
      date: "10 Enero 2025",
      category: "Casos de Éxito",
      color: "from-[#051D67] to-[#81D843]",
      readTime: "6 min lectura",
    },
    {
      icon: Calendar,
      title: "Eventos de Networking Internacional en 2025",
      excerpt:
        "Calendario completo de ferias comerciales, conferencias y eventos de networking para empresas bolivianas interesadas en la internacionalización.",
      date: "8 Enero 2025",
      category: "Eventos",
      color: "from-[#81D843] to-[#051D67]",
      readTime: "4 min lectura",
    },
  ];

  const industryInsights = [
    {
      title: "Tendencias del Comercio Internacional",
      description:
        "Análisis de las principales tendencias que están transformando el comercio global y cómo afectan a las empresas bolivianas.",
      icon: "📊",
    },
    {
      title: "Guías de Internacionalización",
      description:
        "Recursos prácticos y guías paso a paso para empresas que buscan expandir sus operaciones internacionalmente.",
      icon: "📚",
    },
    {
      title: "Análisis de Mercados",
      description:
        "Estudios detallados de mercados internacionales con oportunidades específicas para productos y servicios bolivianos.",
      icon: "🔍",
    },
  ];

  return (
    <section className="bg-[#FCFDFD] py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-[#051D67] mb-6">
            Noticias y Insights
          </h2>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto">
            Mantente actualizado con las últimas noticias del comercio
            internacional, regulaciones y oportunidades para empresas
            bolivianas.
          </p>
        </div>

        {/* Featured News */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-[#051D67] mb-4">
              Últimas Noticias
            </h3>
            <p className="text-xl text-gray-600">
              Información relevante para tu estrategia de internacionalización
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {newsArticles.map((article, index) => {
              const IconComponent = article.icon;
              return (
                <div
                  key={index}
                  className="bg-white rounded-2xl p-6 hover:shadow-xl transition-all duration-300 hover:scale-105 border border-gray-100 group"
                >
                  <div className="mb-4">
                    <div
                      className={`inline-flex items-center justify-center w-12 h-12 rounded-lg bg-gradient-to-r ${article.color} shadow-lg`}
                    >
                      <IconComponent className="w-6 h-6 text-[#FCFDFD]" />
                    </div>
                  </div>

                  <div className="mb-3">
                    <span className="text-xs font-semibold text-[#81D843] uppercase tracking-wide">
                      {article.category}
                    </span>
                  </div>

                  <h4 className="text-lg font-bold text-[#051D67] mb-3 group-hover:text-[#81D843] transition-colors line-clamp-2">
                    {article.title}
                  </h4>

                  <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-3">
                    {article.excerpt}
                  </p>

                  <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                    <span>{article.date}</span>
                    <span>{article.readTime}</span>
                  </div>

                  <a
                    href="#"
                    className="inline-flex items-center text-[#051D67] hover:text-[#81D843] font-semibold text-sm group-hover:translate-x-1 transition-all duration-300"
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
            <h3 className="text-3xl font-bold text-[#051D67] mb-4">
              Insights de la Industria
            </h3>
            <p className="text-xl text-gray-600">
              Recursos y análisis especializados para tu crecimiento
              internacional
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {industryInsights.map((insight, index) => (
              <div
                key={index}
                className="bg-gradient-to-br from-[#051D67] to-[#81D843] rounded-2xl p-8 text-[#FCFDFD] hover:scale-105 transition-all duration-300"
              >
                <div className="text-4xl mb-4">{insight.icon}</div>
                <h4 className="text-xl font-bold mb-4">{insight.title}</h4>
                <p className="text-[#FCFDFD] opacity-90 leading-relaxed">
                  {insight.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Newsletter Signup */}
        <div className="bg-gradient-to-r from-[#051D67] to-[#81D843] rounded-2xl p-12 text-[#FCFDFD] text-center">
          <div className="max-w-2xl mx-auto">
            <Newspaper className="w-16 h-16 mx-auto mb-6 text-[#FCFDFD]" />
            <h3 className="text-3xl font-bold mb-4">Mantente Informado</h3>
            <p className="text-xl opacity-90 mb-8">
              Suscríbete a nuestro boletín para recibir las últimas noticias,
              insights y oportunidades de comercio internacional.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
              <input
                type="email"
                placeholder="Tu correo electrónico"
                className="flex-1 px-4 py-3 rounded-lg text-[#051D67] placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#FCFDFD]"
              />
              <button className="px-8 py-3 bg-[#FCFDFD] hover:bg-gray-100 text-[#051D67] rounded-lg font-semibold transition-all duration-300 transform hover:scale-105">
                Suscribirse
              </button>
            </div>

            <p className="text-sm opacity-80 mt-4">
              No spam, solo contenido valioso para tu negocio.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
