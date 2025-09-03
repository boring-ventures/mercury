"use client";
import { Activity, Map as MapIcon, MessageCircle } from "lucide-react";
import DottedMap from "dotted-map";
import { Area, AreaChart, CartesianGrid } from "recharts";
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

export function Features() {
  return (
    <section className="px-6 py-20 bg-white">
      <div className="mx-auto max-w-7xl">
        {/* Header Section */}
        <div className="text-left mb-16">
          <div className="inline-flex items-center px-4 py-2 bg-[#051D67] rounded-full mb-6">
            <span className="text-white font-semibold text-sm">
              Diferenciadores
            </span>
          </div>
          <h2 className="text-[30px] md:text-5xl font-serif font-bold text-[#1F1915] mb-6">
            Nuestros Diferenciadores
          </h2>
          <p className="text-[16px] text-[#6B6B6B] max-w-3xl leading-relaxed">
            Soluciones integrales para conectar tu empresa con el mercado
            internacional, desde la negociación hasta la entrega final, con
            tecnología de vanguardia.
          </p>
        </div>

        <div className="grid border border-[#1F1915]/10 rounded-2xl overflow-hidden md:grid-cols-2">
          <div>
            <div className="p-6 sm:p-12">
              <span className="flex items-center gap-2 text-[#1F1915A3] text-sm">
                <MapIcon className="w-4 h-4 text-[#051D67]" />
                Logística comercial global
              </span>

              <p className="mt-6 text-lg sm:text-xl md:text-2xl font-serif font-bold text-[#1F1915]">
                Coordinamos envíos internacionales, aduanas y seguimiento de
                operaciones en un solo sistema.
              </p>
            </div>

            <div aria-hidden className="relative">
              <div className="absolute inset-0 z-10 m-auto size-fit">
                <div className="relative z-[1] flex size-fit w-fit items-center gap-2 rounded-xl bg-white border border-[#1F1915]/10 px-3 py-1 text-xs font-medium text-[#1F1915] shadow-md shadow-black/5">
                  <span className="text-lg">🌍</span> Ruta activa: Santa Cruz →
                  China
                </div>
                <div className="absolute inset-2 -bottom-2 mx-auto rounded-xl bg-white border border-[#1F1915]/10 px-3 py-4 text-xs font-medium shadow-md shadow-black/5"></div>
              </div>

              <div className="relative overflow-hidden text-[#262626]">
                <Map />
              </div>
            </div>
          </div>
          <div className="overflow-hidden border-t md:border-0 md:border-l border-[#1F1915]/10 bg-white p-6 sm:p-12">
            <div className="relative z-10">
              <span className="flex items-center gap-2 text-[#1F1915A3] text-sm">
                <MessageCircle className="w-4 h-4 text-[#051D67]" />
                Cotizaciones inmediatas y automatizadas
              </span>

              <p className="my-6 text-lg sm:text-xl md:text-2xl font-serif font-bold text-[#1F1915]">
                Respuestas en minutos. Obtén precios y tiempos estimados de
                forma automática.
              </p>
            </div>
            <div aria-hidden className="flex flex-col gap-8">
              <div>
                <div className="flex items-center gap-2">
                  <span className="flex justify-center items-center size-5 rounded-full border border-[#051D67]">
                    <span className="size-3 rounded-full bg-[#81D843]" />
                  </span>
                  <span className="text-[#1F1915A3] text-xs">
                    Solicitud #Q-1452
                  </span>
                </div>
                <div className="mt-1.5 w-3/5 rounded-xl border border-[#1F1915]/10 bg-white p-3 text-xs text-[#1F1915]">
                  Hola, necesito cotización para importar maquinaria a Santa
                  Cruz.
                </div>
              </div>

              <div>
                <div className="mb-1 ml-auto w-3/5 rounded-xl bg-[#051D67] p-3 text-xs text-white">
                  Cotización generada: $12,500 | ETA 18 días | Incoterm CIF.
                </div>
                <span className="block text-right text-xs text-[#1F1915A3]">
                  Enviado automáticamente
                </span>
              </div>
            </div>
          </div>
          {/* Removed uptime block */}
          <div className="relative col-span-full">
            <div className="relative z-10 max-w-lg px-6 pr-12 pt-6 md:px-12 md:pt-12 md:absolute">
              <span className="flex items-center gap-2 text-[#1F1915A3] text-sm">
                <Activity className="w-4 h-4 text-[#051D67]" />
                Estados del proceso
              </span>

              <p className="my-6 text-lg sm:text-xl md:text-2xl font-serif font-bold text-[#1F1915]">
                Nuestro sistema te permite monitorear cada etapa de tus
                operaciones: desde la solicitud hasta la entrega final.
              </p>
            </div>
            <div className="mt-8 md:mt-0">
              <MonitoringChart />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

const map = new DottedMap({ height: 55, grid: "diagonal" });

const points = map.getPoints();

const svgOptions = {
  backgroundColor: "#ffffff",
  color: "#262626",
  radius: 0.15,
};

const Map = () => {
  const viewBox = `0 0 120 60`;
  return (
    <svg viewBox={viewBox} style={{ background: svgOptions.backgroundColor }}>
      {points.map((point, index) => (
        <circle
          key={index}
          cx={point.x}
          cy={point.y}
          r={svgOptions.radius}
          fill={svgOptions.color}
        />
      ))}
    </svg>
  );
};

const chartConfig = {
  estado1: {
    label: "Estado 1",
    color: "#051D67",
  },
  estado2: {
    label: "Estado 2",
    color: "#81D843",
  },
  estado3: {
    label: "Estado 3",
    color: "#4CAF50",
  },
} satisfies ChartConfig;

const chartData = [
  { paso: "Inicio", estado1: 10, estado2: 0, estado3: 0 },
  { paso: "Validación", estado1: 30, estado2: 10, estado3: 0 },
  { paso: "Compra", estado1: 50, estado2: 30, estado3: 10 },
  { paso: "En tránsito", estado1: 70, estado2: 55, estado3: 30 },
  { paso: "Aduana", estado1: 85, estado2: 70, estado3: 55 },
  { paso: "Entrega", estado1: 100, estado2: 90, estado3: 80 },
];

const MonitoringChart = () => {
  return (
    <ChartContainer className="h-120 aspect-auto md:h-96" config={chartConfig}>
      <AreaChart
        accessibilityLayer
        data={chartData}
        margin={{
          left: 0,
          right: 0,
        }}
      >
        <defs>
          <linearGradient id="fillEstado1" x1="0" y1="0" x2="0" y2="1">
            <stop
              offset="0%"
              stopColor="var(--color-estado1)"
              stopOpacity={0.8}
            />
            <stop
              offset="55%"
              stopColor="var(--color-estado1)"
              stopOpacity={0.1}
            />
          </linearGradient>
          <linearGradient id="fillEstado2" x1="0" y1="0" x2="0" y2="1">
            <stop
              offset="0%"
              stopColor="var(--color-estado2)"
              stopOpacity={0.8}
            />
            <stop
              offset="55%"
              stopColor="var(--color-estado2)"
              stopOpacity={0.1}
            />
          </linearGradient>
          <linearGradient id="fillEstado3" x1="0" y1="0" x2="0" y2="1">
            <stop
              offset="0%"
              stopColor="var(--color-estado3)"
              stopOpacity={0.8}
            />
            <stop
              offset="55%"
              stopColor="var(--color-estado3)"
              stopOpacity={0.1}
            />
          </linearGradient>
        </defs>
        <CartesianGrid vertical={false} />
        <ChartTooltip
          active
          cursor={false}
          content={<ChartTooltipContent className="bg-white" />}
        />
        <Area
          strokeWidth={2}
          dataKey="estado1"
          type="stepBefore"
          fill="url(#fillEstado1)"
          fillOpacity={0.1}
          stroke="var(--color-estado1)"
          stackId="a"
        />
        <Area
          strokeWidth={2}
          dataKey="estado2"
          type="stepBefore"
          fill="url(#fillEstado2)"
          fillOpacity={0.1}
          stroke="var(--color-estado2)"
          stackId="a"
        />
        <Area
          strokeWidth={2}
          dataKey="estado3"
          type="stepBefore"
          fill="url(#fillEstado3)"
          fillOpacity={0.1}
          stroke="var(--color-estado3)"
          stackId="a"
        />
      </AreaChart>
    </ChartContainer>
  );
};
