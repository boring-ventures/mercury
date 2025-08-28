"use client";
import React, { useEffect, useRef, useState, useMemo } from "react";
import { motion, useAnimation } from "framer-motion";

interface LogoItem {
  node?: React.ReactNode;
  src?: string;
  alt?: string;
  href?: string;
  title?: string;
}

interface LogoLoopProps {
  logos: LogoItem[];
  speed?: number;
  direction?: "left" | "right";
  logoHeight?: number;
  gap?: number;
  pauseOnHover?: boolean;
  scaleOnHover?: boolean;
  fadeOut?: boolean;
  fadeOutColor?: string;
  ariaLabel?: string;
}

export default function LogoLoop({
  logos,
  speed = 80,
  direction = "left",
  logoHeight = 80,
  gap = 80,
  pauseOnHover = false,
  scaleOnHover = false,
  fadeOut = false,
  fadeOutColor = "#ffffff",
  ariaLabel = "Logo loop",
}: LogoLoopProps) {
  const [isHovered, setIsHovered] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const controls = useAnimation();

  // Create multiple copies of logos for seamless infinite loop using useMemo
  const duplicatedLogos = useMemo(
    () => [...logos, ...logos, ...logos, ...logos, ...logos],
    [logos]
  );

  useEffect(() => {
    const animate = async () => {
      if (isHovered && pauseOnHover) return;

      // Calculate total width of all logos
      const totalWidth = duplicatedLogos.length * (gap + logoHeight);

      // Calculate duration based on speed and total width
      const duration = totalWidth / speed;

      await controls.start({
        x: direction === "left" ? -totalWidth : totalWidth,
        transition: {
          duration,
          ease: "linear",
          repeat: Infinity,
        },
      });
    };

    animate();
  }, [
    controls,
    duplicatedLogos,
    gap,
    logoHeight,
    speed,
    direction,
    isHovered,
    pauseOnHover,
  ]);

  return (
    <div
      ref={containerRef}
      className="relative w-full overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      aria-label={ariaLabel}
    >
      {fadeOut && (
        <>
          <div
            className="absolute left-0 top-0 bottom-0 w-32 z-10 pointer-events-none"
            style={{
              background: `linear-gradient(to right, ${fadeOutColor}, transparent)`,
            }}
          />
          <div
            className="absolute right-0 top-0 bottom-0 w-32 z-10 pointer-events-none"
            style={{
              background: `linear-gradient(to left, ${fadeOutColor}, transparent)`,
            }}
          />
        </>
      )}

      <motion.div
        className="flex items-center"
        style={{ gap: `${gap}px` }}
        animate={controls}
        initial={{ x: 0 }}
      >
        {duplicatedLogos.map((logo, index) => (
          <motion.div
            key={index}
            className="flex-shrink-0"
            style={{ height: `${logoHeight}px`, minWidth: `${logoHeight}px` }}
            whileHover={scaleOnHover ? { scale: 1.1 } : {}}
            transition={{ duration: 0.2 }}
          >
            {logo.href ? (
              <a
                href={logo.href}
                target="_blank"
                rel="noopener noreferrer"
                className="block h-full w-full flex items-center justify-center"
                title={logo.title || logo.alt}
              >
                {logo.node ? (
                  <div className="text-6xl text-[#051D67]">{logo.node}</div>
                ) : (
                  <img
                    src={logo.src}
                    alt={logo.alt || logo.title}
                    className="h-full w-full object-contain"
                  />
                )}
              </a>
            ) : (
              <div className="h-full w-full flex items-center justify-center">
                {logo.node ? (
                  <div className="text-6xl text-[#051D67]">{logo.node}</div>
                ) : (
                  <img
                    src={logo.src}
                    alt={logo.alt || logo.title}
                    className="h-full w-full object-contain"
                  />
                )}
              </div>
            )}
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
