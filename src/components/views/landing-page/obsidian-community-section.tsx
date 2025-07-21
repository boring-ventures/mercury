import React from "react";
import {
  MessageCircle,
  Star,
  ArrowRight,
  Building,
  Users,
  TrendingUp,
  Phone,
  MapPin,
  Mail,
} from "lucide-react";

export default function NordexTestimonialsSection() {
  const testimonials = [
    {
      quote:
        "NORDEX transformó completamente nuestra operación de importación. Lo que antes nos tomaba semanas, ahora lo resolvemos en días. Su equipo es profesional y la comunicación es excepcional.",
      author: "María González",
      position: "Directora de Operaciones",
      company: "ImportTech Bolivia",
      rating: 5,
    },
    {
      quote:
        "La transparencia y velocidad de NORDEX nos permitió expandir significativamente nuestras importaciones. Su conocimiento del mercado local es invaluable para empresas como la nuestra.",
      author: "Carlos Mendoza",
      position: "CEO",
      company: "Distribuidora Industrial del Sur",
      rating: 5,
    },
    {
      quote:
        "Llevamos 2 años trabajando con NORDEX y han sido un socio estratégico clave. Su servicio 24/7 y expertise técnico nos da la confianza para crecer internacionalmente.",
      author: "Ana Patricia Ríos",
      position: "Gerente General",
      company: "TechSolutions Bolivia",
      rating: 5,
    },
  ];

  const socialProof = [
    {
      icon: Building,
      title: "Importadoras de tecnología",
      description: "Equipos informáticos y componentes electrónicos",
    },
    {
      icon: Users,
      title: "Distribuidoras de maquinaria",
      description: "Maquinaria industrial y herramientas especializadas",
    },
    {
      icon: TrendingUp,
      title: "Empresas textiles",
      description: "Materias primas y productos manufacturados",
    },
    {
      icon: Building,
      title: "Sector farmacéutico",
      description: "Medicamentos y equipos médicos",
    },
    {
      icon: Users,
      title: "Industria alimentaria",
      description: "Ingredientes y maquinaria para procesamiento",
    },
  ];

  return (
    <section className="bg-gradient-to-br from-[#051D67] via-black to-gray-900 text-white py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Social Proof */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-8">
            Empresas líderes confían en NORDEX
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-12">
            {socialProof.map((proof, index) => {
              const IconComponent = proof.icon;
              return (
                <div key={index} className="text-center group">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-white/10 rounded-lg mb-3 group-hover:bg-white/20 transition-colors">
                    <IconComponent className="w-6 h-6 text-white" />
                  </div>
                  <h4 className="font-semibold text-sm mb-1">{proof.title}</h4>
                  <p className="text-xs text-gray-300">{proof.description}</p>
                </div>
              );
            })}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <div className="text-center">
              <div className="text-4xl font-bold text-white mb-2">+150</div>
              <div className="text-gray-300">Empresas atendidas</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-white mb-2">+500</div>
              <div className="text-gray-300">Transacciones procesadas</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-white mb-2">98%</div>
              <div className="text-gray-300">Satisfacción del cliente</div>
            </div>
          </div>
        </div>

        {/* Testimonials */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h3 className="text-3xl md:text-4xl font-bold mb-4">
              Lo que dicen nuestros clientes
            </h3>
            <p className="text-xl text-gray-300">
              Testimonios reales de empresas que han transformado su comercio
              internacional con NORDEX
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="bg-white/10 backdrop-blur-sm rounded-xl p-8 hover:bg-white/20 transition-all duration-300 transform hover:scale-105 border border-white/20"
              >
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-5 h-5 text-yellow-400 fill-current"
                    />
                  ))}
                </div>

                <blockquote className="text-gray-200 leading-relaxed mb-6 italic">
                  "{testimonial.quote}"
                </blockquote>

                <div className="border-t border-white/20 pt-4">
                  <div className="font-semibold text-white">
                    {testimonial.author}
                  </div>
                  <div className="text-sm text-gray-300">
                    {testimonial.position}
                  </div>
                  <div className="text-sm text-gray-400">
                    {testimonial.company}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Contact Information */}
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-12 border border-white/20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-3xl font-bold text-white mb-6">
                ¿Listo para transformar tu comercio internacional?
              </h3>
              <p className="text-xl text-gray-300 mb-8">
                Únete a más de 150 empresas bolivianas que ya confían en NORDEX
                para sus operaciones internacionales.
              </p>

              <a
                href="#contacto"
                className="inline-flex items-center justify-center px-8 py-4 bg-white hover:bg-gray-100 text-[#051D67] rounded-lg text-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                <MessageCircle className="w-6 h-6 mr-3" />
                Solicitar Consultoría Gratuita
              </a>
            </div>

            <div className="bg-white/10 rounded-xl p-8 border border-white/20">
              <h4 className="text-2xl font-bold text-white mb-6">
                Información de Contacto
              </h4>

              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <MapPin className="w-5 h-5 text-gray-300 flex-shrink-0" />
                  <div>
                    <div className="font-semibold text-white">
                      NORDEX - Facilitación Comercial Internacional
                    </div>
                    <div className="text-gray-300">
                      Av. Principal, Zona Central, La Paz - Bolivia
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Phone className="w-5 h-5 text-gray-300" />
                  <div className="text-gray-300">+591 2 XXX-XXXX</div>
                </div>

                <div className="flex items-center space-x-3">
                  <MessageCircle className="w-5 h-5 text-gray-300" />
                  <div className="text-gray-300">WhatsApp: +591 7XXXX-XXXX</div>
                </div>

                <div className="flex items-center space-x-3">
                  <Mail className="w-5 h-5 text-gray-300" />
                  <div className="text-gray-300">contacto@nordex.bo</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
