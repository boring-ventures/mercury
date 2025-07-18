import ObsidianHeroSection from "@/components/views/landing-page/obsidian-hero-section";
import ObsidianValuesSection from "@/components/views/landing-page/obsidian-values-section";
import ObsidianFeaturesSection from "@/components/views/landing-page/obsidian-features-section";
import ObsidianSyncSection from "@/components/views/landing-page/obsidian-sync-section";
import ObsidianPublishSection from "@/components/views/landing-page/obsidian-publish-section";
import ObsidianCommunitySection from "@/components/views/landing-page/obsidian-community-section";
import Header from "@/components/views/landing-page/Header";

export default function Home() {
  return (
    <div className="bg-white">
      <Header />
      <main className="bg-white">
        <ObsidianHeroSection />
        <ObsidianValuesSection />
        <ObsidianFeaturesSection />
        <ObsidianSyncSection />
        <ObsidianPublishSection />
        <ObsidianCommunitySection />
      </main>
    </div>
  );
}
