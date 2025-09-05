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
    address:
      "Av. San Martin, calle J, Manzana 40, Plaza Empresarial, Santa Cruz - Bolivia",
    phone: "+591 77828618",
    whatsapp: "+591 77828618",
    email: "info@nordexbo.com",
  };

  return (
    <footer id="contacto" className="bg-[#051D67] text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 font-sans">
            Contacto
          </h2>
          <p className="text-xl text-white/80 max-w-4xl mx-auto font-serif">
            Ponte en contacto con nosotros para comenzar tu proceso de
            internacionalización
          </p>
        </div>

        {/* Contact Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="lg:col-span-1">
            <div className="flex items-center space-x-3 mb-6">
              <Globe className="h-6 w-6 text-[#81D843]" />
              <span className="text-xl font-bold font-sans">NORDEX Global</span>
            </div>
            <p className="text-white/80 mb-6 leading-relaxed font-serif">
              Especialistas en internacionalización empresarial.
            </p>

          </div>

          {/* Contact Details */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold mb-4 font-sans">Contacto</h3>
            <div className="flex items-center space-x-3">
              <MapPin className="w-4 h-4 text-[#81D843] flex-shrink-0" />
              <span className="text-white/80 font-serif text-sm">
                {contactInfo.address}
              </span>
            </div>
            <div className="flex items-center space-x-3">
              <Phone className="w-4 h-4 text-[#81D843] flex-shrink-0" />
              <span className="text-white/80 font-serif text-sm">
                {contactInfo.phone}
              </span>
            </div>
            <div className="flex items-center space-x-3">
              <MessageCircle className="w-4 h-4 text-[#81D843] flex-shrink-0" />
              <span className="text-white/80 font-serif text-sm">
                WhatsApp: {contactInfo.whatsapp}
              </span>
            </div>
            <div className="flex items-center space-x-3">
              <Mail className="w-4 h-4 text-[#81D843] flex-shrink-0" />
              <span className="text-white/80 font-serif text-sm">
                {contactInfo.email}
              </span>
            </div>
          </div>

          {/* Social Media */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold mb-4 font-sans">Síguenos</h3>
            <div className="flex flex-col space-y-3">
              <a href="#" className="flex items-center space-x-3 text-white/80 hover:text-white transition-colors">
                <div className="w-8 h-8 bg-[#81D843] rounded-full flex items-center justify-center">
                  <span className="text-[#051D67] font-bold text-sm">f</span>
                </div>
                <span className="font-serif text-sm">Facebook</span>
              </a>
              <a href="#" className="flex items-center space-x-3 text-white/80 hover:text-white transition-colors">
                <div className="w-8 h-8 bg-[#81D843] rounded-full flex items-center justify-center">
                  <span className="text-[#051D67] font-bold text-sm">in</span>
                </div>
                <span className="font-serif text-sm">LinkedIn</span>
              </a>
              <a href="#" className="flex items-center space-x-3 text-white/80 hover:text-white transition-colors">
                <div className="w-8 h-8 bg-[#81D843] rounded-full flex items-center justify-center">
                  <span className="text-[#051D67] font-bold text-sm">@</span>
                </div>
                <span className="font-serif text-sm">Instagram</span>
              </a>
            </div>
          </div>

          {/* Quick Contact Form */}
          <div className="bg-white/5 p-6 rounded-lg border border-white/10">
            <h3 className="text-lg font-semibold mb-4 font-sans">
              Envíanos un mensaje
            </h3>
            <form className="space-y-3">
              <input
                type="text"
                placeholder="Nombre completo"
                className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/60 focus:outline-none focus:border-[#81D843] font-serif text-sm"
              />
              <input
                type="email"
                placeholder="Correo electrónico"
                className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/60 focus:outline-none focus:border-[#81D843] font-serif text-sm"
              />
              <textarea
                placeholder="Mensaje"
                rows={3}
                className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/60 focus:outline-none focus:border-[#81D843] font-serif resize-none text-sm"
              ></textarea>
              <button
                type="submit"
                className="w-full px-4 py-2 bg-[#81D843] hover:bg-[#6BC035] text-[#051D67] rounded-lg font-semibold transition-all duration-300 font-sans text-sm"
              >
                Enviar Mensaje
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="border-t border-white/20 pt-6 mt-8">
          <div className="text-center">
            <div className="text-white/60 font-serif text-sm">
              © 2025 NORDEX Global. Todos los derechos reservados.
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
