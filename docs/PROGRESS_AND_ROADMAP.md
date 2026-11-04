# Portfolio — Progress Report & Roadmap to Final Output

Companion to [DESIGN_PLAN.md](./DESIGN_PLAN.md) (the *what and why*). This file is the
*where we are and what's left*. Last updated: 2026-11-04.

Branch: `final-process-part-01` · Stack: Next.js 16 · React 19 · TypeScript · Tailwind 4 ·
Framer Motion · React Three Fiber · Three.js.

---

## 1. Where we stopped

**Done and committed: P0, P1, P2. Written but NOT committed and NOT finished: P3.**

| Phase | Scope | Status |
|---|---|---|
| P0 | Design system (palette, fonts, helmet frame, radio transcript, story script, recoloured HUD navbar) | ✅ Committed |
| P1 | Orbit shot (realistic planet, sunrise, station truss, hero copy as narration) | ✅ Committed |
| P2 | Spacewalk (camera path along the truss, tether, EVA manifest stats, Begin EVA button) | ✅ Committed |
| P3 | Descent & landing (lander cabin, entry plasma, landing site, touchdown, hatch reveal) | 🟡 Code written, passes type check + lint, **visuals need fixing** |
| P4–P10 | Everything below | ⬜ Not started |

### Uncommitted P3 files (nothing is lost, but commit before anything else)

- New: `components/Journey/DescentEffects.tsx`, `components/Journey/LanderCabin.tsx`,
  `components/World/Landing/` (`landingConfig.ts`, `landingShaders.ts`,
  `LandingTerrain.tsx`, `LandingRocks.tsx`, `LandingWorld.tsx`)
- Edited: `app/globals.css`, `app/page.tsx`, `Hero.tsx`, `HelmetFrame.tsx`,
  `JourneyCameraRig.tsx`, `JourneyHUD.tsx`, `JourneyScene.tsx`, `journeyCameraConfig.ts`,
  `journeyConfig.ts`, `storyScript.ts`, `JourneyAtmosphere.tsx`, `Planet.tsx`, `StarField.tsx`

**First action when you resume:** review the diff, then commit P3 as a checkpoint
(e.g. `feat: add lander cabin, entry plasma and landing site (WIP)`), so the fixes in §2
are a clean, reviewable follow-up commit.

---

## 2. P3 — what works and what still needs fixing

### Works (verified in headless Chrome, no console/shader errors)
- Phases are re-timed: Orbit 0–4% · Spacewalk 4–14% · Descent 14–19% · Entry & Touchdown
  19–25% · **Landfall 25–28% (new phase)** · City 28–32%.
- Lander cabin frame closes in around you after the spacewalk, with live **altitude,
  velocity and G-load** readouts. The hatch frame retracts at landfall.
- Orange entry plasma builds, fills the screen at peak, and fades; camera shake grows with
  scroll speed; one damped "thump" at touchdown.
- Radio script for Acts 3 and 4 is in `storyScript.ts`.
- Performance: ~60 fps once the dev server is warm (one-off dips are dev compile time).

### Still wrong — fix these before calling P3 done

| # | Problem | Where to look | Suggested fix |
|---|---|---|---|
| 1 | **Landing site looks dark grey-teal, not a warm butterscotch dusty morning.** The sky, haze and ground colours are not reading through. Likely `JourneyAtmosphere` scene background/fog and the landing sky are fighting. | `landingConfig.ts` (`haze`, `zenith`), `landingShaders.ts` (sky shader), `JourneyAtmosphere.tsx` | Make the landing sky opaque and draw it over the scene background; verify fog is off for landing meshes; raise haze brightness. |
| 2 | **Ground plain and horizon are barely visible.** Boulders float against a flat gradient with no clear ground line or ridges. | `LandingTerrain.tsx`, ground shader | Check the ground circle is lit/visible at eye height (camera ends at y≈−1.3, ground at y=−3 → plain should fill the lower half); confirm depth/`renderOrder` and `transparent` fade. |
| 3 | **Visible rectangular tile seams** in the ground texture during the high-altitude descent frames. | `landingShaders.ts` (`getGroundMap`, macro/detail UVs) | Mipmap/anisotropy issue or non-wrapping bake; verify `RepeatWrapping` is applied to the texture actually sampled and mipmaps generate. |
| 4 | **Boulders are too large and too faceted** (look like grey low-poly hills in the foreground). | `LandingRocks.tsx` (`scatterRocks`, size formula) | Reduce size multiplier, increase icosahedron detail or smooth normals, add per-instance tint variation. |
| 5 | **Landing world and old Digital City overlap** between 28–31%: boulders show through the cyan city. | `landingConfig.ts` (`descent.worldOut`), `JourneyScene.tsx` (`WorldGate from={0.28}`) | Fade landing out earlier or hide rocks once the old world appears. (This disappears in P4/P5 when the old city is replaced.) |
| 6 | Plasma/dust overlays look like flat orange/beige sheets. | `DescentEffects.tsx` | Add a hot core, streak direction toward screen edges, and a softer dust fade-in; keep reduced-motion version static. |
| 7 | Frame rate dip (~13 fps) seen once at 28%. Not reproducible, but re-test on a phone. | — | Profile after fixes 1–5; check rock/shadow instance counts on mobile. |

### Re-verify after fixes (checklist)
- [ ] Desktop 1440×900, laptop 1280×720, phone 390×844
- [ ] Scroll values: 0.15 · 0.17 · 0.19 · 0.20 · 0.22 · 0.235 · 0.245 · 0.255 · 0.265 · 0.28 · 0.30
- [ ] No console errors, `npx tsc --noEmit` and `npx eslint app components` clean
- [ ] Reduced motion: no shake, no flicker, hatch still opens
- [ ] Radio lines for Acts 3–4 appear at the right moments

---

## 3. Roadmap to the final output

Each phase = build → type check + lint → visual check at the 3 screen sizes → you approve →
commit. Do not start the next phase before the previous one is approved.

### P3 — Finish Descent & Landing (do first)
1. Commit current WIP.
2. Fix items 1–6 in §2.
3. Run the re-verify checklist.
4. Commit: `feat: finish descent and landing`.

### P4 — Surface & Walking (Acts 4 + outpost overview)
Goal: step out of the lander and walk the surface; the outpost appears ahead.
1. Replace the old Digital City entrance with the outpost *site*: terrain continues from the
   landing plain; heading tape + waypoint marker on the visor (bearing/distance to the next
   structure).
2. Walking camera: subtle head-bob, slows in dwell zones; head-look from the mouse.
3. **Time-of-day system** (shared sun direction, sky colours, haze) driven by journey progress
   so later acts can be morning → noon → golden hour → blue sunset → night.
4. Site map shown on the visor with all structures (HealthBridge, Ezy Map, KV Audio,
   StoryBloom, Habitat, Power Grid, Quarters, Observatory, Comms Mast).
5. Remove `WorldGate` city objects that the outpost replaces; keep only what is still used.
6. Update `journeyCameraConfig.ts` so all keyframes after landfall are the walking path.
- Output: a believable walk across the plain with the outpost visible on the horizon.

### P5 — Project structures (Acts 5–8)
1. Four modular, low-poly PBR structures (white thermal panels, gold foil, brushed aluminium,
   orange markings): **HealthBridge Med-Lab**, **Ezy Map Logistics Depot**, **KV Audio
   Hangar**, **StoryBloom Greenhouse**.
2. AR callouts: thin leader line from the structure to a compact data block (title, one-line
   summary, 3–5 facts) — data from `data/portfolioData.ts` only.
3. `OPEN MISSION FILE` button → restyle `ProjectModal` as a printed technical dossier
   (paper-white sheet, black type, orange tabs). Keep all content and behaviour.
4. Radio beats for each project (script in DESIGN_PLAN §3).
5. Replace the cyan `JourneyContentOverlay` project panels with callouts.

### P6 — Habitat & Power Grid (Acts 9–10)
1. Crew Habitat structure → internship callout (Pure Heart Family, Backend Developer Intern,
   Feb–May 2026, technologies and achievements from `experienceData.ts`).
2. Solar array field → 5 skill groups from `skillsData.ts`; level = power output; each array
   shows its technologies.
3. Radio beats for both acts.

### P7 — Quarters & Observatory (Acts 11–12)
1. Walk *inside* the habitat (warm interior light): your artwork pinned on the wall from
   `creativeData.ts`; reuse the existing `CreativeModal` for the full-size view.
2. Observatory on the ridge: telescope tracking your 8 learning goals from `futureData.ts`;
   progress % = signal lock.
3. **Blue sunset** lighting moment (sky/haze palette shift).
4. Remove emoji/colour fields from future/skills data usage in the visuals (not the data).

### P8 — Comms Mast & Night (Acts 13–14)
1. Long-range comms mast at dusk → contact actions (email, phone, GitHub, LinkedIn, CV) from
   `contactData.ts`, all real links.
2. Night sky; the station you left passes overhead as a moving star.
3. Footer, journey-complete message, `RETURN TO ORBIT` (scroll to top).

### P9 — Mission Summary, fallback, SEO, accessibility
1. **Mission Summary** toggle in the HUD → fast plain single-page view of *all* content, no 3D,
   same data and links (also the no-WebGL fallback and the version search engines index —
   needs server-rendered content).
2. Keep `BackToTop` and existing metadata (`app/layout.tsx`).
3. Accessibility pass: radio transcript `aria-live`, focusable controls, `prefers-reduced-motion`
   everywhere, contrast check on amber/white text.
4. Remove old components that are no longer used (only now, after approval).

### P10 — Sound & final polish
1. Optional sound, **off by default**, one HUD toggle: breathing, suit hum, radio squelch,
   footsteps, thin wind, interior hum (CC0 sources, licence-checked individually).
2. Mobile tuning: lighter terrain, fewer particles, adaptive resolution (`PerformanceMonitor`).
3. Performance budget: 60 fps desktop, 30+ fps mid-range phones; textures ≤ ~6 MB total.
4. Final QA on real devices; Lighthouse; OG image refresh; update README.
5. **Update `.github/copilot-instructions.md`** (still describes the Digital City and cyan
   lighting) — do this early in P4 so future AI sessions follow the new direction.

---

## 4. Open decisions (answer before the phase that needs them)

| # | Decision | Needed by | Recommendation |
|---|---|---|---|
| 1 | Add `@react-three/postprocessing` (film grain, sun-only bloom, flare) or keep CSS-only effects | P4 | CSS-only is working; add only if the surface looks flat |
| 2 | Gloved hands visible in first person (needs a 3D model) | P4 | Skip for now; revisit in polish |
| 3 | About/bio line for the spacewalk act — **no About/education data exists** | P5 | Write 1–2 true sentences yourself; nothing is invented |
| 4 | Use NASA/Poly Haven assets for the station/terrain detail | P5 | Optional upgrade; check each licence |
| 5 | Approve narration voice/lines (DESIGN_PLAN §3) | per phase | Edit freely; facts must stay from `data/*.ts` |
| 6 | `.github/copilot-instructions.md` update | P4 | Yes, before P4 starts |

---

## 5. Project rules to keep following

- Existing portfolio facts come only from `data/*.ts` and `missionStats.ts`. Never invent
  projects, numbers, education or achievements.
- Don't delete existing components until the phase that replaces them is approved.
- Palette is realistic, not neon: void `#050505`, suit white, visor gold, regolith tones, dust
  haze, caution amber (HUD highlights), International Orange (buttons only). No cyan/teal glow.
- One phase at a time; no commits, pushes or branch changes unless you ask.
- Next.js here is a newer version than most docs: read `node_modules/next/dist/docs/` before
  using unfamiliar APIs.

---

## 6. How to run, check and resume

```
npm run dev            # http://localhost:3000   (use npm.cmd if PowerShell blocks npm)
npx tsc --noEmit -p tsconfig.json
npx eslint app components
```

**Journey progress → scroll** (useful for testing a specific moment): progress is linear in
scroll between the top of the page and the first section stop (`#projects`, 15% of a screen
early), so `scrollY ≈ stop × (progress / 0.28)` for progress ≤ 0.28.

**Key files**
- Timeline: `components/Journey/journeyConfig.ts` (phases), `journeyCameraConfig.ts` (camera path)
- Story: `components/Journey/storyScript.ts`, `RadioTranscript.tsx`
- Visor/UI layers: `HelmetFrame.tsx`, `LanderCabin.tsx`, `DescentEffects.tsx`, `EvaManifest.tsx`, `components/Navbar.tsx`
- 3D worlds: `components/World/Orbit/`, `World/Planet/`, `World/Landing/`, `World/Atmosphere/`
- Design tokens: `app/globals.css` (`@theme inline`)

**Prompt to resume with an AI assistant**
> Read `docs/DESIGN_PLAN.md` and `docs/PROGRESS_AND_ROADMAP.md`. We are finishing P3
> (Descent & Landing). First commit the WIP, then fix the issues listed in §2 one by one,
> verifying visually at desktop/laptop/phone sizes. Don't start P4 until I approve.

---

## 7. Realistic effort estimate (rough)

| Phase | Relative size |
|---|---|
| Finish P3 | Small–medium |
| P4 Surface & walking | Large (time-of-day system, new walking camera) |
| P5 Project structures | Large (4 structures + callouts + dossier modal) |
| P6 Habitat & Power Grid | Medium |
| P7 Quarters & Observatory | Medium–large (interior + sunset) |
| P8 Comms mast & night | Medium |
| P9 Summary, fallback, a11y | Medium |
| P10 Sound & polish | Medium |

Cheapest way to keep momentum on a limited budget: finish P3 → P4 → P5, which already gives a
complete, shippable "landing + projects" story; P6–P8 can then be added one structure at a time.
