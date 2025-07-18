"use client";

import { useState } from "react";
import { MagicCard } from "@/components/magicui/magic-card";
import { BlurFade } from "@/components/magicui/blur-fade";
import { BoxReveal } from "@/components/magicui/box-reveal";
import { Plus, Minus } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export function FaqsSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      question: "¿Qué tipos de envíos puedo gestionar con Mercury Platform?",
      answer:
        "Mercury Platform soporta todo tipo de envíos internacionales: mercancías generales, productos perecederos, materiales peligrosos, equipos industriales y más. Trabajamos con todos los modos de transporte: marítimo, aéreo y terrestre.",
    },
    {
      question: "¿Cuánto tiempo toma obtener una cotización?",
      answer:
        "Nuestro sistema automatizado genera cotizaciones preliminares en tiempo real. Para cotizaciones finales con documentación completa, nuestro equipo de expertos responde en menos de 24 horas hábiles.",
    },
    {
      question: "¿En qué países tienen cobertura?",
      answer:
        "Tenemos cobertura activa en más de 50 países en América, Europa, Asia y Oceanía. Nuestro equipo mantiene actualizada toda la información normativa y aduanera de cada destino.",
    },
    {
      question: "¿Cómo garantizan la seguridad de mis datos y transacciones?",
      answer:
        "Utilizamos encriptación de nivel bancario SSL 256-bit, autenticación de dos factores, y cumplimos con certificaciones ISO 27001 y SOC 2. Todas las transacciones son monitoreadas 24/7 por nuestro equipo de seguridad.",
    },
    {
      question: "¿Ofrecen soporte técnico y asesoría?",
      answer:
        "Sí, ofrecemos soporte técnico 24/7 en español e inglés. Además, cada cliente tiene asignado un especialista en comercio internacional que brinda asesoría personalizada sobre regulaciones y mejores prácticas.",
    },
    {
      question: "¿Cuáles son los costos de la plataforma?",
      answer:
        "Ofrecemos planes escalables según el volumen de envíos. El plan básico incluye hasta 10 envíos mensuales sin costo inicial. Para volúmenes mayores, contacte a nuestro equipo comercial para una cotización personalizada.",
    },
    {
      question: "¿Puedo integrar Mercury con mi sistema ERP actual?",
      answer:
        "Absolutamente. Mercury Platform cuenta con APIs robustas y conectores pre-construidos para SAP, Oracle, QuickBooks y otros sistemas ERP populares. Nuestro equipo técnico asiste en la integración sin costo adicional.",
    },
    {
      question: "¿Qué documentación necesito para comenzar?",
      answer:
        "Necesita registro mercantil, RUT/RFC, certificado de antecedentes y autorización de representante legal. Para productos específicos pueden requerirse licencias adicionales. Nuestro equipo le guía en todo el proceso.",
    },
  ];

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-20 bg-secondary/5">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <BlurFade>
          <div className="text-center mb-16">
            <BoxReveal>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Preguntas Frecuentes
              </h2>
            </BoxReveal>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Resolvemos las dudas más comunes sobre Mercury Platform y nuestros
              servicios
            </p>
          </div>
        </BlurFade>

        <div className="max-w-4xl mx-auto">
          <div className="grid gap-4">
            {faqs.map((faq, index) => (
              <BlurFade key={index} delay={index * 0.1}>
                <MagicCard
                  className="cursor-pointer group"
                  gradientSize={400}
                  gradientOpacity={0.3}
                >
                  <div className="p-6" onClick={() => toggleFaq(index)}>
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors pr-4">
                        {faq.question}
                      </h3>
                      <div className="flex-shrink-0">
                        <motion.div
                          animate={{ rotate: openIndex === index ? 180 : 0 }}
                          transition={{ duration: 0.2 }}
                          className="p-2 rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors"
                        >
                          {openIndex === index ? (
                            <Minus className="h-4 w-4 text-primary" />
                          ) : (
                            <Plus className="h-4 w-4 text-primary" />
                          )}
                        </motion.div>
                      </div>
                    </div>

                    <AnimatePresence>
                      {openIndex === index && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3 }}
                          className="overflow-hidden"
                        >
                          <div className="pt-4 border-t border-border/50 mt-4">
                            <p className="text-muted-foreground leading-relaxed">
                              {faq.answer}
                            </p>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </MagicCard>
              </BlurFade>
            ))}
          </div>
        </div>

        <BlurFade delay={1.0}>
          <div className="mt-16 text-center">
            <div className="p-8 rounded-2xl bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/20 max-w-2xl mx-auto">
              <h3 className="text-xl font-bold text-foreground mb-4">
                ¿No encuentra su respuesta?
              </h3>
              <p className="text-muted-foreground mb-6">
                Nuestro equipo de soporte está disponible 24/7 para resolver
                cualquier duda específica sobre su caso
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors">
                  Contactar Soporte
                </button>
                <button className="px-6 py-3 border border-border rounded-lg font-medium hover:border-primary/50 transition-colors">
                  Agendar Demo
                </button>
              </div>
            </div>
          </div>
        </BlurFade>
      </div>
    </section>
  );
}
