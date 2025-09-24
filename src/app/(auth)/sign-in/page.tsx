"use client";

import Link from "next/link";
import Image from "next/image";
import { UserAuthForm } from "@/components/auth/sign-in/components/user-auth-form";

export default function SignIn() {
  return (
    <div className="min-h-screen flex">
      {/* Left side - Login Form */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 bg-background">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <h2 className="mt-6 text-3xl font-bold tracking-tight">
              Bienvenido a <span className="text-[#051D67]">NORDEX</span>
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Accede a tu cuenta y gestiona tus operaciones de comercio
              internacional
            </p>
          </div>

          <UserAuthForm />

          <p className="text-center text-sm text-muted-foreground">
            ¿Nuevo en NORDEX?{" "}
            <Link
              href="/sign-up"
              className="font-medium text-[#051D67] hover:underline transition-colors"
            >
              Crear cuenta
            </Link>
          </p>
        </div>
      </div>

      {/* Right side - Hero Image */}
      <div className="hidden lg:flex flex-1 relative">
        <div className="absolute inset-0">
          <Image
            className="h-full w-full object-cover"
            src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800&h=600&fit=crop&auto=format"
            alt="NORDEX - Comercio Internacional"
            fill
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#051D67]/20 to-transparent" />
        </div>

        {/* Testimonials overlay */}
        <div className="relative z-10 flex items-end p-8 w-full">
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-6 shadow-lg max-w-md">
            <div className="flex items-center gap-4">
              <Image
                className="h-12 w-12 rounded-full object-cover"
                src="https://images.unsplash.com/photo-1494790108755-2616b612b1bb?w=100&h=100&fit=crop&crop=face&auto=format"
                alt="María González"
                width={48}
                height={48}
              />
              <div>
                <p className="font-semibold text-gray-900">María González</p>
                <p className="text-sm text-gray-600">CEO, TechBolivia</p>
              </div>
            </div>
            <p className="mt-4 text-gray-700 text-sm leading-relaxed">
              &ldquo;NORDEX facilitó nuestra expansión internacional de manera
              excepcional.&rdquo;
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
