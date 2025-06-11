import Image from "next/image";
import { AnimatedGridPattern } from "@/components/magicui/animated-grid-pattern";

interface Props {
  children: React.ReactNode;
}

export default function AuthLayout({ children }: Props) {
  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center bg-background p-4 overflow-hidden">
      {/* Animated Grid Pattern Background */}
      <AnimatedGridPattern
        numSquares={30}
        maxOpacity={0.1}
        duration={3}
        className="absolute inset-0 [mask-image:radial-gradient(80%_80%_at_center,white,transparent)]"
      />

      {/* Content */}
      <div className="relative z-10 w-full max-w-md space-y-6">
        <div className="flex flex-col items-center space-y-4">
          <div className="flex items-center gap-3">
            <div className="relative w-12 h-12">
              <Image
                src="/logo.svg"
                alt="Mercury Logo"
                fill
                className="object-contain"
              />
            </div>
            <h1 className="text-2xl font-bold text-foreground">MERCURY</h1>
          </div>
          <p className="text-center text-muted-foreground text-sm max-w-sm">
            Plataforma especializada para gestión de envíos internacionales
          </p>
        </div>
        {children}
      </div>
    </div>
  );
}
