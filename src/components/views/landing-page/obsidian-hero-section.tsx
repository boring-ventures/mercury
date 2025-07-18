import React from "react";
import { Download, ArrowRight } from "lucide-react";

export default function ObsidianHeroSection() {
  return (
    <section className="bg-white text-black min-h-screen flex items-center">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          {/* Main Heading */}
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6 bg-gradient-to-r from-[#051D67] to-black bg-clip-text text-transparent">
            Sharpen your thinking.
          </h1>

          {/* Subtitle */}
          <p className="text-xl md:text-2xl lg:text-3xl text-gray-600 mb-8 max-w-4xl mx-auto">
            The free and flexible app for your private thoughts.
          </p>

          {/* Download Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <a
              href="https://github.com/obsidianmd/obsidian-releases/releases/download/v1.8.10/Obsidian-1.8.10.AppImage"
              className="inline-flex items-center justify-center px-8 py-4 bg-[#051D67] hover:bg-black rounded-lg text-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl text-white"
            >
              <Download className="w-5 h-5 mr-2" />
              Get Obsidian for Linux (AppImage)
            </a>

            <a
              href="https://obsidian.md/download"
              className="inline-flex items-center justify-center px-8 py-4 bg-white hover:bg-gray-50 border-2 border-[#051D67] rounded-lg text-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl text-[#051D67]"
            >
              More platforms
              <ArrowRight className="w-5 h-5 ml-2" />
            </a>
          </div>

          {/* Hero Image */}
          <div className="relative mx-auto max-w-6xl">
            <div className="relative z-10">
              <img
                src="https://obsidian.md/images/screenshot-1.0-hero-combo.png"
                alt="Obsidian App Screenshot"
                className="w-full h-auto rounded-lg shadow-2xl border border-gray-200"
              />
            </div>

            {/* Decorative elements */}
            <div className="absolute -top-4 -left-4 w-32 h-32 bg-[#051D67] rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
            <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-black rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-1000"></div>
          </div>
        </div>
      </div>
    </section>
  );
}
