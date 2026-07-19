"use client";

import { useEffect, useState } from "react";

import LoadingScreen from "@/components/LoadingScreen";
import CursorGlow from "@/components/CursorGlow";
import AnimatedBackground from "@/components/Background/AnimatedBackground";

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
import Footer from "@/components/Footer";

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (isLoading) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isLoading]);

  return (
    <>
      <LoadingScreen isLoading={isLoading} />
      <CursorGlow />
      <AnimatedBackground />

      <main className="relative z-10 min-h-screen text-white">
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
        <Footer />
        <BackToTop />
      </main>
    </>
  );
}