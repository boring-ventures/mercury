import React from "react";
import { Shield, Settings, Clock, Users, ArrowRight } from "lucide-react";

export default function ObsidianSyncSection() {
  const features = [
    {
      icon: Settings,
      title: "Fine-grained control.",
      description:
        "Decide which files and preferences you want to sync to which devices.",
      image: "https://obsidian.md/images/sync-settings.png",
    },
    {
      icon: Clock,
      title: "Version history.",
      description:
        "Easily track changes between revisions, with one year of version history for every note.",
      image: "https://obsidian.md/images/sync-diff.png",
    },
    {
      icon: Users,
      title: "Collaboration.",
      description:
        "Work with your team on shared files without compromising your private data.",
      image: "https://obsidian.md/images/sync-share.png",
    },
  ];

  return (
    <section className="bg-white py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-black mb-6">
            Sync securely.
          </h2>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto">
            Access your notes on any device, secured with end-to-end encryption.{" "}
            <a
              href="https://obsidian.md/sync"
              className="text-[#051D67] hover:text-black underline"
            >
              Learn more.
            </a>
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mb-16">
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <div key={index} className="text-center group">
                <div className="mb-6">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4 group-hover:bg-gray-200 transition-colors">
                    <IconComponent className="w-8 h-8 text-[#051D67]" />
                  </div>
                </div>

                <h3 className="text-2xl font-bold text-black mb-4">
                  {feature.title}
                </h3>

                <p className="text-gray-600 text-lg leading-relaxed">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* Screenshots Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="group">
              <div className="bg-gray-100 rounded-lg p-4 mb-4 transform hover:scale-105 transition-transform duration-300">
                <img
                  src={feature.image}
                  alt={`${feature.title} screenshot`}
                  className="w-full h-auto rounded-lg shadow-md"
                />
              </div>
              <div className="text-center">
                <h4 className="font-semibold text-black mb-2">
                  {feature.title}
                </h4>
                <p className="text-sm text-gray-600">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Security Badge */}
        <div className="text-center mt-16">
          <div className="inline-flex items-center justify-center space-x-2 bg-[#051D67] text-white px-6 py-3 rounded-full">
            <Shield className="w-5 h-5" />
            <span className="font-semibold">End-to-end encrypted</span>
          </div>
        </div>
      </div>
    </section>
  );
}
