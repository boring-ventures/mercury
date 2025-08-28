import React from "react";
import {
  Globe,
  MapPin,
  Phone,
  MessageCircle,
  Mail,
  ArrowRight,
} from "lucide-react";

export default function Footer() {
  const contactInfo = {
    address: "Av. Principal, Zona Central, La Paz - Bolivia",
    phone: "+591 2 XXX-XXXX",
    whatsapp: "+591 7XXXX-XXXX",
    email: "contacto@nordex.bo",
  };

  return (
    <footer id="contacto" className="bg-[#051D67] text-white py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 font-['Helvetica']">
            Contacto
          </h2>
          <p className="text-xl text-white/80 max-w-4xl mx-auto font-['Helvetica']">
            Ponte en contacto con nosotros para comenzar tu proceso de
            internacionalización
          </p>
        </div>

        {/* Contact Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 mb-16">
          {/* Company Info */}
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-3 mb-6">
              <Globe className="h-8 w-8 text-[#81D843]" />
              <span className="text-2xl font-bold font-['Helvetica']">
                NORDEX Global
              </span>
            </div>
            <p className="text-white/80 mb-8 leading-relaxed font-['Helvetica'] max-w-2xl">
              Especialistas en internacionalización empresarial, facilitando
              operaciones internacionales y comercialización global para
              empresas bolivianas.
            </p>

            {/* Contact Details */}
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <MapPin className="w-5 h-5 text-[#81D843] flex-shrink-0" />
                <span className="text-white/80 font-['Helvetica']">
                  {contactInfo.address}
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-[#81D843] flex-shrink-0" />
                <span className="text-white/80 font-['Helvetica']">
                  {contactInfo.phone}
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <MessageCircle className="w-5 h-5 text-[#81D843] flex-shrink-0" />
                <span className="text-white/80 font-['Helvetica']">
                  WhatsApp: {contactInfo.whatsapp}
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-[#81D843] flex-shrink-0" />
                <span className="text-white/80 font-['Helvetica']">
                  {contactInfo.email}
                </span>
              </div>
            </div>
          </div>

          {/* Quick Contact Form */}
          <div className="bg-white/5 p-8 rounded-lg border border-white/10">
            <h3 className="text-xl font-semibold mb-6 font-['Helvetica']">
              Envíanos un mensaje
            </h3>
            <form className="space-y-4">
              <input
                type="text"
                placeholder="Nombre completo"
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/60 focus:outline-none focus:border-[#81D843] font-['Helvetica']"
              />
              <input
                type="email"
                placeholder="Correo electrónico"
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/60 focus:outline-none focus:border-[#81D843] font-['Helvetica']"
              />
              <textarea
                placeholder="Mensaje"
                rows={4}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/60 focus:outline-none focus:border-[#81D843] font-['Helvetica'] resize-none"
              ></textarea>
              <button
                type="submit"
                className="w-full px-6 py-3 bg-[#81D843] hover:bg-[#6BC035] text-[#051D67] rounded-lg font-semibold transition-all duration-300 font-['Helvetica']"
              >
                Enviar Mensaje
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="border-t border-white/20 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-white/60 font-['Helvetica']">
              © 2025 NORDEX Global. Todos los derechos reservados.
            </div>
            <div className="flex items-center space-x-6">
              <a
                href="#"
                className="text-white/60 hover:text-white transition-colors font-['Helvetica']"
              >
                Términos y Condiciones
              </a>
              <a
                href="#"
                className="text-white/60 hover:text-white transition-colors font-['Helvetica']"
              >
                Política de Privacidad
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
