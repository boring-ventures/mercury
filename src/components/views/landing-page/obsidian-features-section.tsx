"use client";

import React, { useState } from "react";
import {
  Link,
  Share2,
  Layers,
  Puzzle,
  ArrowRight,
  Calendar,
  Kanban,
  Database,
  List,
  CheckSquare,
} from "lucide-react";

export default function ObsidianFeaturesSection() {
  const [activeFeature, setActiveFeature] = useState("links");

  const features = [
    {
      id: "links",
      title: "Links",
      description:
        "Create connections between your notes. Link anything and everything — ideas, people, places, books, and beyond. Invent your own personal Wikipedia.",
      icon: Link,
      demo: (
        <div className="bg-gray-900 text-white p-6 rounded-lg font-mono text-sm">
          <div className="mb-4">
            <div className="text-gray-400 mb-2">
              In Meditations on First Philosophy the philosopher René Descartes
              describes a series of doubts about the nature of reality, arriving
              at the famous phrase:
            </div>
            <div className="space-y-2">
              <div className="flex items-center">
                <span className="text-gray-400">- </span>
                <span className="text-[#051D67]">[[I thin]]</span>
              </div>
              <div className="ml-4 space-y-1">
                <div className="flex items-center">
                  <span className="text-gray-400">- </span>
                  <span className="text-white">**I thin**</span>
                  <span className="text-gray-400">k therefore I am</span>
                </div>
                <div className="flex items-center">
                  <span className="text-gray-400">- Just </span>
                  <span className="text-white">**thin**</span>
                  <span className="text-gray-400">k about it</span>
                </div>
                <div className="flex items-center">
                  <span className="text-gray-400">- </span>
                  <span className="text-white">**Thin**</span>
                  <span className="text-gray-400">king, Fast and Slow</span>
                </div>
              </div>
            </div>
            <div className="mt-4 text-gray-400">
              <div>Books/</div>
              <div className="ml-4">
                - The <span className="text-white">**Thin**</span>g
              </div>
              <div>Movies/</div>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "graph",
      title: "Graph",
      description:
        "Visualize the relationships between your notes. Find hidden patterns in your thinking through a visually engaging and interactive graph.",
      icon: Share2,
      demo: (
        <div className="bg-gradient-to-br from-[#051D67] to-black p-6 rounded-lg h-64 flex items-center justify-center relative overflow-hidden">
          <div className="absolute inset-0">
            {/* Simulated graph nodes */}
            <div className="absolute top-1/4 left-1/4 w-3 h-3 bg-white rounded-full"></div>
            <div className="absolute top-1/3 left-1/2 w-4 h-4 bg-gray-300 rounded-full"></div>
            <div className="absolute top-2/3 left-1/3 w-3 h-3 bg-white rounded-full"></div>
            <div className="absolute top-1/2 right-1/4 w-3 h-3 bg-gray-300 rounded-full"></div>
            <div className="absolute bottom-1/4 right-1/3 w-4 h-4 bg-white rounded-full"></div>

            {/* Simulated connections */}
            <svg className="absolute inset-0 w-full h-full">
              <line
                x1="25%"
                y1="25%"
                x2="50%"
                y2="33%"
                stroke="rgba(255, 255, 255, 0.5)"
                strokeWidth="2"
              />
              <line
                x1="50%"
                y1="33%"
                x2="33%"
                y2="67%"
                stroke="rgba(255, 255, 255, 0.5)"
                strokeWidth="2"
              />
              <line
                x1="33%"
                y1="67%"
                x2="75%"
                y2="50%"
                stroke="rgba(255, 255, 255, 0.5)"
                strokeWidth="2"
              />
              <line
                x1="75%"
                y1="50%"
                x2="67%"
                y2="75%"
                stroke="rgba(255, 255, 255, 0.5)"
                strokeWidth="2"
              />
            </svg>
          </div>

          <div className="relative z-10 text-white text-center">
            <div className="text-lg font-semibold mb-2">
              Interactive Knowledge Graph
            </div>
            <div className="text-sm text-gray-300">
              Discover connections between ideas
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "canvas",
      title: "Canvas",
      description:
        "An infinite space to research, brainstorm, diagram, and lay out your ideas. Canvas is a limitless playground for your mind.",
      icon: Layers,
      demo: (
        <div className="bg-gray-100 p-6 rounded-lg h-64 relative overflow-hidden">
          <div className="absolute top-4 left-4 bg-white p-3 rounded shadow-md">
            <div className="font-semibold text-sm mb-1">Lecture 1</div>
            <div className="text-xs text-gray-600">Philosophy 101</div>
          </div>

          <div className="absolute top-4 right-4 bg-yellow-100 p-3 rounded shadow-md">
            <div className="font-semibold text-sm mb-1">Rationalists</div>
            <div className="text-xs text-gray-600">vs. Empiricists</div>
          </div>

          <div className="absolute bottom-4 left-4 bg-blue-100 p-3 rounded shadow-md">
            <div className="font-semibold text-sm mb-1">Cogito, ergo sum</div>
            <div className="text-xs text-gray-600">
              "I think therefore I am"
            </div>
          </div>

          <div className="absolute bottom-4 right-4 bg-green-100 p-3 rounded shadow-md">
            <div className="font-semibold text-sm mb-1">Philosophers</div>
            <div className="text-xs text-gray-600">
              Descartes, Spinoza, Hume
            </div>
          </div>

          {/* Connection lines */}
          <svg className="absolute inset-0 w-full h-full">
            <line
              x1="25%"
              y1="25%"
              x2="75%"
              y2="25%"
              stroke="rgba(107, 114, 128, 0.3)"
              strokeWidth="2"
              strokeDasharray="5,5"
            />
            <line
              x1="25%"
              y1="75%"
              x2="75%"
              y2="75%"
              stroke="rgba(107, 114, 128, 0.3)"
              strokeWidth="2"
              strokeDasharray="5,5"
            />
            <line
              x1="50%"
              y1="25%"
              x2="50%"
              y2="75%"
              stroke="rgba(107, 114, 128, 0.3)"
              strokeWidth="2"
              strokeDasharray="5,5"
            />
          </svg>
        </div>
      ),
    },
    {
      id: "plugins",
      title: "Plugins",
      description:
        "Build your ideal thinking space. With thousands of plugins and our open API, it's easy to tailor Obsidian to fit your personal workflow.",
      icon: Puzzle,
      demo: (
        <div className="bg-white border rounded-lg p-6 space-y-4">
          <div className="text-lg font-semibold text-gray-900 mb-4">
            Community plugins
          </div>

          <div className="space-y-3">
            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <Calendar className="w-5 h-5 text-[#051D67]" />
              <div>
                <div className="font-semibold text-sm">
                  Calendar by Liam Cain
                </div>
                <div className="text-xs text-gray-600">
                  Calendar view of your daily notes.
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <Kanban className="w-5 h-5 text-black" />
              <div>
                <div className="font-semibold text-sm">
                  Kanban by Matthew Meyers
                </div>
                <div className="text-xs text-gray-600">
                  Markdown-backed kanban boards.
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <Database className="w-5 h-5 text-[#051D67]" />
              <div>
                <div className="font-semibold text-sm">
                  Dataview by Michael Brenan
                </div>
                <div className="text-xs text-gray-600">
                  Advanced queries for the data-obsessed.
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <List className="w-5 h-5 text-black" />
              <div>
                <div className="font-semibold text-sm">
                  Outliner by Viacheslav Slinko
                </div>
                <div className="text-xs text-gray-600">
                  Work with your lists.
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <CheckSquare className="w-5 h-5 text-[#051D67]" />
              <div>
                <div className="font-semibold text-sm">
                  Tasks by Martin Schenck and Clare Macrae
                </div>
                <div className="text-xs text-gray-600">
                  Track tasks across your entire vault.
                </div>
              </div>
            </div>
          </div>
        </div>
      ),
    },
  ];

  const activeFeatureData =
    features.find((f) => f.id === activeFeature) || features[0];

  return (
    <section className="bg-white py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-black mb-6">
            Spark ideas.
          </h2>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto">
            From personal notes to journaling, knowledge bases, and project
            management, Obsidian gives you the tools to come up with ideas and
            organize them.
          </p>
        </div>

        {/* Features Navigation */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {features.map((feature) => {
            const IconComponent = feature.icon;
            return (
              <button
                key={feature.id}
                onClick={() => setActiveFeature(feature.id)}
                className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${
                  activeFeature === feature.id
                    ? "bg-[#051D67] text-white shadow-lg"
                    : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
                }`}
              >
                <IconComponent className="w-5 h-5" />
                <span>{feature.title}</span>
              </button>
            );
          })}
        </div>

        {/* Active Feature Display */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Feature Description */}
          <div className="space-y-6">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                <activeFeatureData.icon className="w-6 h-6 text-[#051D67]" />
              </div>
              <h3 className="text-3xl font-bold text-black">
                {activeFeatureData.title}
              </h3>
            </div>

            <p className="text-lg text-gray-600 leading-relaxed">
              {activeFeatureData.description}
            </p>

            <a
              href={`https://obsidian.md/${activeFeatureData.id.toLowerCase()}`}
              className="inline-flex items-center text-[#051D67] hover:text-black font-semibold group"
            >
              Learn more
              <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
            </a>
          </div>

          {/* Feature Demo */}
          <div className="relative">
            <div className="transform hover:scale-105 transition-transform duration-300">
              {activeFeatureData.demo}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
