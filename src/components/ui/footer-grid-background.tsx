"use client";

import React from "react";
import { cn } from "@/lib/utils";
import AnimatedGridPattern from "@/components/magicui/animated-grid-pattern";

interface FooterGridBackgroundProps {
  className?: string;
}

export default function FooterGridBackground({ className }: FooterGridBackgroundProps) {
  return (
    <AnimatedGridPattern
      numSquares={25} // Increased for better coverage
      maxOpacity={0.06} // Slightly reduced opacity for subtlety
      duration={4}
      repeatDelay={1}
      className={cn(
        "inset-0 h-full w-full",
        "absolute z-0 will-change-transform",
        className
      )}
    />
  );
}