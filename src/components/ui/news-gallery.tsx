"use client";

import React, { useState, useEffect } from "react";
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
  const [itemsPerView, setItemsPerView] = useState(3);

  // Update items per view based on screen size
  React.useEffect(() => {
    const updateItemsPerView = () => {
      if (window.innerWidth < 640) {
        setItemsPerView(1);
      } else if (window.innerWidth < 1024) {
        setItemsPerView(2);
      } else {
        setItemsPerView(3);
      }
    };

    updateItemsPerView();
    window.addEventListener('resize', updateItemsPerView);
    return () => window.removeEventListener('resize', updateItemsPerView);
  }, []);

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
    <section className="py-8 sm:py-12 lg:py-16">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 sm:mb-10 lg:mb-12">
        <h2 className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-bold text-[#262626] font-sans">
          {heading}
        </h2>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={scrollPrev}
            disabled={!canScrollPrev}
            className="h-8 w-8 sm:h-10 sm:w-10 lg:h-12 lg:w-12 rounded-full border-[#051D67] text-[#051D67] hover:bg-[#051D67] hover:text-white disabled:opacity-50"
          >
            <ChevronLeft className="h-3 w-3 sm:h-4 sm:w-4 lg:h-5 lg:w-5" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={scrollNext}
            disabled={!canScrollNext}
            className="h-8 w-8 sm:h-10 sm:w-10 lg:h-12 lg:w-12 rounded-full border-[#051D67] text-[#051D67] hover:bg-[#051D67] hover:text-white disabled:opacity-50"
          >
            <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4 lg:h-5 lg:w-5" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
        {visibleItems.map((item) => (
          <article
            key={item.id}
            className="group cursor-pointer bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
          >
            <div className="aspect-video bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center overflow-hidden">
              <div className="w-full h-full bg-gradient-to-br from-[#051D67]/10 to-[#81D843]/10 flex items-center justify-center">
                <svg className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 text-[#051D67]/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
            
            <div className="p-4 sm:p-5 lg:p-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-3 mb-3">
                <span className="bg-[#051D67]/10 text-[#051D67] text-xs sm:text-sm font-medium px-2 py-1 sm:px-3 sm:py-1 rounded-full w-fit">
                  {item.category}
                </span>
                <span className="text-xs sm:text-sm lg:text-base text-[#6B6B6B]">
                  {new Date(item.date).toLocaleDateString('es-ES', { 
                    day: 'numeric', 
                    month: 'long', 
                    year: 'numeric' 
                  })}
                </span>
              </div>
              
              <h3 className="text-base sm:text-lg lg:text-xl font-semibold font-sans text-[#262626] mb-2 sm:mb-3 line-clamp-2 group-hover:text-[#051D67] transition-colors">
                {item.title}
              </h3>
              
              <p className="text-[#6B6B6B] font-serif text-xs sm:text-sm lg:text-base mb-3 sm:mb-4 line-clamp-3">
                {item.excerpt}
              </p>
              
              <div className="flex items-center text-[#051D67] hover:text-[#041655] font-medium text-xs sm:text-sm lg:text-base transition-colors">
                Leer más
                <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4 ml-1 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </article>
        ))}
      </div>

      {items.length > itemsPerView && (
        <div className="flex justify-center mt-6 sm:mt-8 lg:mt-10">
          <div className="flex items-center gap-2 sm:gap-3">
            {Array.from({ length: Math.ceil(items.length / itemsPerView) }, (_, i) => (
              <button
                key={i}
                onClick={() => setCurrentIndex(i * itemsPerView)}
                className={`w-2 h-2 sm:w-2.5 sm:h-2.5 lg:w-3 lg:h-3 rounded-full transition-colors ${
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