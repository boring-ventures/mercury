"use client";
import React from "react";
import { World } from "./globe";

export function GlobeDemo() {
  const globeConfig = {
    pointSize: 4,
    globeColor: "#051D67",
    showAtmosphere: true,
    atmosphereColor: "#81D843",
    atmosphereAltitude: 0.1,
    emissive: "#051D67",
    emissiveIntensity: 0.1,
    shininess: 0.9,
    polygonColor: "rgba(129, 216, 67, 0.7)",
    ambientLight: "#81D843",
    directionalLeftLight: "#ffffff",
    directionalTopLight: "#ffffff",
    pointLight: "#ffffff",
    arcTime: 2000,
    arcLength: 0.9,
    rings: 1,
    maxRings: 3,
    initialPosition: { lat: -16.5, lng: -68.1 }, // La Paz, Bolivia
    autoRotate: true,
    autoRotateSpeed: 0.5,
  };

  const sampleArcs = [
    {
      order: 1,
      startLat: -16.5,
      startLng: -68.1,
      endLat: 40.7128,
      endLng: -74.006,
      arcAlt: 0.1,
      color: "#81D843",
    },
    {
      order: 1,
      startLat: -16.5,
      startLng: -68.1,
      endLat: 51.5072,
      endLng: -0.1276,
      arcAlt: 0.2,
      color: "#051D67",
    },
    {
      order: 1,
      startLat: -16.5,
      startLng: -68.1,
      endLat: 35.6762,
      endLng: 139.6503,
      arcAlt: 0.5,
      color: "#FCFDFD",
    },
    {
      order: 2,
      startLat: -16.5,
      startLng: -68.1,
      endLat: -22.9068,
      endLng: -43.1729,
      arcAlt: 0.2,
      color: "#81D843",
    },
    {
      order: 2,
      startLat: -16.5,
      startLng: -68.1,
      endLat: 28.6139,
      endLng: 77.209,
      arcAlt: 0.3,
      color: "#051D67",
    },
    {
      order: 2,
      startLat: -16.5,
      startLng: -68.1,
      endLat: -33.8688,
      endLng: 151.2093,
      arcAlt: 0.3,
      color: "#FCFDFD",
    },
    {
      order: 3,
      startLat: -16.5,
      startLng: -68.1,
      endLat: 48.8566,
      endLng: 2.3522,
      arcAlt: 0.3,
      color: "#81D843",
    },
    {
      order: 3,
      startLat: -16.5,
      startLng: -68.1,
      endLat: 52.52,
      endLng: 13.405,
      arcAlt: 0.3,
      color: "#051D67",
    },
    {
      order: 3,
      startLat: -16.5,
      startLng: -68.1,
      endLat: 37.7749,
      endLng: -122.4194,
      arcAlt: 0.3,
      color: "#FCFDFD",
    },
  ];

  return (
    <div className="w-full h-full relative">
      <World data={sampleArcs} globeConfig={globeConfig} />
    </div>
  );
}
