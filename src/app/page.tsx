import NordexHeroSection from "@/components/views/landing-page/obsidian-hero-section";
import NordexSocialProofSection from "@/components/views/landing-page/obsidian-values-section";
import NordexMetricsSection from "@/components/views/landing-page/obsidian-features-section";
import NordexServicesSection from "@/components/views/landing-page/obsidian-sync-section";
import NordexBannerSection from "@/components/views/landing-page/obsidian-publish-section";
import NordexCharacteristicsSection from "@/components/views/landing-page/obsidian-community-section";
import NordexAboutSection from "@/components/views/landing-page/About.tsx";
import NordexNewsSection from "@/components/views/landing-page/Features.tsx";
import NordexFooterSection from "@/components/views/landing-page/Footer.tsx";
import Header from "@/components/views/landing-page/Header";

export default function Home() {
  return (
    <div className="bg-[#FCFDFD]">
      <Header />
      <main className="bg-[#FCFDFD]">
        <NordexHeroSection />
        <NordexSocialProofSection />
        <NordexMetricsSection />
        <NordexServicesSection />
        <NordexBannerSection />
        <NordexCharacteristicsSection />
        <NordexAboutSection />
        <NordexNewsSection />
        <NordexFooterSection />
      </main>
    </div>
  );
}
