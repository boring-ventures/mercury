import NordexHeader from "@/components/views/landing-page/nordex-header";
import NordexFooterSection from "@/components/views/landing-page/nordex-footer-section";

export default function NoticiasPage() {
  // Mock data for blog posts - this will be replaced with Contentful data
  const mockPosts = [
    {
      id: 1,
      title: "Nuevas Regulaciones de Importación 2024",
      excerpt: "Conoce las últimas actualizaciones en normativas de importación que afectan el comercio internacional.",
      date: "2024-01-15",
      category: "Regulaciones",
      image: "/placeholder-blog-1.jpg",
      slug: "nuevas-regulaciones-importacion-2024"
    },
    {
      id: 2,
      title: "Cómo Optimizar los Costos de Envío Internacional",
      excerpt: "Descubre estrategias efectivas para reducir costos en tus operaciones de importación.",
      date: "2024-01-10",
      category: "Consejos",
      image: "/placeholder-blog-2.jpg",
      slug: "optimizar-costos-envio-internacional"
    },
    {
      id: 3,
      title: "Tendencias del Comercio Internacional en América Latina",
      excerpt: "Análisis completo de las tendencias emergentes en el comercio internacional regional.",
      date: "2024-01-05",
      category: "Análisis",
      image: "/placeholder-blog-3.jpg",
      slug: "tendencias-comercio-internacional-latam"
    },
    {
      id: 4,
      title: "Digitalización de Procesos Aduaneros",
      excerpt: "La transformación digital está revolucionando los procesos aduaneros. Te contamos cómo.",
      date: "2024-01-01",
      category: "Tecnología",
      image: "/placeholder-blog-4.jpg",
      slug: "digitalizacion-procesos-aduaneros"
    },
    {
      id: 5,
      title: "Guía Completa para Nuevos Importadores",
      excerpt: "Todo lo que necesitas saber para comenzar en el mundo de las importaciones.",
      date: "2023-12-28",
      category: "Guías",
      image: "/placeholder-blog-5.jpg",
      slug: "guia-completa-nuevos-importadores"
    },
    {
      id: 6,
      title: "Impacto del E-commerce en las Importaciones",
      excerpt: "Cómo el crecimiento del comercio electrónico está transformando las importaciones.",
      date: "2023-12-25",
      category: "E-commerce",
      image: "/placeholder-blog-6.jpg",
      slug: "impacto-ecommerce-importaciones"
    }
  ];

  const categories = ["Todos", "Regulaciones", "Consejos", "Análisis", "Tecnología", "Guías", "E-commerce"];

  return (
    <div className="bg-[#F2EFE9] min-h-screen">
      <NordexHeader />
      
      <main className="pt-20 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold text-[#1F1915] mb-6">
              Noticias y Blog
            </h1>
            <p className="text-lg text-[#6B6B6B] max-w-3xl mx-auto">
              Mantente informado sobre las últimas tendencias, regulaciones y consejos 
              del mundo del comercio internacional y las importaciones.
            </p>
          </div>

          {/* Categories Filter */}
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {categories.map((category) => (
              <button
                key={category}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  category === "Todos"
                    ? "bg-[#051D67] text-white"
                    : "bg-white text-[#6B6B6B] hover:bg-[#051D67] hover:text-white border border-gray-200"
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Featured Post */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden mb-12">
            <div className="md:flex">
              <div className="md:w-1/2">
                <div className="h-64 md:h-full bg-gray-200 flex items-center justify-center">
                  <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              </div>
              <div className="md:w-1/2 p-8">
                <div className="flex items-center mb-4">
                  <span className="bg-[#051D67] text-white text-xs font-medium px-3 py-1 rounded-full">
                    Destacado
                  </span>
                  <span className="ml-4 text-sm text-[#6B6B6B]">15 Enero 2024</span>
                </div>
                <h2 className="text-2xl font-bold text-[#1F1915] mb-4">
                  {mockPosts[0].title}
                </h2>
                <p className="text-[#6B6B6B] mb-6">
                  {mockPosts[0].excerpt}
                </p>
                <button className="bg-[#051D67] hover:bg-[#041655] text-white px-6 py-2 rounded-md font-medium transition-colors">
                  Leer Más
                </button>
              </div>
            </div>
          </div>

          {/* Blog Posts Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {mockPosts.slice(1).map((post) => (
              <article key={post.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
                <div className="h-48 bg-gray-200 flex items-center justify-center">
                  <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <span className="bg-gray-100 text-[#6B6B6B] text-xs font-medium px-3 py-1 rounded-full">
                      {post.category}
                    </span>
                    <span className="text-sm text-[#6B6B6B]">
                      {new Date(post.date).toLocaleDateString('es-ES', { 
                        day: 'numeric', 
                        month: 'long', 
                        year: 'numeric' 
                      })}
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold text-[#1F1915] mb-2 line-clamp-2">
                    {post.title}
                  </h3>
                  <p className="text-[#6B6B6B] text-sm mb-4 line-clamp-3">
                    {post.excerpt}
                  </p>
                  <button className="text-[#051D67] hover:text-[#041655] font-medium text-sm transition-colors">
                    Leer más →
                  </button>
                </div>
              </article>
            ))}
          </div>

          {/* Load More Button */}
          <div className="text-center mt-12">
            <button className="border border-[#051D67] text-[#051D67] hover:bg-[#051D67] hover:text-white px-8 py-3 rounded-md font-medium transition-colors">
              Cargar Más Artículos
            </button>
          </div>

          {/* Newsletter Subscription */}
          <div className="bg-white rounded-lg p-12 shadow-sm border border-gray-200 mt-16">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-[#1F1915] mb-4">
                Suscríbete a Nuestro Newsletter
              </h2>
              <p className="text-lg text-[#6B6B6B] mb-8 max-w-2xl mx-auto">
                Recibe las últimas noticias, consejos y actualizaciones sobre comercio 
                internacional directamente en tu correo electrónico.
              </p>
              <div className="max-w-md mx-auto flex gap-4">
                <input
                  type="email"
                  placeholder="Tu correo electrónico"
                  className="flex-1 px-4 py-3 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-[#051D67]"
                />
                <button className="bg-[#051D67] hover:bg-[#041655] text-white px-6 py-3 rounded-md font-medium transition-colors whitespace-nowrap">
                  Suscribirse
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      <NordexFooterSection />
    </div>
  );
}