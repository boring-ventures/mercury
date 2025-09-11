"use client";

import React, { useRef, useEffect } from "react";
import { cn } from "@/lib/utils";

interface WavesBackgroundProps {
  className?: string;
  lineColor?: string;
  backgroundColor?: string;
  waveSpeed?: number;
  amplitude?: number;
  frequency?: number;
  opacity?: number;
}

export function WavesBackground({
  className,
  lineColor = "rgba(255, 255, 255, 0.1)",
  backgroundColor = "transparent",
  waveSpeed = 0.02,
  amplitude = 50,
  frequency = 0.01,
  opacity = 0.3,
}: WavesBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | undefined>(undefined);
  const timeRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resizeCanvas = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * window.devicePixelRatio;
      canvas.height = rect.height * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };

    const drawWaves = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const rect = canvas.getBoundingClientRect();
      const width = rect.width;
      const height = rect.height;

      ctx.globalAlpha = opacity;
      ctx.strokeStyle = lineColor;
      ctx.lineWidth = 2;

      // Draw multiple wave layers
      for (let layer = 0; layer < 3; layer++) {
        ctx.beginPath();

        const layerAmplitude = amplitude * (1 - layer * 0.3);
        const layerFrequency = frequency * (1 + layer * 0.5);
        const layerSpeed = waveSpeed * (1 + layer * 0.2);

        for (let x = 0; x <= width; x += 2) {
          const y =
            height / 2 +
            Math.sin(x * layerFrequency + timeRef.current * layerSpeed) *
              layerAmplitude +
            Math.sin(
              x * layerFrequency * 2 + timeRef.current * layerSpeed * 1.5
            ) *
              (layerAmplitude * 0.5) +
            Math.sin(
              x * layerFrequency * 0.5 + timeRef.current * layerSpeed * 0.8
            ) *
              (layerAmplitude * 0.7);

          if (x === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }

        ctx.stroke();
      }

      timeRef.current += 1;
      animationRef.current = requestAnimationFrame(drawWaves);
    };

    const handleResize = () => {
      resizeCanvas();
    };

    window.addEventListener("resize", handleResize);
    resizeCanvas();
    drawWaves();

    return () => {
      window.removeEventListener("resize", handleResize);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [lineColor, backgroundColor, waveSpeed, amplitude, frequency, opacity]);

  return (
    <canvas
      ref={canvasRef}
      className={cn(
        "absolute inset-0 w-full h-full pointer-events-none",
        className
      )}
      style={{ backgroundColor }}
    />
  );
}
