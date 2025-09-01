"use client";

import { useState } from "react";
import NordexHeader from "@/components/views/landing-page/nordex-header";
import NordexFooterSection from "@/components/views/landing-page/nordex-footer-section";
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
      <NordexHeader />

      <main className="pt-20 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold text-[#1F1915] mb-6">
              Nuestros Servicios
            </h1>
            <p className="text-lg text-[#6B6B6B] max-w-3xl mx-auto">
              Ofrecemos soluciones integrales para la gestión de envíos
              internacionales, simplificando cada paso del proceso de
              importación para tu empresa.
            </p>
          </div>

          {/* Services Tabs */}
          <div className="mb-12">
            <div className="flex flex-wrap justify-center gap-8 mb-12">
              {services.map((service) => {
                const IconComponent = service.icon;
                return (
                  <button
                    key={service.id}
                    onClick={() => setActiveTab(service.id)}
                    className={`flex flex-col items-center gap-3 transition-all duration-200 ${
                      activeTab === service.id
                        ? "text-[#81D843]"
                        : "text-[#6B6B6B] hover:text-[#1F1915]"
                    }`}
                  >
                    <IconComponent className="w-6 h-6" />
                    <div className="text-center">
                      <span className="text-sm font-medium block">
                        {service.title}
                      </span>
                      {activeTab === service.id && (
                        <div className="w-full h-0.5 bg-[#81D843] mt-2"></div>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Active Service Content */}
            {activeService && (
              <div className="bg-white">
                <div className="flex items-start gap-8 mb-8">
                  <div className="w-20 h-20 bg-[#F2EFE9] rounded-lg flex items-center justify-center flex-shrink-0">
                    {(() => {
                      const IconComponent = activeService.icon;
                      return (
                        <IconComponent className="w-10 h-10 text-[#051D67]" />
                      );
                    })()}
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold text-[#1F1915] mb-4">
                      {activeService.title}
                    </h2>
                    <p className="text-lg text-[#6B6B6B] leading-relaxed max-w-3xl">
                      {activeService.description}
                    </p>
                  </div>
                </div>

                {/* Features Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {activeService.features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <div className="w-1.5 h-1.5 bg-[#81D843] rounded-full flex-shrink-0"></div>
                      <span className="text-[#1F1915] text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* CTA Section */}
          <div className="text-center bg-white rounded-lg p-12 shadow-sm border border-gray-200">
            <h2 className="text-3xl font-bold text-[#1F1915] mb-4">
              ¿Listo para optimizar tus importaciones?
            </h2>
            <p className="text-lg text-[#6B6B6B] mb-8 max-w-2xl mx-auto">
              Contacta con nuestro equipo para una consulta personalizada y
              descubre cómo podemos hacer más eficiente tu proceso de
              importación.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-[#051D67] hover:bg-[#041655] text-white px-8 py-3 rounded-md font-medium transition-colors">
                Solicitar Cotización
              </button>
              <button className="border border-[#051D67] text-[#051D67] hover:bg-[#051D67] hover:text-white px-8 py-3 rounded-md font-medium transition-colors">
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
