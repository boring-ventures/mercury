"use client";

import { Button } from "@/components/ui/button";

export default function NordexAboutSection() {
  const stats = [
    { number: "10+", label: "Años de experiencia", icon: "📅" },
    { number: "150+", label: "Empresas conectadas", icon: "🏢" },
    { number: "45+", label: "Países alcanzados", icon: "🌍" },
    { number: "$50M+", label: "En transacciones gestionadas", icon: "💰" }
  ];

  const values = [
    {
      title: "Excelencia",
      description: "Nos comprometemos a brindar servicios de la más alta calidad, superando las expectativas de nuestros clientes.",
      icon: "⭐"
    },
    {
      title: "Confianza",
      description: "Construimos relaciones duraderas basadas en la transparencia, honestidad y cumplimiento de compromisos.",
      icon: "🤝"
    },
    {
      title: "Innovación",
      description: "Aplicamos tecnología y metodologías avanzadas para optimizar procesos y generar valor agregado.",
      icon: "🚀"
    },
    {
      title: "Compromiso",
      description: "Nos dedicamos completamente al éxito de nuestros clientes, trabajando como verdaderos socios estratégicos.",
      icon: "💪"
    }
  ];

  return (
    <section id="quienes-somos" className="bg-[#F2EFE9] py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center mb-20">
          <div className="space-y-8">
            <div className="space-y-6">
              <h2 className="text-[#1F1915] font-serif text-3xl md:text-4xl lg:text-5xl font-bold leading-tight">
                Quiénes somos
              </h2>
              <div className="space-y-4">
                <p className="text-[#1F1915] font-serif text-lg md:text-xl font-semibold">
                  Somos el puente que conecta Bolivia con el mundo
                </p>
                <p className="text-[#1F1915A3] text-sm md:text-base leading-relaxed">
                  NORDEX nació con la visión de transformar el panorama del comercio internacional en Bolivia. 
                  Fundada por un equipo de expertos con más de una década de experiencia en comercio exterior, 
                  nos especializamos en eliminar las barreras que limitan el crecimiento global de las empresas bolivianas.
                </p>
                <p className="text-[#1F1915A3] text-sm md:text-base leading-relaxed">
                  Nuestra misión es simple pero poderosa: facilitar, internacionalizar y escalar negocios. 
                  A través de nuestros servicios integrales, hemos ayudado a más de 150 empresas a expandirse 
                  exitosamente a 45 países, gestionando transacciones por más de $50 millones de dólares.
                </p>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                size="lg"
                className="bg-[#051D67] hover:bg-[#041655] text-white px-8 py-3 rounded-md font-medium transition-all duration-200"
              >
                Conoce nuestro equipo
              </Button>
              <Button 
                variant="outline"
                size="lg"
                className="border-[#051D67] text-[#051D67] hover:bg-[#051D67] hover:text-white px-8 py-3 rounded-md font-medium transition-all duration-200"
              >
                Ver certificaciones
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {stats.map((stat, index) => (
              <div 
                key={index}
                className="bg-white rounded-2xl p-6 text-center shadow-lg hover:shadow-xl transition-shadow duration-300 group"
              >
                <div className="text-3xl mb-3 group-hover:scale-110 transition-transform duration-300">
                  {stat.icon}
                </div>
                <div className="text-2xl md:text-3xl font-bold text-[#051D67] mb-2">
                  {stat.number}
                </div>
                <div className="text-[#1F1915A3] text-sm font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-12">
          <div className="text-center">
            <h3 className="text-[#1F1915] font-serif text-2xl md:text-3xl font-bold mb-4">
              Nuestros valores
            </h3>
            <p className="text-[#1F1915A3] text-sm md:text-base max-w-2xl mx-auto">
              Los principios que guían cada una de nuestras acciones y decisiones empresariales
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <div 
                key={index}
                className="bg-white rounded-2xl p-6 text-center hover:shadow-lg transition-all duration-300 group border border-gray-100"
              >
                <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
                  {value.icon}
                </div>
                <h4 className="text-[#1F1915] font-serif text-lg font-bold mb-3">
                  {value.title}
                </h4>
                <p className="text-[#1F1915A3] text-sm leading-relaxed">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-16 bg-gradient-to-r from-[#051D67] to-[#041655] rounded-2xl p-8 text-white text-center">
          <h3 className="font-serif text-2xl md:text-3xl font-bold mb-4">
            Tu éxito internacional es nuestro compromiso
          </h3>
          <p className="text-white/90 text-sm md:text-base mb-6 max-w-2xl mx-auto">
            Contamos con un equipo multidisciplinario de profesionales especializados en comercio internacional, 
            finanzas, logística y desarrollo de mercados.
          </p>
          <Button 
            size="lg"
            className="bg-[#81D843] hover:bg-[#6BC536] text-[#051D67] px-8 py-3 rounded-md font-medium transition-all duration-200"
          >
            Agenda una reunión
          </Button>
        </div>
      </div>
    </section>
  );
}