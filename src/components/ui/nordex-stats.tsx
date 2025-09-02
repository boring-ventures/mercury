"use client";

import {
  AreaChart,
  Area,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

export default function NordexStats() {
  const data = [
    { name: "2020", value: 15 },
    { name: "2021", value: 25 },
    { name: "2022", value: 35 },
    { name: "2023", value: 45 },
    { name: "2024", value: 50 },
  ];

  return (
    <section className="w-full py-20">
      <div>
        <h3 className="text-2xl md:text-4xl font-bold text-[#262626] mb-6 font-sans">
          Impulsando el comercio internacional boliviano.{" "}
          <span className="text-[#262626A3] text-lg md:text-2xl font-serif font-normal">
            Nuestra plataforma y experiencia ayudan a empresas bolivianas a expandirse globalmente con eficiencia y seguridad.
          </span>
        </h3>

        {/* Stats grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16">
          <div className="text-center">
            <p className="text-3xl md:text-4xl font-bold text-[#051D67] mb-2">+10</p>
            <p className="text-[#262626A3] text-base font-serif">Años de experiencia</p>
          </div>
          <div className="text-center">
            <p className="text-3xl md:text-4xl font-bold text-[#051D67] mb-2">+30</p>
            <p className="text-[#262626A3] text-base font-serif">Empresas atendidas</p>
          </div>
          <div className="text-center">
            <p className="text-3xl md:text-4xl font-bold text-[#051D67] mb-2">+10</p>
            <p className="text-[#262626A3] text-base font-serif">Países destino</p>
          </div>
          <div className="text-center">
            <p className="text-3xl md:text-4xl font-bold text-[#051D67] mb-2">$50M+</p>
            <p className="text-[#262626A3] text-base font-serif">En transacciones</p>
          </div>
        </div>
      </div>

      {/* Area Chart */}
      <div className="w-full h-48 mt-16">
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
                backgroundColor: '#051D67',
                border: 'none',
                borderRadius: '8px',
                color: 'white'
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