import React from "react";
import {
  Monitor,
  Users,
  Globe,
  Shield,
  Settings,
  MessageSquare,
} from "lucide-react";

export default function NordexCharacteristicsSection() {
  const characteristics = [
    {
      icon: Monitor,
      title: "Tecnología Avanzada",
      description:
        "Utilizamos plataformas tecnológicas de vanguardia que nos permiten procesar operaciones de manera eficiente y segura, manteniéndonos a la forefront de la innovación en servicios comerciales.",
    },
    {
      icon: Users,
      title: "Equipo Especializado",
      description:
        "Profesionales con amplia experiencia en comercio internacional, regulaciones financieras y mercados globales, capacitados para manejar operaciones de cualquier complejidad.",
    },
    {
      icon: Globe,
      title: "Red Global de Contactos",
      description:
        "Alianzas estratégicas con instituciones financieras y socios comerciales en múltiples países que nos permiten ofrecer soluciones integrales a nivel mundial.",
    },
    {
      icon: Shield,
      title: "Cumplimiento Normativo",
      description:
        "Adherencia estricta a todas las regulaciones locales e internacionales, garantizando que tus operaciones cumplan con todos los requisitos legales y normativos.",
    },
    {
      icon: Settings,
      title: "Flexibilidad de Servicios",
      description:
        "Adaptamos nuestros servicios a las necesidades específicas de cada cliente, desde operaciones puntuales hasta programas de facilitación comercial de largo plazo.",
    },
    {
      icon: MessageSquare,
      title: "Comunicación Proactiva",
      description:
        "Mantenemos comunicación constante y proactiva durante todo el proceso, proporcionando actualizaciones regulares y disponibilidad inmediata para consultas.",
    },
  ];

  return (
    <section className="bg-white py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-black mb-6">
            Lo que nos hace únicos en el mercado
          </h2>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto">
            Características distintivas que posicionan a NORDEX como líder en
            facilitación comercial internacional en Bolivia.
          </p>
        </div>

        {/* Characteristics Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8 mb-16">
          {characteristics.map((characteristic, index) => {
            const IconComponent = characteristic.icon;
            return (
              <div key={index} className="group">
                <div className="bg-gray-50 rounded-xl p-8 h-full hover:shadow-lg transition-all duration-300 hover:scale-105">
                  <div className="mb-6">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-[#051D67] to-black rounded-full mb-4 shadow-lg">
                      <IconComponent className="w-8 h-8 text-white" />
                    </div>
                  </div>

                  <h3 className="text-2xl font-bold text-black mb-4 group-hover:text-[#051D67] transition-colors">
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

        {/* Additional Value Props */}
        <div className="bg-gradient-to-r from-[#051D67] to-black rounded-2xl p-12 text-white text-center">
          <h3 className="text-3xl font-bold mb-6">
            La combinación perfecta de experiencia, tecnología y compromiso
          </h3>
          <p className="text-xl text-gray-200 mb-8 max-w-4xl mx-auto">
            Estas características únicas nos permiten ofrecer un servicio
            integral que transforma la manera en que las empresas bolivianas
            participan en el comercio internacional.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">+50</div>
              <div className="text-gray-200">Países conectados</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">24/7</div>
              <div className="text-gray-200">Soporte disponible</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">99.8%</div>
              <div className="text-gray-200">Tasa de éxito</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
