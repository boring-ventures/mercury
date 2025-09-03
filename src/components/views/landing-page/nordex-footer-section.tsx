"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Facebook,
  Instagram,
  MessageCircle,
} from "lucide-react";
import FooterGridBackground from "@/components/ui/footer-grid-background";
import { motion } from "framer-motion";
import { fadeInUp, fadeInLeft, fadeInRight, staggerContainer } from "@/lib/animations";

export default function NordexFooterSection() {
  const navigationLinks = [
    { name: "Inicio", href: "#" },
    { name: "Servicios", href: "#servicios" },
    { name: "Quienes Somos", href: "#quienes-somos" },
    { name: "Noticias", href: "#noticias" },
  ];

  const socialLinks = [
    { name: "Facebook", href: "#", icon: Facebook },
    { name: "Instagram", href: "#", icon: Instagram },
    { name: "WhatsApp", href: "#", icon: MessageCircle },
  ];

  return (
    <footer className="bg-[#051D67] text-white relative overflow-hidden">
      <FooterGridBackground />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div 
          className="py-16 grid lg:grid-cols-3 gap-12"
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, amount: 0.3 }}
        >
          {/* Primera columna - Información de NORDEX */}
          <motion.div 
            className="flex flex-col space-y-6"
            {...fadeInLeft}
          >
            <div className="flex flex-col space-y-4">
              <img
                src="/logos/logo Nordex_Mesa de trabajo 1 copia 2 (1).png"
                alt="NORDEX Logo"
                className="h-6 w-40"
              />
            </div>
            <p className="text-white/80 text-sm leading-relaxed max-w-xs font-serif">
              Conectamos Bolivia con el mundo. Empresa líder en facilitación
              comercial internacional.
            </p>
          </motion.div>

          {/* Segunda columna - Navegación */}
          <motion.div 
            className="space-y-6"
            {...fadeInUp}
            transition={{ ...fadeInUp.transition, delay: 0.2 }}
          >
            <h4 className="text-white font-semibold text-lg font-sans">
              Navegación
            </h4>
            <ul className="space-y-3">
              {navigationLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-white/80 hover:text-[#81D843] text-sm transition-colors duration-200 block py-1 font-serif"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Tercera columna - Contacto y Redes Sociales */}
          <motion.div 
            className="space-y-6"
            {...fadeInRight}
            transition={{ ...fadeInRight.transition, delay: 0.4 }}
          >
            <div className="space-y-4">
              <h4 className="text-white font-semibold text-lg font-sans">
                Contacto
              </h4>
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <MapPin className="w-4 h-4 text-white mt-1 flex-shrink-0" />
                  <span className="text-white/80 text-sm font-serif">
                    Av. San Martin, calle J, Manzana 40, Plaza Empresarial, Santa Cruz - Bolivia
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <Phone className="w-4 h-4 text-white flex-shrink-0" />
                  <span className="text-white/80 text-sm font-serif">
                    +591 77828618
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <Mail className="w-4 h-4 text-white flex-shrink-0" />
                  <span className="text-white/80 text-sm font-serif">
                    info@nordexbo.com
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <Clock className="w-4 h-4 text-white flex-shrink-0" />
                  <span className="text-white/80 text-sm font-serif">
                    Lun - Vie: 8:00 AM - 6:00 PM
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-white font-semibold text-lg font-sans">
                Redes Sociales
              </h4>
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
                      className: "text-white",
                    })}
                  </Link>
                ))}
              </div>
            </div>
          </motion.div>
        </motion.div>

        <motion.div 
          className="py-8 border-t border-white/20"
          {...fadeInUp}
          transition={{ ...fadeInUp.transition, delay: 0.6 }}
        >
          <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
            <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-6 text-sm text-white/80">
              <span className="font-serif">
                © 2024 NORDEX. Todos los derechos reservados.
              </span>
              <div className="flex items-center space-x-4">
                <Link
                  href="#"
                  className="hover:text-[#81D843] transition-colors duration-200 font-serif"
                >
                  Términos
                </Link>
                <Link
                  href="#"
                  className="hover:text-[#81D843] transition-colors duration-200 font-serif"
                >
                  Privacidad
                </Link>
                <Link
                  href="#"
                  className="hover:text-[#81D843] transition-colors duration-200 font-serif"
                >
                  Cookies
                </Link>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <span className="text-white/60 text-sm font-serif">
                Hecho con
              </span>
              <span className="text-[#81D843] text-lg">💚</span>
              <span className="text-white/60 text-sm font-serif">
                en Bolivia
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </footer>
  );
}
