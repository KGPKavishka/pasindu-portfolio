# EVA — Mission Log of Pasindu Kavishka

> **"I build things."**
> An interactive 3D scrollytelling portfolio experienced through the helmet visor of an astronaut across one full planetary day.

---

## Overview

Visitors step into the helmet visor of **Pasindu Kavishka** (`EVA-01`) and experience his software engineering portfolio as a continuous 14-act Extra-Vehicular Activity (EVA):

1. **Act 01 — Orbit at Sunrise (`0.00–0.05`)**: Departing the orbital station truss above the sunlit planet limb.
2. **Act 02 — Spacewalk (`0.05–0.14`)**: Drifting along the gold tether with the EVA Manifest headline telemetry and personal bio.
3. **Act 03 — Descent & Atmospheric Entry (`0.14–0.25`)**: Riding the lander through orange entry plasma and parachute/thruster braking to touchdown.
4. **Act 04 — Landfall & Outpost Overview (`0.25–0.32`)**: Stepping onto the cratered regolith plain with the Visor Heading Tape and Outpost Site Map online.
5. **Act 05 — `MOD-01` HealthBridge Med-Lab (`0.32–0.385`)**: Pressurized biolab module for the ML-Based Kidney Donor Matching Platform.
6. **Act 06 — `DEP-02` Ezy Map Logistics Depot (`0.385–0.455`)**: Dispatch tower, rover bays, and beacon pylons for the Multi-Service Taxi, Delivery & Marketplace Platform.
7. **Act 07 — `HGR-03` KV Audio Equipment Hangar (`0.455–0.525`)**: Quonset acoustic arch and stage truss for the Rental & Sound Management System.
8. **Act 08 — `GRN-04` StoryBloom Greenhouse (`0.525–0.595`)**: Geodesic bio-dome with warm grow-lamp light for the AI-Assisted Story Generation Platform.
9. **Act 09 — `HAB-05` Crew Habitat (`0.595–0.665`)**: Pressurized crew module chronicling the Backend Developer Internship at **Pure Heart Family (Pvt) Ltd**.
10. **Act 10 — `PWR-06` Power Grid (`0.665–0.74`)**: Five sun-tracking solar array wings representing technical skill domains (`Frontend`, `Backend`, `Database`, `Cloud`, `AI & Research`) where skill level drives power output.
11. **Act 11 — `QTR-07` Off-Shift Quarters (`0.74–0.82`)**: Warm-lit interior cutaway bay with original posters, manipulation art, and hand-drawn works pinned to the bulkhead.
12. **Act 12 — `OBS-08` Ridge Observatory (`0.82–0.90`)**: Elevated Cassegrain telescope dome under a **Martian blue sunset**, tracking 8 active learning targets (`AI Engineering`, `Machine Learning`, `Cloud Computing`, `System Design`, `LLMs`, `Docker`, `AWS`, `Kubernetes`).
13. **Act 13 — `COM-09` Long-Range Comms Mast (`0.90–0.97`)**: High-gain parabolic dish at dusk with 5 direct communication channels (`Email`, `Phone`, `GitHub`, `LinkedIn`, `Resume`).
14. **Act 14 — Night / Mission Log End (`0.97–1.00`)**: The orbital station passes overhead as a moving star across the night sky, with a `[ Return to Orbit ↑ ]` action.

---

## Key Features

- **Radio Narrative (`PK` & `CONTROL`)**: Every stop is narrated as a first-person radio conversation ([`components/Journey/storyScript.ts`](components/Journey/storyScript.ts)) rendered as film-style subtitles in an `aria-live="polite"` region ([`components/Journey/RadioTranscript.tsx`](components/Journey/RadioTranscript.tsx)).
- **Visor AR Callouts & Printed Technical Dossiers**: Surface structures project leader-line AR callouts ([`components/Journey/ProjectCallouts.tsx`](components/Journey/ProjectCallouts.tsx)) and open full printed technical dossier modals ([`components/ProjectModal.tsx`](components/ProjectModal.tsx) and [`components/CreativeModal.tsx`](components/CreativeModal.tsx)).
- **Mission Summary, SEO & Automatic No-WebGL Fallback**: A top HUD `MISSION SUMMARY` toggle switches to a fast, plain, single-page view of all content ([`components/MissionSummary.tsx`](components/MissionSummary.tsx)). The same semantic content is server-rendered for search engine indexing and automatically activates if WebGL is unavailable.
- **Procedural Web Audio Soundscape (Off by Default)**: Optional HUD audio toggle ([`components/Journey/EvaSoundController.tsx`](components/Journey/EvaSoundController.tsx)) synthesizing suit PLSS fan hum, calm astronaut breathing, Apollo Quindar-style radio squelch tones, muffled surface footsteps, thin-air Martian wind, and warm habitat interior hum with zero external audio payload.
- **Adaptive Performance & Reduced Motion**: Uses `@react-three/drei` `AdaptiveDpr` and `PerformanceMonitor` to scale resolution, geometry/particle counts, and selective high-threshold Bloom across desktop and mobile devices, while honoring `prefers-reduced-motion` throughout.

---

## Tech Stack

- **Framework**: Next.js 16 (App Router) · React 19 · TypeScript
- **3D & Shaders**: Three.js · `@react-three/fiber` · `@react-three/drei` · `@react-three/postprocessing`
- **Styling & Motion**: Tailwind CSS 4 (`@theme inline`) · Framer Motion · IBM Plex Mono & IBM Plex Sans
- **Audio**: Web Audio API procedural synthesis

---

## Local Development

```bash
# Start development server (http://localhost:3000)
npm run dev

# Run TypeScript check
npx tsc --noEmit -p tsconfig.json

# Run ESLint
npx eslint app components data

# Production build
npm run build
```

---

## Project Structure

- `app/` — Next.js App Router pages, layout metadata, and global theme tokens (`app/globals.css`).
- `components/Journey/` — Scroll-timeline controller (`JourneyController.tsx`), camera keyframe rig (`JourneyCameraRig.tsx`), visor HUD layers (`HelmetFrame.tsx`, `HeadingTape.tsx`, `OutpostSiteMap.tsx`, `ProjectCallouts.tsx`, `RadioTranscript.tsx`, `EvaSoundController.tsx`), and `storyScript.ts`.
- `components/World/` — 3D scenes organized by act (`Space/`, `Orbit/`, `Planet/`, `Landing/`, `Atmosphere/`, `Outpost/`).
- `components/MissionSummary.tsx` — Plain single-page dossier view, SEO pre-render layer, and no-WebGL fallback.
- `data/` — Single source of truth for portfolio facts (`portfolioData.ts`, `experienceData.ts`, `skillsData.ts`, `creativeData.ts`, `futureData.ts`, `contactData.ts`, `aboutData.ts`).
- `docs/` — Design plan (`DESIGN_PLAN.md`) and implementation roadmap (`PROGRESS_AND_ROADMAP.md`).
