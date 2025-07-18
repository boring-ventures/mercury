import { MagicCard } from "@/components/magicui/magic-card";
import { BlurFade } from "@/components/magicui/blur-fade";
import { TrendingDown, CheckCircle, Clock, Globe } from "lucide-react";

export function MetricsSection() {
  const metrics = [
    {
      icon: TrendingDown,
      title: "Reducción en Tiempos",
      value: "85%",
      subtitle: "De semanas a días",
      description:
        "Optimizamos los procesos de gestión internacional reduciendo significativamente los tiempos de espera tradicionales.",
      color: "#9E7AFF",
    },
    {
      icon: CheckCircle,
      title: "Tasa de Éxito",
      value: "99.8%",
      subtitle: "Transacciones completadas",
      description:
        "Nuestra experiencia y metodología garantiza que tus operaciones se completen exitosamente.",
      color: "#FE8BBB",
    },
    {
      icon: Clock,
      title: "Soporte",
      value: "24/7",
      subtitle: "Disponibilidad total",
      description:
        "Equipo especializado disponible para resolver cualquier consulta o situación urgente.",
      color: "#9E7AFF",
    },
    {
      icon: Globe,
      title: "Países",
      value: "+50",
      subtitle: "Alcance global",
      description:
        "Facilitamos operaciones comerciales con proveedores en más de 50 países alrededor del mundo.",
      color: "#FE8BBB",
    },
  ];

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <BlurFade>
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Resultados que transforman tu negocio
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Métricas que demuestran el impacto de NORDEX en las operaciones
              comerciales de empresas bolivianas
            </p>
          </div>
        </BlurFade>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {metrics.map((metric, index) => (
            <BlurFade key={metric.title} delay={index * 0.1}>
              <MagicCard
                className="h-full p-8 cursor-pointer"
                gradientColor={metric.color}
                gradientSize={200}
                gradientOpacity={0.8}
              >
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className="p-4 rounded-full bg-primary/10">
                    <metric.icon className="h-8 w-8 text-primary" />
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                      {metric.title}
                    </h3>
                    <div className="text-4xl font-bold text-foreground">
                      {metric.value}
                    </div>
                    <div className="text-sm font-medium text-primary">
                      {metric.subtitle}
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {metric.description}
                    </p>
                  </div>
                </div>
              </MagicCard>
            </BlurFade>
          ))}
        </div>

        <BlurFade delay={0.5}>
          <div className="mt-16 text-center">
            <div className="inline-flex items-center space-x-8 p-8 rounded-2xl bg-secondary/30 backdrop-blur-sm">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">+150</div>
                <div className="text-sm text-muted-foreground">
                  Empresas Bolivianas
                </div>
              </div>
              <div className="w-px h-12 bg-border" />
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">+500</div>
                <div className="text-sm text-muted-foreground">
                  Operaciones Exitosas
                </div>
              </div>
              <div className="w-px h-12 bg-border" />
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">98%</div>
                <div className="text-sm text-muted-foreground">
                  Satisfacción Total
                </div>
              </div>
            </div>
          </div>
        </BlurFade>
      </div>
    </section>
  );
}
