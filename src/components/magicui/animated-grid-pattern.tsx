"use client";

import {
  type ComponentPropsWithoutRef,
  useEffect,
  useRef,
  useState,
  useCallback,
} from "react";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface GridPatternProps extends ComponentPropsWithoutRef<"svg"> {
  width?: number;
  height?: number;
  x?: number;
  y?: number;
  strokeDasharray?: string | number;
  numSquares?: number;
  className?: string;
  maxOpacity?: number;
  duration?: number;
}

export function AnimatedGridPattern({
  width = 40,
  height = 40,
  x = -1,
  y = -1,
  strokeDasharray = 0,
  numSquares = 50,
  className,
  maxOpacity = 0.5,
  duration = 4,
  ...props
}: GridPatternProps) {
  const containerRef = useRef<SVGSVGElement>(null);
  const [squares, setSquares] = useState<
    Array<{ id: number; pos: [number, number] }>
  >([]);
  const [isClient, setIsClient] = useState(false);

  const generateSquares = useCallback(() => {
    if (!containerRef.current || !isClient) return [];

    const rect = containerRef.current.getBoundingClientRect();
    const rows = Math.ceil(rect.height / height);
    const cols = Math.ceil(rect.width / width);

    return Array.from({ length: numSquares }, (_, i) => ({
      id: i,
      pos: [
        Math.floor(Math.random() * cols),
        Math.floor(Math.random() * rows),
      ] as [number, number],
    }));
  }, [height, width, numSquares, isClient]);

  // Set isClient to true after component mounts (client-side only)
  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) return;

    const generatedSquares = generateSquares();
    setSquares(generatedSquares);

    const interval = setInterval(() => {
      setSquares(generateSquares());
    }, duration * 1000);

    return () => {
      clearInterval(interval);
    };
  }, [generateSquares, duration, isClient]);

  return (
    <svg
      ref={containerRef}
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute inset-0 h-full w-full fill-gray-400/30 stroke-gray-400/30",
        className
      )}
      {...props}
    >
      <defs>
        <pattern
          id="grid-pattern"
          width={width}
          height={height}
          patternUnits="userSpaceOnUse"
          x={x}
          y={y}
        >
          <path
            d={`M.5 ${height}V.5H${width}`}
            fill="none"
            strokeDasharray={strokeDasharray}
          />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#grid-pattern)" />
      <svg x={x} y={y} className="overflow-visible">
        {isClient &&
          squares.map(({ pos, id }, index) => (
            <motion.rect
              initial={{ opacity: 0 }}
              animate={{ opacity: maxOpacity }}
              transition={{
                duration,
                repeat: 1,
                delay: index * 0.1,
                repeatType: "reverse",
              }}
              onAnimationComplete={() => {
                const updatedSquares = squares.filter((s) => s.id !== id);
                setSquares(updatedSquares);
              }}
              key={`${id}-${pos[0]}-${pos[1]}`}
              width={width - 1}
              height={height - 1}
              x={pos[0] * width + 1}
              y={pos[1] * height + 1}
              fill="currentColor"
              strokeWidth="0"
            />
          ))}
      </svg>
    </svg>
  );
}
