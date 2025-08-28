import NordexHeroSection from "@/components/views/landing-page/obsidian-hero-section";
import { SocialProofSection } from "@/components/views/landing-page/social-proof-section";
import NordexMetricsSection from "@/components/views/landing-page/obsidian-metrics-section";
import NordexServicesSection from "@/components/views/landing-page/obsidian-sync-section";
import NordexBannerSection from "@/components/views/landing-page/obsidian-publish-section";
import NordexCharacteristicsSection from "@/components/views/landing-page/obsidian-community-section";
import NordexAboutSection from "@/components/views/landing-page/About";
import NordexNewsSection from "@/components/views/landing-page/Features";
import NordexFooterSection from "@/components/views/landing-page/Footer";
import Header from "@/components/views/landing-page/Header";

export default function Home() {
  return (
    <div className="bg-[#FCFDFD]">
      <Header />
      <main className="bg-[#FCFDFD]">
        <NordexHeroSection />
        <SocialProofSection />
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
