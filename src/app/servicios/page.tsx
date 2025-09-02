"use client";

import { useState } from "react";
import NordexHeader from "@/components/views/landing-page/nordex-header";
import NordexFooterSection from "@/components/views/landing-page/nordex-footer-section";
import NordexBanner from "@/components/ui/nordex-banner";
import { Badge } from "@/components/ui/badge";
import {
  Package,
  Users,
  Laptop,
  CreditCard,
  Truck,
  Headphones,
} from "lucide-react";

export default function ServiciosPage() {
  const [activeTab, setActiveTab] = useState("importaciones");

  const services = [
    {
      id: "importaciones",
      title: "Gestión de Importaciones",
      icon: Package,
      description:
        "Administramos todo el proceso de importación desde el país de origen hasta tu almacén, incluyendo documentación, aduanas y logística.",
      features: [
        "Tramitación aduanera completa",
        "Seguimiento en tiempo real",
        "Documentación especializada",
        "Gestión de permisos y licencias",
      ],
    },
    {
      id: "asesoramiento",
      title: "Asesoramiento Comercial",
      icon: Users,
      description:
        "Brindamos consultoría especializada para optimizar tus operaciones de comercio internacional y maximizar la eficiencia de tus importaciones.",
      features: [
        "Análisis de mercado",
        "Optimización de costos",
        "Estrategias comerciales",
        "Estudios de viabilidad",
      ],
    },
    {
      id: "plataforma",
      title: "Plataforma Digital",
      icon: Laptop,
      description:
        "Accede a nuestra plataforma digital que centraliza la gestión de cotizaciones, contratos y seguimiento de envíos en un solo lugar.",
      features: [
        "Panel de control intuitivo",
        "Gestión de documentos",
        "Notificaciones automáticas",
        "Reportes en tiempo real",
      ],
    },
    {
      id: "financiamiento",
      title: "Financiamiento y Pagos",
      icon: CreditCard,
      description:
        "Facilitamos soluciones de financiamiento y gestión de pagos internacionales para hacer más fluidas tus operaciones comerciales.",
      features: [
        "Gestión de pagos seguros",
        "Opciones de financiamiento",
        "Múltiples métodos de pago",
        "Asesoría financiera",
      ],
    },
    {
      id: "logistica",
      title: "Logística y Distribución",
      icon: Truck,
      description:
        "Coordinamos la logística completa desde el puerto de entrada hasta el destino final, asegurando la entrega oportuna y en perfectas condiciones.",
      features: [
        "Transporte terrestre y marítimo",
        "Almacenaje temporal",
        "Distribución nacional",
        "Trazabilidad completa",
      ],
    },
    {
      id: "soporte",
      title: "Soporte 24/7",
      icon: Headphones,
      description:
        "Nuestro equipo especializado está disponible las 24 horas para resolver cualquier consulta o emergencia relacionada con tus envíos.",
      features: [
        "Atención personalizada",
        "Resolución de incidencias",
        "Comunicación constante",
        "Soporte técnico especializado",
      ],
    },
  ];

  const activeService = services.find((service) => service.id === activeTab);

  return (
    <div className="bg-white min-h-screen">
      <NordexBanner />
      <NordexHeader />

      <main className="pt-16 pb-8 sm:pt-18 sm:pb-10 lg:pt-20 lg:pb-12 xl:pt-24 xl:pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">
          {/* Hero Section */}
          <div className="flex gap-3 sm:gap-4 py-4 sm:py-6 lg:py-8 flex-col items-start mb-8 sm:mb-10 lg:mb-12">
            <div>
              <Badge className="bg-[#051D67] text-white hover:bg-[#041655] text-xs sm:text-sm">
                Servicios
              </Badge>
            </div>
            <div className="flex gap-2 sm:gap-3 flex-col">
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl tracking-tighter max-w-full lg:max-w-xl xl:max-w-2xl font-regular text-[#262626] font-sans font-bold">
                Nuestros <span className="text-[#051D67]">Servicios</span>
              </h1>
              <p className="text-base sm:text-lg lg:text-xl max-w-full sm:max-w-xl lg:max-w-2xl xl:max-w-3xl leading-relaxed tracking-tight text-[#262626A3] font-serif">
                Ofrecemos soluciones integrales para la gestión de envíos
                internacionales, simplificando cada paso del proceso de
                importación para tu empresa.
              </p>
            </div>
          </div>

          {/* Services Tabs */}
          <div className="mb-8 sm:mb-10 lg:mb-12">
            <div className="flex flex-wrap justify-center gap-4 sm:gap-6 lg:gap-8 mb-8 sm:mb-10 lg:mb-12">
              {services.map((service) => {
                const IconComponent = service.icon;
                return (
                  <button
                    key={service.id}
                    onClick={() => setActiveTab(service.id)}
                    className={`flex flex-col items-center gap-2 sm:gap-3 transition-all duration-200 p-2 sm:p-3 rounded-lg hover:bg-gray-50 ${
                      activeTab === service.id
                        ? "text-[#81D843] bg-gray-50"
                        : "text-[#6B6B6B] hover:text-[#262626]"
                    }`}
                  >
                    <IconComponent className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7" />
                    <div className="text-center">
                      <span className="text-xs sm:text-sm lg:text-base font-medium block">
                        {service.title}
                      </span>
                      {activeTab === service.id && (
                        <div className="w-full h-0.5 bg-[#81D843] mt-1 sm:mt-2"></div>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Active Service Content */}
            {activeService && (
              <div className="bg-white">
                <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-6 lg:gap-8 mb-6 sm:mb-8">
                  <div className="w-16 h-16 sm:w-18 sm:h-18 lg:w-20 lg:h-20 xl:w-24 xl:h-24 bg-[#F2EFE9] rounded-lg flex items-center justify-center flex-shrink-0">
                    {(() => {
                      const IconComponent = activeService.icon;
                      return (
                        <IconComponent className="w-8 h-8 sm:w-9 sm:h-9 lg:w-10 lg:h-10 xl:w-12 xl:h-12 text-[#051D67]" />
                      );
                    })()}
                  </div>
                  <div className="flex-1">
                    <h2 className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-bold font-sans text-[#262626] mb-3 sm:mb-4">
                      {activeService.title}
                    </h2>
                    <p className="text-base sm:text-lg lg:text-xl font-serif text-[#6B6B6B] leading-relaxed max-w-full lg:max-w-3xl xl:max-w-4xl">
                      {activeService.description}
                    </p>
                  </div>
                </div>

                {/* Features Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
                  {activeService.features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-3 sm:gap-4">
                      <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-[#81D843] rounded-full flex-shrink-0"></div>
                      <span className="text-[#262626] font-serif text-sm sm:text-base lg:text-lg">
                        {feature}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* CTA Section */}
          <div className="text-center bg-white rounded-lg p-6 sm:p-8 lg:p-12 shadow-sm border border-gray-200 mt-8 sm:mt-10 lg:mt-12">
            <h2 className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-bold text-[#262626] mb-3 sm:mb-4">
              ¿Listo para optimizar tus importaciones?
            </h2>
            <p className="text-base sm:text-lg lg:text-xl font-serif text-[#6B6B6B] mb-6 sm:mb-8 max-w-full sm:max-w-2xl lg:max-w-3xl mx-auto">
              Contacta con nuestro equipo para una consulta personalizada y
              descubre cómo podemos hacer más eficiente tu proceso de
              importación.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
              <button className="bg-[#051D67] hover:bg-[#041655] text-white px-6 py-3 sm:px-8 sm:py-3 lg:px-10 lg:py-4 text-sm sm:text-base lg:text-lg rounded-md font-medium transition-colors">
                Solicitar Cotización
              </button>
              <button className="border border-[#051D67] text-[#051D67] hover:bg-[#051D67] hover:text-white px-6 py-3 sm:px-8 sm:py-3 lg:px-10 lg:py-4 text-sm sm:text-base lg:text-lg rounded-md font-medium transition-colors">
                Más Información
              </button>
            </div>
          </div>
        </div>
      </main>

      <NordexFooterSection />
    </div>
  );
}
