import { MagicCard } from "@/components/magicui/magic-card";
import { BlurFade } from "@/components/magicui/blur-fade";
import { BoxReveal } from "@/components/magicui/box-reveal";
import {
  Settings,
  Zap,
  Eye,
  MapPin,
  DollarSign,
  TrendingUp,
} from "lucide-react";

export function BenefitsSection() {
  const benefits = [
    {
      icon: Settings,
      title: "Simplicidad Operativa",
      subtitle: "Elimina la complejidad",
      description:
        "Convertimos procesos complicados en operaciones simples y directas. Tu equipo se enfoca en el negocio mientras nosotros manejamos los aspectos técnicos del comercio internacional.",
      features: [
        "Procesos simplificados",
        "Operaciones directas",
        "Enfoque en el negocio",
      ],
    },
    {
      icon: Zap,
      title: "Velocidad de Ejecución",
      subtitle: "Rapidez sin comprometer seguridad",
      description:
        "Procesamos tus operaciones en tiempo récord manteniendo los más altos estándares de seguridad y cumplimiento normativo.",
      features: ["Tiempo récord", "Altos estándares", "Cumplimiento normativo"],
    },
    {
      icon: Eye,
      title: "Transparencia Total",
      subtitle: "Visibilidad completa del proceso",
      description:
        "Acceso en tiempo real al estado de tus operaciones con reportes detallados y comunicación constante sobre el progreso.",
      features: [
        "Acceso tiempo real",
        "Reportes detallados",
        "Comunicación constante",
      ],
    },
    {
      icon: MapPin,
      title: "Expertise Local",
      subtitle: "Conocimiento del mercado boliviano",
      description:
        "Entendemos las particularidades del entorno empresarial boliviano y las regulaciones locales que afectan el comercio internacional.",
      features: [
        "Entorno boliviano",
        "Regulaciones locales",
        "Comercio internacional",
      ],
    },
    {
      icon: DollarSign,
      title: "Costos Competitivos",
      subtitle: "Optimización de recursos",
      description:
        "Estructura de costos transparente y competitiva que te permite planificar mejor tus operaciones internacionales.",
      features: [
        "Costos transparentes",
        "Planificación mejorada",
        "Operaciones eficientes",
      ],
    },
    {
      icon: TrendingUp,
      title: "Escalabilidad",
      subtitle: "Crece sin límites",
      description:
        "Nuestra infraestructura se adapta al crecimiento de tu empresa, desde operaciones pequeñas hasta grandes volúmenes comerciales.",
      features: [
        "Adaptación al crecimiento",
        "Desde pequeñas a grandes",
        "Volúmenes escalables",
      ],
    },
  ];

  return (
    <section id="benefits" className="py-20 bg-secondary/10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <BlurFade>
          <div className="text-center mb-16">
            <BoxReveal>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                ¿Por qué elegir NORDEX para tu comercio internacional?
              </h2>
            </BoxReveal>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Descubre las ventajas que nos convierten en el socio ideal para
              expandir tu empresa boliviana al mercado global
            </p>
          </div>
        </BlurFade>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {benefits.map((benefit, index) => (
            <BlurFade key={benefit.title} delay={index * 0.1}>
              <MagicCard
                className="h-full p-8 cursor-pointer group"
                gradientSize={300}
                gradientOpacity={0.6}
              >
                <div className="space-y-6">
                  <div className="space-y-3">
                    <div className="p-3 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors w-fit">
                      <benefit.icon className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold text-foreground">
                      {benefit.title}
                    </h3>
                    <h4 className="text-sm font-medium text-primary">
                      {benefit.subtitle}
                    </h4>
                  </div>

                  <p className="text-muted-foreground leading-relaxed">
                    {benefit.description}
                  </p>

                  <div className="space-y-2">
                    {benefit.features.map((feature, featureIndex) => (
                      <div
                        key={featureIndex}
                        className="flex items-center space-x-2"
                      >
                        <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                        <span className="text-sm text-muted-foreground">
                          {feature}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </MagicCard>
            </BlurFade>
          ))}
        </div>

        <BlurFade delay={0.8}>
          <div className="mt-16 text-center">
            <div className="inline-flex items-center space-x-2 px-6 py-3 rounded-full bg-primary/10 border border-primary/20">
              <MapPin className="h-5 w-5 text-primary" />
              <span className="text-primary font-medium">
                Especializados en el mercado boliviano - Expertos en comercio
                internacional
              </span>
            </div>
          </div>
        </BlurFade>
      </div>
    </section>
  );
}
