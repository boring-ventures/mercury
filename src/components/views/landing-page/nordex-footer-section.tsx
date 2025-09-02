"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { MapPin, Phone, Mail, Clock, Facebook, Instagram, MessageCircle } from "lucide-react";
import FooterGridBackground from "@/components/ui/footer-grid-background";

export default function NordexFooterSection() {
  const navigationLinks = [
    { name: "Inicio", href: "#" },
    { name: "Servicios", href: "#servicios" },
    { name: "Quienes Somos", href: "#quienes-somos" },
    { name: "Noticias", href: "#noticias" }
  ];

  const socialLinks = [
    { name: "Facebook", href: "#", icon: Facebook },
    { name: "Instagram", href: "#", icon: Instagram },
    { name: "WhatsApp", href: "#", icon: MessageCircle }
  ];

  return (
    <footer className="bg-[#051D67] text-white relative overflow-hidden">
      <FooterGridBackground />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="py-16 grid lg:grid-cols-3 gap-12">
          {/* Primera columna - Información de NORDEX */}
          <div className="flex flex-col space-y-6">
            <div className="flex flex-col space-y-4">
              <div className="w-16 h-16 bg-white rounded-lg flex items-center justify-center">
                <span className="text-[#051D67] font-bold text-3xl">N</span>
              </div>
              <span className="text-white font-semibold text-2xl font-sans">NORDEX</span>
            </div>
            <p className="text-white/80 text-sm leading-relaxed max-w-xs font-serif">
              Conectamos Bolivia con el mundo. Empresa líder en facilitación 
              comercial internacional.
            </p>
          </div>

          {/* Segunda columna - Navegación */}
          <div className="space-y-6">
            <h4 className="text-white font-semibold text-lg font-sans">Navegación</h4>
            <ul className="space-y-3">
              {navigationLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-white/80 hover:text-[#81D843] text-sm transition-colors duration-200 block py-1 font-serif">
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Tercera columna - Contacto y Redes Sociales */}
          <div className="space-y-6">
            <div className="space-y-4">
              <h4 className="text-white font-semibold text-lg font-sans">Contacto</h4>
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <MapPin className="w-4 h-4 text-white mt-1 flex-shrink-0" />
                  <span className="text-white/80 text-sm font-serif">Av. Arce 2799, Torre Multicentro, Piso 15, La Paz - Bolivia</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Phone className="w-4 h-4 text-white flex-shrink-0" />
                  <span className="text-white/80 text-sm font-serif">+591 2 2441234</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Mail className="w-4 h-4 text-white flex-shrink-0" />
                  <span className="text-white/80 text-sm font-serif">info@nordex.com.bo</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Clock className="w-4 h-4 text-white flex-shrink-0" />
                  <span className="text-white/80 text-sm font-serif">Lun - Vie: 8:00 AM - 6:00 PM</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-white font-semibold text-lg font-sans">Redes Sociales</h4>
              <div className="flex space-x-3">
                {socialLinks.map((social) => (
                  <Link
                    key={social.name}
                    href={social.href}
                    className="w-10 h-10 border border-white/30 rounded-lg flex items-center justify-center hover:border-[#81D843] hover:bg-[#81D843]/10 transition-all duration-200"
                    aria-label={social.name}
                  >
                    {React.createElement(social.icon, {
                      size: 18,
                      className: "text-white"
                    })}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="py-8 border-t border-white/20">
          <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
            <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-6 text-sm text-white/80">
              <span className="font-serif">© 2024 NORDEX. Todos los derechos reservados.</span>
              <div className="flex items-center space-x-4">
                <Link href="#" className="hover:text-[#81D843] transition-colors duration-200 font-serif">
                  Términos
                </Link>
                <Link href="#" className="hover:text-[#81D843] transition-colors duration-200 font-serif">
                  Privacidad
                </Link>
                <Link href="#" className="hover:text-[#81D843] transition-colors duration-200 font-serif">
                  Cookies
                </Link>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <span className="text-white/60 text-sm font-serif">Hecho con</span>
              <span className="text-[#81D843] text-lg">💚</span>
              <span className="text-white/60 text-sm font-serif">en Bolivia</span>
            </div>
          </div>
        </div>
      </div>

    </footer>
  );
}