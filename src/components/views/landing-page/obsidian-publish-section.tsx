import React from "react";
import { Edit, Palette, Zap, ArrowRight, Globe } from "lucide-react";

export default function ObsidianPublishSection() {
  const features = [
    {
      icon: Edit,
      title: "Seamless editing.",
      description:
        "Publish your notes instantly from the Obsidian app, and make it easy for readers to explore your web of ideas.",
      color: "from-[#051D67] to-black",
    },
    {
      icon: Palette,
      title: "Customization.",
      description:
        "Control the look and feel of your site with themes, custom domains, password protection, and more.",
      color: "from-black to-[#051D67]",
    },
    {
      icon: Zap,
      title: "Optimized for performance.",
      description:
        "Obsidian Publish sites are fast, mobile-friendly, and optimized for SEO, no configuration required.",
      color: "from-[#051D67] to-gray-700",
    },
  ];

  return (
    <section className="bg-white py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-black mb-6">
            Publish instantly.
          </h2>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto">
            Turn your notes into an online wiki, knowledge base, documentation,
            or digital garden.{" "}
            <a
              href="https://obsidian.md/publish"
              className="text-[#051D67] hover:text-black underline"
            >
              Learn more.
            </a>
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Features List */}
          <div className="space-y-8">
            {features.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <div key={index} className="flex items-start space-x-4 group">
                  <div
                    className={`flex-shrink-0 w-12 h-12 rounded-lg bg-gradient-to-r ${feature.color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}
                  >
                    <IconComponent className="w-6 h-6 text-white" />
                  </div>

                  <div>
                    <h3 className="text-xl font-bold text-black mb-2 group-hover:text-[#051D67] transition-colors">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Example Site Screenshot */}
          <div className="relative">
            <div className="bg-white rounded-lg shadow-2xl overflow-hidden transform hover:scale-105 transition-transform duration-300 border border-gray-200">
              <img
                src="https://obsidian.md/images/publish-example-dark.png"
                alt="Example of Obsidian Help site powered by Obsidian Publish"
                className="w-full h-auto"
              />
            </div>

            {/* Decorative elements */}
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-[#051D67] rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
            <div className="absolute -bottom-4 -left-4 w-24 h-24 bg-black rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-700"></div>
          </div>
        </div>

        {/* Example Site Link */}
        <div className="text-center mt-16">
          <div className="inline-flex items-center justify-center space-x-2 bg-white border border-gray-200 rounded-lg px-6 py-3 shadow-sm hover:shadow-md transition-shadow">
            <Globe className="w-5 h-5 text-[#051D67]" />
            <span className="text-gray-700">Explore the </span>
            <a
              href="https://help.obsidian.md/"
              className="text-[#051D67] hover:text-black font-semibold underline"
            >
              Obsidian Help
            </a>
            <span className="text-gray-700"> site, powered by </span>
            <a
              href="https://obsidian.md/publish"
              className="text-[#051D67] hover:text-black font-semibold underline"
            >
              Obsidian Publish
            </a>
            <span className="text-gray-700">.</span>
          </div>
        </div>

        {/* Performance Metrics */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="text-3xl font-bold text-[#051D67] mb-2">⚡</div>
            <div className="text-sm text-gray-600">Lightning fast loading</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-[#051D67] mb-2">📱</div>
            <div className="text-sm text-gray-600">Mobile responsive</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-[#051D67] mb-2">🔍</div>
            <div className="text-sm text-gray-600">SEO optimized</div>
          </div>
        </div>
      </div>
    </section>
  );
}
