import type React from "react";

interface ImportadorLayoutProps {
  children: React.ReactNode;
}

export default function ImportadorLayout({ children }: ImportadorLayoutProps) {
  return (
    <div className="flex-1 p-6">
      <div className="max-w-7xl mx-auto">{children}</div>
    </div>
  );
}
