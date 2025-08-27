import React from "react";
import {
  Globe,
  Phone,
  Mail,
  MapPin,
  MessageCircle,
  ArrowRight,
} from "lucide-react";

export default function NordexFooterSection() {
  const footerLinks = {
    servicios: [
      "Intermediación Comercial",
      "Gestión de Pagos",
      "Comercio Exterior",
      "Consultoría",
    ],
    recursos: ["Blog", "Guías", "Casos de Éxito", "Eventos"],
    empresa: [
      "Quienes Somos",
      "Nuestro Equipo",
      "Contacto",
      "Trabaja con Nosotros",
    ],
    legal: [
      "Términos y Condiciones",
      "Política de Privacidad",
      "Política de Cookies",
      "Aviso Legal",
    ],
  };

  const contactInfo = {
    address: "Av. Principal, Zona Central, La Paz - Bolivia",
    phone: "+591 2 XXX-XXXX",
    whatsapp: "+591 7XXXX-XXXX",
    email: "contacto@nordex.bo",
  };

  return (
    <footer className="bg-[#051D67] text-[#FCFDFD]">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Company Info */}
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-2 mb-6">
              <Globe className="h-8 w-8 text-[#81D843]" />
              <span className="text-2xl font-bold">NORDEX Global</span>
            </div>
            <p className="text-[#FCFDFD] opacity-90 mb-6 leading-relaxed">
              Especialistas en internacionalización empresarial, facilitando
              operaciones internacionales y comercialización global para
              empresas bolivianas.
            </p>

            {/* Contact Info */}
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <MapPin className="w-5 h-5 text-[#81D843] flex-shrink-0" />
                <span className="text-sm opacity-90">
                  {contactInfo.address}
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-[#81D843] flex-shrink-0" />
                <span className="text-sm opacity-90">{contactInfo.phone}</span>
              </div>
              <div className="flex items-center space-x-3">
                <MessageCircle className="w-5 h-5 text-[#81D843] flex-shrink-0" />
                <span className="text-sm opacity-90">
                  WhatsApp: {contactInfo.whatsapp}
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-[#81D843] flex-shrink-0" />
                <span className="text-sm opacity-90">{contactInfo.email}</span>
              </div>
            </div>
          </div>

          {/* Services Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Servicios</h4>
            <ul className="space-y-2">
              {footerLinks.servicios.map((link, index) => (
                <li key={index}>
                  <a
                    href="#"
                    className="text-sm opacity-80 hover:opacity-100 hover:text-[#81D843] transition-all duration-300"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Recursos</h4>
            <ul className="space-y-2">
              {footerLinks.recursos.map((link, index) => (
                <li key={index}>
                  <a
                    href="#"
                    className="text-sm opacity-80 hover:opacity-100 hover:text-[#81D843] transition-all duration-300"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Empresa</h4>
            <ul className="space-y-2">
              {footerLinks.empresa.map((link, index) => (
                <li key={index}>
                  <a
                    href="#"
                    className="text-sm opacity-80 hover:opacity-100 hover:text-[#81D843] transition-all duration-300"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Newsletter Signup */}
        <div className="mt-12 pt-8 border-t border-[#81D843]/20">
          <div className="max-w-2xl mx-auto text-center">
            <h4 className="text-xl font-semibold mb-4">
              Suscríbete a nuestro boletín
            </h4>
            <p className="text-sm opacity-80 mb-6">
              Recibe las últimas noticias y oportunidades de comercio
              internacional
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center max-w-md mx-auto">
              <input
                type="email"
                placeholder="Tu correo electrónico"
                className="flex-1 px-4 py-2 rounded-lg text-[#051D67] placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#81D843]"
              />
              <button className="px-6 py-2 bg-[#81D843] hover:bg-[#6BC035] text-[#051D67] rounded-lg font-semibold transition-all duration-300 transform hover:scale-105">
                Suscribirse
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="bg-[#051D67]/80 border-t border-[#81D843]/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex items-center space-x-6">
              <span className="text-sm opacity-80">
                © 2025 NORDEX Global. Todos los derechos reservados.
              </span>
            </div>

            <div className="flex items-center space-x-6">
              {footerLinks.legal.map((link, index) => (
                <a
                  key={index}
                  href="#"
                  className="text-sm opacity-80 hover:opacity-100 hover:text-[#81D843] transition-all duration-300"
                >
                  {link}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-[#81D843] to-[#051D67] py-12">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h3 className="text-2xl font-bold text-[#FCFDFD] mb-4">
            ¿Listo para internacionalizar tu empresa?
          </h3>
          <p className="text-lg opacity-90 mb-6">
            Únete a más de 150 empresas bolivianas que ya confían en NORDEX
            Global
          </p>
          <a
            href="#contacto"
            className="inline-flex items-center justify-center px-8 py-3 bg-[#FCFDFD] hover:bg-gray-100 text-[#051D67] rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg"
          >
            Comenzar Ahora
            <ArrowRight className="w-5 h-5 ml-2" />
          </a>
        </div>
      </div>
    </footer>
  );
}
