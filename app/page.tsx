import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Stats from "../components/Stats";
import CityOverview from "../components/CityOverview";
import ExperienceTower from "../components/ExperienceTower";
import DataCenter from "../components/DataCenter";
import CreativeStudio from "../components/CreativeStudio";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#050816] text-white">
      <Navbar />
      <Hero />
      <Stats />
      <CityOverview />
      <ExperienceTower />
      <DataCenter />
      <CreativeStudio
        limit={6}
        showViewAll
      />
    </main>
  );
}