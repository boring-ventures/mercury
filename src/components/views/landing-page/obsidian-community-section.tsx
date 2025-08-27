import React from "react";
import {
<<<<<<< HEAD
  Shield,
=======
  MessageCircle,
  Star,
  Building,
>>>>>>> 4bcdf987d50ed381ca33f2f6a2e4356a3502b30f
  Users,
  Globe,
  Clock,
  CheckCircle,
  TrendingUp,
} from "lucide-react";

export default function NordexCharacteristicsSection() {
  const characteristics = [
    {
      icon: Shield,
      title: "Cumplimiento Normativo ASFI",
      description:
        "Adherencia estricta a todas las regulaciones locales e internacionales, garantizando que tus operaciones cumplan con todos los requisitos legales y normativos.",
      color: "from-[#051D67] to-[#81D843]",
    },
    {
      icon: Users,
      title: "Equipo Especializado",
      description:
        "Profesionales con amplia experiencia en comercio internacional, regulaciones financieras y mercados globales, capacitados para manejar operaciones de cualquier complejidad.",
      color: "from-[#81D843] to-[#051D67]",
    },
    {
      icon: Globe,
      title: "Red Global de Contactos",
      description:
        "Alianzas estratégicas con instituciones financieras y socios comerciales en múltiples países que nos permiten ofrecer soluciones integrales a nivel mundial.",
      color: "from-[#051D67] to-[#81D843]",
    },
    {
      icon: Clock,
      title: "Velocidad de Ejecución",
      description:
        "Procesamos tus operaciones en tiempo récord manteniendo los más altos estándares de seguridad y cumplimiento normativo.",
      color: "from-[#81D843] to-[#051D67]",
    },
    {
      icon: CheckCircle,
      title: "Transparencia Total",
      description:
        "Acceso en tiempo real al estado de tus operaciones con reportes detallados y comunicación constante sobre el progreso.",
      color: "from-[#051D67] to-[#81D843]",
    },
    {
      icon: TrendingUp,
      title: "Escalabilidad",
      description:
        "Nuestra infraestructura se adapta al crecimiento de tu empresa, desde operaciones pequeñas hasta grandes volúmenes comerciales.",
      color: "from-[#81D843] to-[#051D67]",
    },
  ];

  return (
    <section className="bg-[#FCFDFD] py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-[#051D67] mb-6">
            Lo que nos hace únicos en el mercado
          </h2>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto">
            Características distintivas que posicionan a NORDEX Global como
            líder en facilitación comercial internacional en Bolivia.
          </p>
        </div>

        {/* Characteristics Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8 mb-16">
          {characteristics.map((characteristic, index) => {
            const IconComponent = characteristic.icon;
            return (
              <div key={index} className="group">
                <div className="bg-white rounded-2xl p-8 h-full hover:shadow-xl transition-all duration-300 hover:scale-105 border border-gray-100">
                  <div className="mb-6">
                    <div
                      className={`inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r ${characteristic.color} mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300`}
                    >
                      <IconComponent className="w-8 h-8 text-[#FCFDFD]" />
                    </div>
                  </div>

                  <h3 className="text-2xl font-bold text-[#051D67] mb-4 group-hover:text-[#81D843] transition-colors">
                    {characteristic.title}
                  </h3>

                  <p className="text-gray-600 text-base leading-relaxed">
                    {characteristic.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Value Proposition */}
        <div className="bg-gradient-to-r from-[#051D67] to-[#81D843] rounded-2xl p-12 text-[#FCFDFD] text-center">
          <h3 className="text-3xl font-bold mb-6">
            La combinación perfecta de experiencia, tecnología y compromiso
          </h3>
          <p className="text-xl opacity-90 mb-8 max-w-4xl mx-auto">
            Estas características únicas nos permiten ofrecer un servicio
            integral que transforma la manera en que las empresas bolivianas
            participan en el comercio internacional.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
<<<<<<< HEAD
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">+50</div>
              <div className="text-[#FCFDFD] opacity-90">Países conectados</div>
=======
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="bg-white/10 backdrop-blur-sm rounded-xl p-8 hover:bg-white/20 transition-all duration-300 transform hover:scale-105 border border-white/20"
              >
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-5 h-5 text-yellow-400 fill-current"
                    />
                  ))}
                </div>

                <blockquote className="text-gray-200 leading-relaxed mb-6 italic">
                  &ldquo;{testimonial.quote}&rdquo;
                </blockquote>

                <div className="border-t border-white/20 pt-4">
                  <div className="font-semibold text-white">
                    {testimonial.author}
                  </div>
                  <div className="text-sm text-gray-300">
                    {testimonial.position}
                  </div>
                  <div className="text-sm text-gray-400">
                    {testimonial.company}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Contact Information */}
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-12 border border-white/20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-3xl font-bold text-white mb-6">
                ¿Listo para transformar tu comercio internacional?
              </h3>
              <p className="text-xl text-gray-300 mb-8">
                Únete a más de 150 empresas bolivianas que ya confían en NORDEX
                para sus operaciones internacionales.
              </p>

              <a
                href="#contacto"
                className="inline-flex items-center justify-center px-8 py-4 bg-white hover:bg-gray-100 text-[#051D67] rounded-lg text-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                <MessageCircle className="w-6 h-6 mr-3" />
                Solicitar Consultoría Gratuita
              </a>
>>>>>>> 4bcdf987d50ed381ca33f2f6a2e4356a3502b30f
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">24/7</div>
              <div className="text-[#FCFDFD] opacity-90">
                Soporte disponible
              </div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">99.8%</div>
              <div className="text-[#FCFDFD] opacity-90">Tasa de éxito</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
