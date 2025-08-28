import NordexHeader from "@/components/views/landing-page/nordex-header";
import NordexFooterSection from "@/components/views/landing-page/nordex-footer-section";

export default function ServiciosPage() {
  return (
    <div className="bg-[#F2EFE9] min-h-screen">
      <NordexHeader />
      
      <main className="pt-20 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold text-[#1F1915] mb-6">
              Nuestros Servicios
            </h1>
            <p className="text-lg text-[#6B6B6B] max-w-3xl mx-auto">
              Ofrecemos soluciones integrales para la gestión de envíos internacionales, 
              simplificando cada paso del proceso de importación para tu empresa.
            </p>
          </div>

          {/* Services Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {/* Service 1 */}
            <div className="bg-white rounded-lg p-8 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-[#051D67] rounded-lg flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-[#1F1915] mb-4">
                Gestión de Importaciones
              </h3>
              <p className="text-[#6B6B6B] mb-4">
                Administramos todo el proceso de importación desde el país de origen hasta tu almacén, 
                incluyendo documentación, aduanas y logística.
              </p>
              <ul className="text-sm text-[#6B6B6B] space-y-2">
                <li>• Tramitación aduanera completa</li>
                <li>• Seguimiento en tiempo real</li>
                <li>• Documentación especializada</li>
              </ul>
            </div>

            {/* Service 2 */}
            <div className="bg-white rounded-lg p-8 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-[#051D67] rounded-lg flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-[#1F1915] mb-4">
                Asesoramiento Comercial
              </h3>
              <p className="text-[#6B6B6B] mb-4">
                Brindamos consultoría especializada para optimizar tus operaciones de comercio internacional 
                y maximizar la eficiencia de tus importaciones.
              </p>
              <ul className="text-sm text-[#6B6B6B] space-y-2">
                <li>• Análisis de mercado</li>
                <li>• Optimización de costos</li>
                <li>• Estrategias comerciales</li>
              </ul>
            </div>

            {/* Service 3 */}
            <div className="bg-white rounded-lg p-8 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-[#051D67] rounded-lg flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-[#1F1915] mb-4">
                Plataforma Digital
              </h3>
              <p className="text-[#6B6B6B] mb-4">
                Accede a nuestra plataforma digital que centraliza la gestión de cotizaciones, 
                contratos y seguimiento de envíos en un solo lugar.
              </p>
              <ul className="text-sm text-[#6B6B6B] space-y-2">
                <li>• Panel de control intuitivo</li>
                <li>• Gestión de documentos</li>
                <li>• Notificaciones automáticas</li>
              </ul>
            </div>

            {/* Service 4 */}
            <div className="bg-white rounded-lg p-8 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-[#051D67] rounded-lg flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-[#1F1915] mb-4">
                Financiamiento y Pagos
              </h3>
              <p className="text-[#6B6B6B] mb-4">
                Facilitamos soluciones de financiamiento y gestión de pagos internacionales 
                para hacer más fluidas tus operaciones comerciales.
              </p>
              <ul className="text-sm text-[#6B6B6B] space-y-2">
                <li>• Gestión de pagos seguros</li>
                <li>• Opciones de financiamiento</li>
                <li>• Múltiples métodos de pago</li>
              </ul>
            </div>

            {/* Service 5 */}
            <div className="bg-white rounded-lg p-8 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-[#051D67] rounded-lg flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-[#1F1915] mb-4">
                Logística y Distribución
              </h3>
              <p className="text-[#6B6B6B] mb-4">
                Coordinamos la logística completa desde el puerto de entrada hasta el destino final, 
                asegurando la entrega oportuna y en perfectas condiciones.
              </p>
              <ul className="text-sm text-[#6B6B6B] space-y-2">
                <li>• Transporte terrestre y marítimo</li>
                <li>• Almacenaje temporal</li>
                <li>• Distribución nacional</li>
              </ul>
            </div>

            {/* Service 6 */}
            <div className="bg-white rounded-lg p-8 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-[#051D67] rounded-lg flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-[#1F1915] mb-4">
                Soporte 24/7
              </h3>
              <p className="text-[#6B6B6B] mb-4">
                Nuestro equipo especializado está disponible las 24 horas para resolver cualquier 
                consulta o emergencia relacionada con tus envíos.
              </p>
              <ul className="text-sm text-[#6B6B6B] space-y-2">
                <li>• Atención personalizada</li>
                <li>• Resolución de incidencias</li>
                <li>• Comunicación constante</li>
              </ul>
            </div>
          </div>

          {/* CTA Section */}
          <div className="text-center bg-white rounded-lg p-12 shadow-sm border border-gray-200">
            <h2 className="text-3xl font-bold text-[#1F1915] mb-4">
              ¿Listo para optimizar tus importaciones?
            </h2>
            <p className="text-lg text-[#6B6B6B] mb-8 max-w-2xl mx-auto">
              Contacta con nuestro equipo para una consulta personalizada y descubre cómo 
              podemos hacer más eficiente tu proceso de importación.
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