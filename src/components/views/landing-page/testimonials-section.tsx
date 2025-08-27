import { Star } from "lucide-react";
import { BlurFade } from "@/components/magicui/blur-fade";

export function TestimonialsSection() {
  const testimonials = [
    {
      name: "Pipe",
      content:
        "Me salva full pa pagos. Ayer estaba lenta pero creo que era porque aquí había puente y todos la estábamos usando. LoL",
      initial: "P",
    },
    {
      name: "Mariana López",
      content:
        "Gran iniciativa, muy útil y sencilla, deseando que llegue la tarjeta física pronto. Creo que ahora la uso más que mi banco.",
      initial: "M",
    },
    {
      name: "Carlos",
      content:
        "La aplicación funciona muy bien, hasta ahora no he podido tener ningún problema. La he usado en Europa, y ya la recomendé a varios amigos.",
      initial: "C",
    },
  ];

  return (
    <section className="py-20 bg-gray-50 dark:bg-gray-800">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <BlurFade>
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
                Nuestros usuarios
                <br />
                <span className="text-blue-600 dark:text-blue-400">
                  nos aman
                </span>
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300">
                Cientos de miles de usuarios de todo el mundo confían en Meru
              </p>
            </div>
          </BlurFade>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <BlurFade key={testimonial.name} delay={0.1 * (index + 1)}>
                <div className="bg-white dark:bg-gray-900 rounded-2xl p-8 shadow-lg border border-gray-200 dark:border-gray-700">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold mr-4">
                      {testimonial.initial}
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white">
                        {testimonial.name}
                      </h4>
                      <div className="flex space-x-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className="h-4 w-4 fill-yellow-400 text-yellow-400"
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 italic">
                    &ldquo;{testimonial.content}&rdquo;
                  </p>
                </div>
              </BlurFade>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
