import React from "react";
import {
  Download,
  MessageCircle,
  FileText,
  Code,
  ArrowRight,
  Users,
  BookOpen,
  Wrench,
} from "lucide-react";

export default function ObsidianCommunitySection() {
  const communityOptions = [
    {
      icon: MessageCircle,
      title: "Join us on Discord",
      description:
        "Get help, ask questions, meet other Obsidian users, and learn about their setup.",
      link: "https://discord.gg/obsidianmd",
      color: "from-[#051D67] to-black",
      bgColor: "bg-indigo-50",
    },
    {
      icon: FileText,
      title: "Discussion forum",
      description:
        "Post feature requests, report bugs, and explore in-depth discussions about knowledge management.",
      link: "https://forum.obsidian.md/",
      color: "from-black to-[#051D67]",
      bgColor: "bg-green-50",
    },
    {
      icon: Code,
      title: "Developer docs",
      description:
        "Learn how to build your own Obsidian plugins and themes, using our open API and documentation.",
      link: "https://docs.obsidian.md/",
      color: "from-[#051D67] to-gray-700",
      bgColor: "bg-orange-50",
    },
  ];

  return (
    <section className="bg-gradient-to-br from-[#051D67] via-black to-gray-900 text-white py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main CTA */}
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-6xl font-bold mb-8 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
            It's your time to shine.
          </h2>

          <a
            href="https://obsidian.md/download"
            className="inline-flex items-center justify-center px-12 py-4 bg-white hover:bg-gray-100 text-[#051D67] rounded-lg text-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
          >
            <Download className="w-6 h-6 mr-3" />
            Get Obsidian
          </a>
        </div>

        {/* Community Options */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {communityOptions.map((option, index) => {
            const IconComponent = option.icon;
            return (
              <a
                key={index}
                href={option.link}
                className="group block bg-white/10 backdrop-blur-sm rounded-xl p-8 hover:bg-white/20 transition-all duration-300 transform hover:scale-105 hover:shadow-xl border border-white/20"
              >
                <div className="flex items-center space-x-4 mb-6">
                  <div
                    className={`w-12 h-12 rounded-lg bg-gradient-to-r ${option.color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}
                  >
                    <IconComponent className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white group-hover:text-gray-300 transition-colors">
                    {option.title}
                  </h3>
                </div>

                <p className="text-gray-300 leading-relaxed mb-6">
                  {option.description}
                </p>

                <div className="flex items-center text-gray-300 group-hover:text-white transition-colors">
                  <span className="text-sm font-medium">Learn more</span>
                  <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                </div>
              </a>
            );
          })}
        </div>

        {/* Additional Info */}
        <div className="text-center mt-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex items-center justify-center space-x-2">
              <Users className="w-5 h-5 text-gray-300" />
              <span className="text-gray-300">Active community</span>
            </div>
            <div className="flex items-center justify-center space-x-2">
              <BookOpen className="w-5 h-5 text-gray-300" />
              <span className="text-gray-300">Extensive documentation</span>
            </div>
            <div className="flex items-center justify-center space-x-2">
              <Wrench className="w-5 h-5 text-gray-300" />
              <span className="text-gray-300">Open source plugins</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
