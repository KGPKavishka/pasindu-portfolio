"use client";

import { useEffect, useState } from "react";

import CityOverview from "@/components/CityOverview";
import ContactCenter from "@/components/ContactCenter";
import CreativeStudio from "@/components/CreativeStudio";
import DataCenter from "@/components/DataCenter";
import ExperienceTower from "@/components/ExperienceTower";
import Footer from "@/components/Footer";
import FutureLab from "@/components/FutureLab";
import Hero from "@/components/Hero";
import DescentEffects from "@/components/Journey/DescentEffects";
import EvaManifest from "@/components/Journey/EvaManifest";
import EvaSoundController from "@/components/Journey/EvaSoundController";
import HeadingTape from "@/components/Journey/HeadingTape";
import HelmetFrame from "@/components/Journey/HelmetFrame";
import JourneyController from "@/components/Journey/JourneyController";
import JourneyScene from "@/components/Journey/JourneyScene";
import LanderCabin from "@/components/Journey/LanderCabin";
import OutpostSiteMap from "@/components/Journey/OutpostSiteMap";
import ProjectCallouts from "@/components/Journey/ProjectCallouts";
import RadioTranscript from "@/components/Journey/RadioTranscript";
import { useWebGLSupport } from "@/components/Journey/webglSupport";
import LoadingScreen from "@/components/LoadingScreen";
import MissionSummary from "@/components/MissionSummary";
import Navbar from "@/components/Navbar";
import Stats from "@/components/Stats";

export default function Home() {
  const webglSupported = useWebGLSupport();
  const [isSummaryMode, setIsSummaryMode] = useState(false);
  const [isAudioEnabled, setIsAudioEnabled] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const effectiveSummaryMode = isSummaryMode || !webglSupported;

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const wantsSummary =
      params.get("view") === "summary" ||
      window.location.hash === "#mission-summary";

    const timer = window.setTimeout(
      () => {
        if (wantsSummary) {
          setIsSummaryMode(true);
        }
        setIsLoading(false);
      },
      wantsSummary ? 0 : 2000
    );

    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (isLoading && !effectiveSummaryMode) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isLoading, effectiveSummaryMode]);

  const toggleSummaryMode = () => {
    if (!webglSupported) return;
    setIsSummaryMode((prev) => {
      const next = !prev;
      if (next) {
        setIsLoading(false);
      }
      return next;
    });
    window.scrollTo({ top: 0, behavior: "instant" });
  };

  return (
    <JourneyController isLoading={isLoading && !effectiveSummaryMode}>
      {/* Keyboard accessibility skip links */}
      <div className="sr-only focus-within:not-sr-only focus-within:fixed focus-within:left-4 focus-within:top-20 focus-within:z-[100] focus-within:flex focus-within:gap-3">
        <a
          href="#main-content"
          className="border border-caution bg-void px-4 py-2 font-hud text-xs uppercase tracking-[0.2em] text-sunlight focus:outline focus:outline-2 focus:outline-caution"
        >
          Skip to main content
        </a>
        {!effectiveSummaryMode && (
          <button
            type="button"
            onClick={toggleSummaryMode}
            className="border border-signal bg-signal px-4 py-2 font-hud text-xs font-semibold uppercase tracking-[0.2em] text-sunlight focus:outline focus:outline-2 focus:outline-caution"
          >
            Open Mission Summary (Plain View)
          </button>
        )}
      </div>

      <Navbar
        isPoweredOn={!isLoading || effectiveSummaryMode}
        isSummaryMode={effectiveSummaryMode}
        webglSupported={webglSupported}
        onToggleSummary={toggleSummaryMode}
        isAudioEnabled={isAudioEnabled}
        onToggleAudio={() => setIsAudioEnabled((prev) => !prev)}
      />

      {effectiveSummaryMode ? (
        <main
          id="main-content"
          className="relative z-10 min-h-screen bg-void text-suit"
        >
          <MissionSummary
            mode="active"
            webglSupported={webglSupported}
            onExitSummary={toggleSummaryMode}
          />
        </main>
      ) : (
        <>
          <LoadingScreen isLoading={isLoading} />
          <EvaSoundController enabled={isAudioEnabled} />
          <JourneyScene />
          <DescentEffects />
          <LanderCabin />
          <HelmetFrame />
          <HeadingTape />
          <OutpostSiteMap />
          <ProjectCallouts />
          <RadioTranscript />
          <EvaManifest />

          <main
            id="main-content"
            className="relative z-10 min-h-screen bg-transparent text-white"
          >
            {/* Server-rendered full portfolio content for search engine indexing and screen readers */}
            <MissionSummary mode="seo" webglSupported={webglSupported} />

            <Hero />
            <Stats />
            <CityOverview />
            <ExperienceTower />
            <DataCenter />
            <CreativeStudio limit={6} showViewAll />
            <FutureLab />
            <ContactCenter />
            <Footer />
          </main>
        </>
      )}
    </JourneyController>
  );
}
