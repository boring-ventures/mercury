"use client";

import type { Metadata } from "next";
import { SignInPage } from "@/components/sign-in";
import { useRouter } from "next/navigation";

const testimonials = [
  {
    avatarSrc: "https://images.unsplash.com/photo-1494790108755-2616b612b1bb?w=100&h=100&fit=crop&crop=face&auto=format",
    name: "María González",
    handle: "CEO, TechBolivia",
    text: "NORDEX facilitó nuestra expansión internacional de manera excepcional."
  },
  {
    avatarSrc: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face&auto=format", 
    name: "Carlos Mendoza",
    handle: "Director, InnovaTextil",
    text: "Los procesos de importación nunca fueron tan sencillos y transparentes."
  },
  {
    avatarSrc: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face&auto=format",
    name: "Ana Rodríguez",
    handle: "Gerente, AlimentosPlus",
    text: "Excelente servicio y seguimiento personalizado en cada operación."
  }
];

export default function SignIn() {
  const router = useRouter();

  const handleSignIn = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // Aquí iría la lógica de autenticación
    console.log("Initiating sign in...");
  };

  const handleGoogleSignIn = () => {
    // Aquí iría la lógica de Google OAuth
    console.log("Google sign in...");
  };

  const handleResetPassword = () => {
    router.push("/reset-password");
  };

  const handleCreateAccount = () => {
    router.push("/sign-up");
  };

  return (
    <SignInPage
      title={
        <span className="font-light text-[#1F1915] tracking-tighter">
          Bienvenido a <span className="font-bold text-[#051D67]">NORDEX</span>
        </span>
      }
      description="Accede a tu cuenta y gestiona tus operaciones de comercio internacional"
      heroImageSrc="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800&h=600&fit=crop&auto=format"
      testimonials={testimonials}
      onSignIn={handleSignIn}
      onGoogleSignIn={handleGoogleSignIn}
      onResetPassword={handleResetPassword}
      onCreateAccount={handleCreateAccount}
    />
  );
}
