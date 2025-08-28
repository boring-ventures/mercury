"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NordexFooterSection() {
  const footerSections = [
    {
      title: "Servicios",
      links: [
        { name: "Intermediación comercial", href: "#servicios" },
        { name: "Pagos internacionales", href: "#servicios" },
        { name: "Comercio exterior", href: "#servicios" },
        { name: "Consultoría", href: "#servicios" }
      ]
    },
    {
      title: "Empresa",
      links: [
        { name: "Quiénes somos", href: "#quienes-somos" },
        { name: "Nuestro equipo", href: "#quienes-somos" },
        { name: "Certificaciones", href: "#quienes-somos" },
        { name: "Casos de éxito", href: "#" }
      ]
    },
    {
      title: "Recursos",
      links: [
        { name: "Blog", href: "#noticias" },
        { name: "Guías", href: "#" },
        { name: "Webinars", href: "#" },
        { name: "Centro de ayuda", href: "#" }
      ]
    },
    {
      title: "Legal",
      links: [
        { name: "Términos de servicio", href: "#" },
        { name: "Política de privacidad", href: "#" },
        { name: "Cookies", href: "#" },
        { name: "Cumplimiento", href: "#" }
      ]
    }
  ];

  const socialLinks = [
    { name: "LinkedIn", href: "#", icon: "💼" },
    { name: "Facebook", href: "#", icon: "📘" },
    { name: "Twitter", href: "#", icon: "🐦" },
    { name: "Instagram", href: "#", icon: "📸" }
  ];

  return (
    <footer className="bg-[#051D67] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-16 grid lg:grid-cols-5 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-white rounded-md flex items-center justify-center">
                  <span className="text-[#051D67] font-bold text-xl">N</span>
                </div>
                <span className="text-white font-semibold text-2xl">NORDEX</span>
              </div>
              <p className="text-white/80 text-sm leading-relaxed max-w-md">
                Conectamos Bolivia con el mundo. Somos la empresa líder en facilitación 
                comercial internacional, transformando la manera en que las empresas 
                locales se conectan globalmente.
              </p>
            </div>

            <div className="space-y-4">
              <h4 className="text-white font-semibold text-lg">Contacto</h4>
              <div className="space-y-3 text-sm text-white/80">
                <div className="flex items-center space-x-3">
                  <span className="text-[#81D843]">📍</span>
                  <span>Av. Arce 2799, Torre Multicentro, Piso 15, La Paz - Bolivia</span>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="text-[#81D843]">📞</span>
                  <span>+591 2 2441234</span>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="text-[#81D843]">📧</span>
                  <span>info@nordex.com.bo</span>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="text-[#81D843]">🕐</span>
                  <span>Lun - Vie: 8:00 AM - 6:00 PM</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-white font-semibold text-lg">Síguenos</h4>
              <div className="flex space-x-4">
                {socialLinks.map((social) => (
                  <Link
                    key={social.name}
                    href={social.href}
                    className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center hover:bg-white/20 transition-colors duration-200"
                    aria-label={social.name}
                  >
                    <span className="text-lg">{social.icon}</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-3 grid md:grid-cols-4 gap-8">
            {footerSections.map((section) => (
              <div key={section.title} className="space-y-4">
                <h4 className="text-white font-semibold text-lg">{section.title}</h4>
                <ul className="space-y-3">
                  {section.links.map((link) => (
                    <li key={link.name}>
                      <Link
                        href={link.href}
                        className="text-white/80 hover:text-[#81D843] text-sm transition-colors duration-200"
                      >
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="py-8 border-t border-white/20">
          <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
            <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-6 text-sm text-white/80">
              <span>© 2024 NORDEX. Todos los derechos reservados.</span>
              <div className="flex items-center space-x-4">
                <Link href="#" className="hover:text-[#81D843] transition-colors duration-200">
                  Términos
                </Link>
                <Link href="#" className="hover:text-[#81D843] transition-colors duration-200">
                  Privacidad
                </Link>
                <Link href="#" className="hover:text-[#81D843] transition-colors duration-200">
                  Cookies
                </Link>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <span className="text-white/60 text-sm">Hecho con</span>
              <span className="text-[#81D843] text-lg">💚</span>
              <span className="text-white/60 text-sm">en Bolivia</span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-r from-[#041655] to-[#051D67] py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
            <div className="text-center md:text-left">
              <h5 className="text-white font-semibold text-lg mb-1">
                ¿Listo para expandir tu negocio?
              </h5>
              <p className="text-white/80 text-sm">
                Comienza tu proceso de internacionalización hoy mismo
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3">
              <Button 
                size="lg"
                className="bg-[#81D843] hover:bg-[#6BC536] text-[#051D67] px-6 py-3 rounded-md font-medium transition-all duration-200"
              >
                Consulta gratuita
              </Button>
              <Button 
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-[#051D67] px-6 py-3 rounded-md font-medium transition-all duration-200"
              >
                <Link href="/sign-in">Acceder al sistema</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}