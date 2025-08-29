import NordexHeroSection from "@/components/views/landing-page/nordex-hero-section";
import NordexServicesSection from "@/components/views/landing-page/nordex-services-section";
import NordexAboutSection from "@/components/views/landing-page/nordex-about-section";
import NordexNewsSection from "@/components/views/landing-page/nordex-news-section";
import NordexFooterSection from "@/components/views/landing-page/nordex-footer-section";
import NordexHeader from "@/components/views/landing-page/nordex-header";

export default function Home() {
  return (
    <div className="bg-white">
      <NordexHeader />
      <main className="bg-white">
        <NordexHeroSection />
        <NordexServicesSection />
        <NordexAboutSection />
        <NordexNewsSection />
        <NordexFooterSection />
      </main>
    </div>
  );
}
