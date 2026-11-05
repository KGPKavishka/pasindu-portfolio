# Portfolio — "EVA: Mission Log of Pasindu Kavishka" — AI Instructions

Source of truth for the plan: `docs/DESIGN_PLAN.md` (what/why) and
`docs/PROGRESS_AND_ROADMAP.md` (where we are / what's left). Read both before working.
This file supersedes the old "Digital City" concept and the cyan/teal colour direction.

## Project

Pasindu Kavishka's personal portfolio. Stack: Next.js 16 · React 19 · TypeScript ·
Tailwind 4 · Framer Motion · React Three Fiber · Three.js · @react-three/drei.

Next.js here is newer than most training data: read `node_modules/next/dist/docs/` before
using unfamiliar APIs (see `AGENTS.md`).

## Concept

The visitor sees everything through the helmet visor of an astronaut (Pasindu). Journey:
orbit sunrise (hero) → spacewalk (stats) → descent & entry → landfall → outpost whose
structures are the work (HealthBridge Med-Lab, Ezy Map Logistics Depot, KV Audio Hangar,
StoryBloom Greenhouse) → Crew Habitat (internship) → Power Grid (skills as power output) →
Quarters (creative works) → Observatory (learning goals, blue Martian sunset) → Comms Mast
(contact, dusk) → Night (station passes overhead, log ends).

Story is told by radio: **PK** (first person) and **CONTROL** (Mission Control). All lines
live in `components/Journey/storyScript.ts`.

Core idea: **"I build things"** — projects are structures built on another world.

## Visual rules (realistic, NOT neon)

- Palette: void `#050505`, sunlight `#FFF4E2`, suit white `#E9E6DF`, visor gold `#C9A45C`,
  regolith `#B08A68 / #8C6A4F / #3E2F25`, dust haze `#D9B79A`, blue hour `#6F8FAF`,
  caution amber `#E8A33D` (HUD highlights), International Orange `#FF4F00` (**buttons only**),
  nominal green `#8DB580` (sparingly).
- HUD = suit white + amber. No cyan/teal, no neon glows, no glassmorphism, no purple.
- 3D: filmic tone mapping, one directional sun, PBR-style materials, instancing, warm haze.
- Post-processing (decided): `@react-three/postprocessing` **only** for a high-threshold
  selective Bloom (sun, horizon rim, beacons), switched off by drei `PerformanceMonitor`
  when fps drops. Grain, vignette, visor frame and HUD text stay in CSS/SVG/HTML.

## Content rules

- Facts come only from `data/*.ts` and `components/Journey/missionStats.ts`. Never invent
  projects, numbers, education, achievements or personal info.
- No About/education data exists; any bio line must be supplied by the user.
- Narration may change voice, never facts. Story lines reference data, not copy it.

## Architecture

- `JourneyController` is the single source of progress/velocity/phase. Components must
  NOT read `window.scrollY` themselves.
- Timeline: `components/Journey/journeyConfig.ts`; camera path: `journeyCameraConfig.ts`.
- 3D worlds in `components/World/<Act>/`; visor/UI layers in `components/Journey/`.
- Design tokens: `app/globals.css` (`@theme inline`).
- Reuse `ProjectModal` / `CreativeModal` content and behaviour (restyle as dossier in P5/P7).
- Use `useFrame` for animation; avoid per-frame React state updates.

## Working method

1. Inspect relevant files first; explain intended changes briefly.
2. One phase at a time (P0–P10). Do not start the next phase before the user approves.
3. Do not delete existing components until the phase that replaces them is approved.
4. Verify: `npx tsc --noEmit -p tsconfig.json`, `npx eslint app components`, run the dev
   server, check browser console, and visually check desktop 1440×900, laptop 1280×720
   and phone 390×844.
5. Reduced motion must be respected everywhere (no shake/bob/flicker).
6. Performance budget: 60 fps desktop, 30+ fps mid-range phones, textures ≤ ~6 MB total.

## Git safety

Do not commit, push, merge, checkout other branches, reset or delete branches unless the
user explicitly asks. Current branch: `final-process-part-01`. Never touch `main`/`develop`.

## Environment notes

- Node is pinned by Volta (22.23.3) in `package.json`.
- Windows/PowerShell: use `npm.cmd` if script execution blocks `npm`.
</Content>
