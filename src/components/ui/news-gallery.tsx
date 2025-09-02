"use client";

import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface NewsItem {
  id: number;
  title: string;
  excerpt: string;
  date: string;
  category: string;
  image: string;
  slug: string;
}

interface NewsGalleryProps {
  items: NewsItem[];
  heading?: string;
}

export function NewsGallery({ items, heading = "Últimas Noticias" }: NewsGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const itemsPerView = 3;
  const maxIndex = Math.max(0, items.length - itemsPerView);

  const canScrollPrev = currentIndex > 0;
  const canScrollNext = currentIndex < maxIndex;

  const scrollPrev = () => {
    setCurrentIndex(Math.max(0, currentIndex - 1));
  };

  const scrollNext = () => {
    setCurrentIndex(Math.min(maxIndex, currentIndex + 1));
  };

  const visibleItems = items.slice(currentIndex, currentIndex + itemsPerView);

  return (
    <section className="py-16">
      <div className="flex items-center justify-between mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-[#262626] font-sans">
          {heading}
        </h2>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={scrollPrev}
            disabled={!canScrollPrev}
            className="h-10 w-10 rounded-full border-[#051D67] text-[#051D67] hover:bg-[#051D67] hover:text-white disabled:opacity-50"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={scrollNext}
            disabled={!canScrollNext}
            className="h-10 w-10 rounded-full border-[#051D67] text-[#051D67] hover:bg-[#051D67] hover:text-white disabled:opacity-50"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {visibleItems.map((item) => (
          <article
            key={item.id}
            className="group cursor-pointer bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
          >
            <div className="aspect-video bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center overflow-hidden">
              <div className="w-full h-full bg-gradient-to-br from-[#051D67]/10 to-[#81D843]/10 flex items-center justify-center">
                <svg className="w-12 h-12 text-[#051D67]/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
            
            <div className="p-6">
              <div className="flex items-center justify-between mb-3">
                <span className="bg-[#051D67]/10 text-[#051D67] text-xs font-medium px-3 py-1 rounded-full">
                  {item.category}
                </span>
                <span className="text-sm text-[#6B6B6B]">
                  {new Date(item.date).toLocaleDateString('es-ES', { 
                    day: 'numeric', 
                    month: 'long', 
                    year: 'numeric' 
                  })}
                </span>
              </div>
              
              <h3 className="text-lg font-semibold font-sans text-[#262626] mb-3 line-clamp-2 group-hover:text-[#051D67] transition-colors">
                {item.title}
              </h3>
              
              <p className="text-[#6B6B6B] font-serif text-sm mb-4 line-clamp-3">
                {item.excerpt}
              </p>
              
              <div className="flex items-center text-[#051D67] hover:text-[#041655] font-medium text-sm transition-colors">
                Leer más
                <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </article>
        ))}
      </div>

      {items.length > itemsPerView && (
        <div className="flex justify-center mt-8">
          <div className="flex items-center gap-2">
            {Array.from({ length: Math.ceil(items.length / itemsPerView) }, (_, i) => (
              <button
                key={i}
                onClick={() => setCurrentIndex(i * itemsPerView)}
                className={`w-2 h-2 rounded-full transition-colors ${
                  Math.floor(currentIndex / itemsPerView) === i
                    ? "bg-[#051D67]"
                    : "bg-gray-300 hover:bg-gray-400"
                }`}
              />
            ))}
          </div>
        </div>
      )}
    </section>
  );
}