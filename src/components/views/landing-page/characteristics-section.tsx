import { MagicCard } from "@/components/magicui/magic-card";
import { BlurFade } from "@/components/magicui/blur-fade";
import { BoxReveal } from "@/components/magicui/box-reveal";
import { AnimatedShinyText } from "@/components/magicui/animated-shiny-text";
import {
  Cpu,
  Users,
  Network,
  Shield,
  Settings,
  MessageSquare,
} from "lucide-react";

export function CharacteristicsSection() {
  const characteristics = [
    {
      icon: Cpu,
      title: "Tecnología Avanzada",
      description:
        "Utilizamos plataformas tecnológicas de vanguardia que nos permiten procesar operaciones de manera eficiente y segura, manteniéndonos a la vanguardia de la innovación en servicios comerciales.",
      highlight: "Vanguardia Tech",
      color: "#9E7AFF",
    },
    {
      icon: Users,
      title: "Equipo Especializado",
      description:
        "Profesionales con amplia experiencia en comercio internacional, regulaciones financieras y mercados globales, capacitados para manejar operaciones de cualquier complejidad.",
      highlight: "Expertos dedicados",
      color: "#FE8BBB",
    },
    {
      icon: Network,
      title: "Red Global de Contactos",
      description:
        "Alianzas estratégicas con instituciones financieras y socios comerciales en múltiples países que nos permiten ofrecer soluciones integrales a nivel mundial.",
      highlight: "Alianzas estratégicas",
      color: "#9E7AFF",
    },
    {
      icon: Shield,
      title: "Cumplimiento Normativo",
      description:
        "Adherencia estricta a todas las regulaciones locales e internacionales, garantizando que tus operaciones cumplan con todos los requisitos legales y normativos.",
      highlight: "100% Legal",
      color: "#FE8BBB",
    },
    {
      icon: Settings,
      title: "Flexibilidad de Servicios",
      description:
        "Adaptamos nuestros servicios a las necesidades específicas de cada cliente, desde operaciones puntuales hasta programas de facilitación comercial de largo plazo.",
      highlight: "Servicios flexibles",
      color: "#9E7AFF",
    },
    {
      icon: MessageSquare,
      title: "Comunicación Proactiva",
      description:
        "Mantenemos comunicación constante y proactiva durante todo el proceso, proporcionando actualizaciones regulares y disponibilidad inmediata para consultas.",
      highlight: "Comunicación 24/7",
      color: "#FE8BBB",
    },
  ];

  return (
    <section className="py-20 bg-secondary/10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <BlurFade>
          <div className="text-center mb-16">
            <BoxReveal>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Lo que nos hace
                <br />
                <AnimatedShinyText className="text-3xl md:text-4xl font-bold">
                  únicos en el mercado
                </AnimatedShinyText>
              </h2>
            </BoxReveal>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Características distintivas que posicionan a NORDEX como líder en
              facilitación comercial internacional para empresas bolivianas
            </p>
          </div>
        </BlurFade>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {characteristics.map((characteristic, index) => (
            <BlurFade key={characteristic.title} delay={index * 0.08}>
              <MagicCard
                className="h-full p-6 cursor-pointer group relative overflow-hidden"
                gradientColor={characteristic.color}
                gradientSize={200}
                gradientOpacity={0.8}
              >
                <div className="space-y-4 relative z-10">
                  <div className="flex items-center justify-between">
                    <div className="p-3 rounded-xl bg-background/80 backdrop-blur-sm group-hover:bg-background transition-colors">
                      <characteristic.icon className="h-6 w-6 text-primary" />
                    </div>
                    <div className="px-3 py-1 rounded-full bg-primary/10 border border-primary/20">
                      <span className="text-xs font-medium text-primary">
                        {characteristic.highlight}
                      </span>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-3">
                      {characteristic.title}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {characteristic.description}
                    </p>
                  </div>
                </div>

                {/* Gradient overlay effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </MagicCard>
            </BlurFade>
          ))}
        </div>

        <BlurFade delay={1.0}>
          <div className="mt-16">
            <div className="bg-gradient-to-r from-primary/5 via-secondary/5 to-primary/5 rounded-2xl p-8 border border-primary/10">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                <div>
                  <div className="text-3xl font-bold text-primary mb-2">
                    10+
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Años de Experiencia
                  </div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-primary mb-2">
                    Bolivia
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Mercado Especializado
                  </div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-primary mb-2">
                    24/7
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Disponibilidad
                  </div>
                </div>
              </div>
            </div>
          </div>
        </BlurFade>
      </div>
    </section>
  );
}
