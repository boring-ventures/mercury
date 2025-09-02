"use client";

import { AreaChart, Area, ResponsiveContainer, Tooltip } from "recharts";

export default function NordexStats() {
  const data = [
    { name: "2020", value: 1 },
    { name: "2021", value: 8 },
    { name: "2022", value: 15 },
    { name: "2023", value: 22 },
    { name: "2024", value: 30 },
  ];

  return (
    <section className="w-full py-8 sm:py-12 lg:py-16 xl:py-20">
      <div>
        <h3 className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-bold text-[#051D67] mb-4 sm:mb-6 font-sans">
          Impulsando el comercio internacional boliviano.{" "}
          <span className="text-[#262626A3] text-base sm:text-lg md:text-xl lg:text-2xl font-serif font-normal">
            Nuestra plataforma y experiencia ayudan a empresas bolivianas a
            expandirse globalmente con eficiencia y seguridad.
          </span>
        </h3>

        {/* Stats grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 mt-8 sm:mt-12 lg:mt-16">
          <div className="text-center">
            <p className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-[#051D67] mb-1 sm:mb-2">
              +10
            </p>
            <p className="text-[#262626A3] text-sm sm:text-base lg:text-lg font-serif">
              Años de experiencia
            </p>
          </div>
          <div className="text-center">
            <p className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-[#051D67] mb-1 sm:mb-2">
              +30
            </p>
            <p className="text-[#262626A3] text-sm sm:text-base lg:text-lg font-serif">
              Empresas atendidas
            </p>
          </div>
          <div className="text-center">
            <p className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-[#051D67] mb-1 sm:mb-2">
              +10
            </p>
            <p className="text-[#262626A3] text-sm sm:text-base lg:text-lg font-serif">
              Países destino
            </p>
          </div>
          <div className="text-center">
            <p className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-[#051D67] mb-1 sm:mb-2">
              $50M+
            </p>
            <p className="text-[#262626A3] text-sm sm:text-base lg:text-lg font-serif">
              En transacciones
            </p>
          </div>
        </div>
      </div>

      {/* Area Chart */}
      <div className="w-full h-32 sm:h-40 lg:h-48 xl:h-56 mt-8 sm:mt-12 lg:mt-16">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorNordex" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#051D67" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#051D67" stopOpacity={0} />
              </linearGradient>
            </defs>
            <Tooltip
              contentStyle={{
                backgroundColor: "#051D67",
                border: "none",
                borderRadius: "8px",
                color: "white",
              }}
            />
            <Area
              type="monotone"
              dataKey="value"
              stroke="#051D67"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#colorNordex)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}
