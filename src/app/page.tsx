import NordexHeroSection from "@/components/views/landing-page/obsidian-hero-section";
import NordexBenefitsSection from "@/components/views/landing-page/obsidian-values-section";
import NordexProcessSection from "@/components/views/landing-page/obsidian-features-section";
import NordexCharacteristicsSection from "@/components/views/landing-page/obsidian-sync-section";
import NordexMetricsSection from "@/components/views/landing-page/obsidian-publish-section";
import NordexTestimonialsSection from "@/components/views/landing-page/obsidian-community-section";
import Header from "@/components/views/landing-page/Header";

export default function Home() {
  return (
    <div className="bg-white">
      <Header />
      <main className="bg-white">
        <NordexHeroSection />
        <NordexBenefitsSection />
        <NordexProcessSection />
        <NordexCharacteristicsSection />
        <NordexMetricsSection />
        <NordexTestimonialsSection />
      </main>
    </div>
  );
}
