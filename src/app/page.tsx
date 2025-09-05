import NordexHeroSection from "@/components/views/landing-page/nordex-hero-section";
import NordexServicesSection from "@/components/views/landing-page/nordex-services-section";
import NordexNewsSection from "@/components/views/landing-page/nordex-news-section";
import NordexFooterSection from "@/components/views/landing-page/nordex-footer-section";
import NordexHeader from "@/components/views/landing-page/nordex-header";
import NordexTestimonialsSection from "@/components/views/landing-page/nordex-testimonials-section";
import { Features } from "@/components/features-9";

export default function Home() {
  return (
    <div className="bg-white">
      <NordexHeader />
      <main className="bg-white">
        <NordexHeroSection />
        <NordexServicesSection />
        <Features />
        <NordexTestimonialsSection />
        <NordexNewsSection />
        <NordexFooterSection />
      </main>
    </div>
  );
}
