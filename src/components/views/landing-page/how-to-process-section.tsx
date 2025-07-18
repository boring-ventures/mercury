import { MagicCard } from "@/components/magicui/magic-card";
import { BlurFade } from "@/components/magicui/blur-fade";
import { BoxReveal } from "@/components/magicui/box-reveal";
import {
  MessageCircle,
  FileText,
  Cog,
  CheckCircle,
  ArrowRight,
} from "lucide-react";

export function HowToProcessSection() {
  const steps = [
    {
      icon: MessageCircle,
      step: "01",
      title: "Consulta Inicial",
      subtitle: "Análisis de necesidades",
      description:
        "Evaluamos tus requerimientos específicos de comercio internacional y diseñamos la estrategia más efectiva para tu empresa.",
      details: [
        "Evaluación de requerimientos",
        "Análisis de necesidades",
        "Diseño de estrategia",
        "Planificación personalizada",
      ],
      color: "#9E7AFF",
    },
    {
      icon: FileText,
      step: "02",
      title: "Propuesta Personalizada",
      subtitle: "Solución a medida",
      description:
        "Presentamos una propuesta detallada con costos transparentes, tiempos estimados y metodología de trabajo específica para tu caso.",
      details: [
        "Propuesta detallada",
        "Costos transparentes",
        "Tiempos estimados",
        "Metodología específica",
      ],
      color: "#FE8BBB",
    },
    {
      icon: Cog,
      step: "03",
      title: "Implementación",
      subtitle: "Ejecución experta",
      description:
        "Nuestro equipo especializado ejecuta la operación con seguimiento constante y comunicación fluida durante todo el proceso.",
      details: [
        "Equipo especializado",
        "Ejecución profesional",
        "Seguimiento constante",
        "Comunicación fluida",
      ],
      color: "#9E7AFF",
    },
    {
      icon: CheckCircle,
      step: "04",
      title: "Entrega y Seguimiento",
      subtitle: "Resultados garantizados",
      description:
        "Completamos la operación exitosamente y proporcionamos seguimiento post-servicio para asegurar tu total satisfacción.",
      details: [
        "Operación completada",
        "Entrega exitosa",
        "Seguimiento post-servicio",
        "Satisfacción garantizada",
      ],
      color: "#FE8BBB",
    },
  ];

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <BlurFade>
          <div className="text-center mb-16">
            <BoxReveal>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Así de simple es trabajar con NORDEX
              </h2>
            </BoxReveal>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Un proceso estructurado y eficiente que garantiza el éxito de tus
              operaciones de comercio internacional
            </p>
          </div>
        </BlurFade>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <BlurFade key={step.step} delay={index * 0.15}>
              <div className="relative">
                <MagicCard
                  className="h-full p-8 cursor-pointer group"
                  gradientColor={step.color}
                  gradientSize={250}
                  gradientOpacity={0.7}
                >
                  <div className="space-y-6">
                    <div className="flex items-start justify-between">
                      <div className="p-3 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                        <step.icon className="h-8 w-8 text-primary" />
                      </div>
                      <div className="text-4xl font-bold text-primary/20">
                        {step.step}
                      </div>
                    </div>

                    <div>
                      <h3 className="text-xl font-semibold text-foreground mb-2">
                        {step.title}
                      </h3>
                      <h4 className="text-sm font-medium text-primary mb-3">
                        {step.subtitle}
                      </h4>
                      <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                        {step.description}
                      </p>
                    </div>

                    <div className="space-y-2">
                      {step.details.map((detail, detailIndex) => (
                        <div
                          key={detailIndex}
                          className="flex items-center space-x-2"
                        >
                          <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                          <span className="text-xs text-muted-foreground">
                            {detail}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </MagicCard>

                {/* Arrow connector */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-10">
                    <ArrowRight className="h-6 w-6 text-primary/50" />
                  </div>
                )}
              </div>
            </BlurFade>
          ))}
        </div>

        <BlurFade delay={0.8}>
          <div className="mt-16 text-center">
            <div className="p-8 rounded-2xl bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/20">
              <h3 className="text-2xl font-bold text-foreground mb-4">
                ¿Listo para comenzar tu expansión internacional?
              </h3>
              <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                Únete a más de 150 empresas bolivianas que ya confían en NORDEX
                para facilitar su comercio internacional
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="px-8 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors">
                  Solicitar Consultoría Gratuita
                </button>
                <button className="px-8 py-3 border border-border rounded-lg font-medium hover:border-primary/50 transition-colors">
                  Conocer Servicios
                </button>
              </div>
            </div>
          </div>
        </BlurFade>
      </div>
    </section>
  );
}
