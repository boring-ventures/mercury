import React from "react";
import { Shield, Brain, Lock, Download } from "lucide-react";

export default function ObsidianValuesSection() {
  const values = [
    {
      icon: Shield,
      title: "Your thoughts are yours.",
      description:
        "Obsidian stores notes privately on your device, so you can access them quickly, even offline. No one else can read them, not even us.",
      gradient: "from-[#051D67] to-black",
    },
    {
      icon: Brain,
      title: "Your mind is unique.",
      description:
        "With thousands of plugins and themes, you can shape Obsidian to fit your way of thinking.",
      gradient: "from-black to-[#051D67]",
    },
    {
      icon: Lock,
      title: "Your knowledge should last.",
      description:
        "Obsidian uses open file formats, so you're never locked in. You own your data for the long term.",
      gradient: "from-[#051D67] to-gray-700",
    },
  ];

  return (
    <section className="bg-white py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {values.map((value, index) => {
            const IconComponent = value.icon;
            return (
              <div
                key={index}
                className="text-center group hover:scale-105 transition-transform duration-300"
              >
                <div className="mb-6">
                  <div
                    className={`inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r ${value.gradient} mb-4 shadow-lg`}
                  >
                    <IconComponent className="w-8 h-8 text-white" />
                  </div>
                </div>

                <h3 className="text-2xl font-bold text-black mb-4 group-hover:text-[#051D67] transition-colors">
                  {value.title}
                </h3>

                <p className="text-gray-600 text-lg leading-relaxed">
                  {value.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* Free without limits CTA */}
        <div className="text-center mt-20">
          <div className="inline-flex items-center justify-center mb-6">
            <img
              src="https://obsidian.md/images/obsidian-logo-gradient.svg"
              alt="Obsidian Logo"
              className="w-16 h-16"
            />
          </div>

          <h2 className="text-3xl font-bold text-black mb-4">
            Free without limits.
          </h2>

          <a
            href="https://github.com/obsidianmd/obsidian-releases/releases/download/v1.8.10/Obsidian-1.8.10.AppImage"
            className="inline-flex items-center justify-center px-8 py-4 bg-[#051D67] hover:bg-black text-white rounded-lg text-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
          >
            <Download className="w-5 h-5 mr-2" />
            Download now
          </a>
        </div>
      </div>
    </section>
  );
}
