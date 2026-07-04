import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Stats from "../components/Stats";
import CityOverview from "../components/CityOverview";
import ExperienceTower from "../components/ExperienceTower";
import DataCenter from "../components/DataCenter";
import CreativeStudio from "../components/CreativeStudio";
import FutureLab from "@/components/FutureLab";
import ContactCenter from "../components/ContactCenter";
import ScrollProgress from "../components/ScrollProgress";
import BackToTop from "../components/BackToTop";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#050816] text-white">
      <Navbar />
      <ScrollProgress />
      <Hero />
      <Stats />
      <CityOverview />
      <ExperienceTower />
      <DataCenter />
      <CreativeStudio
        limit={6}
        showViewAll
      />
      <FutureLab />
      <ContactCenter />
      <BackToTop />
    </main>
  );
}