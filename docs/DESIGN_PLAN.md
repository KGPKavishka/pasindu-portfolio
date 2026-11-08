# Portfolio Design Plan — "EVA: Mission Log of Pasindu Kavishka"

Status: **Draft for approval**. This plan supersedes the "Digital City" concept and
the cyan/teal colour direction described in `.github/copilot-instructions.md`.
Nothing here changes existing data files; every fact shown comes from `data/*.ts`.

---

## 1. The concept in one paragraph

The visitor sees through **your helmet visor**. You are Pasindu, an astronaut on a
spacewalk outside an orbital station above an unexplored rocky planet. Scrolling is
time passing: you finish the EVA, ride a lander down through the atmosphere, step onto
the surface and walk through **the outpost you built**. Every structure there is a piece
of your work. As you move, you talk with **Mission Control** over the radio, and that
conversation is how your portfolio is told. The journey ends at nightfall at the comms
mast: the channel is open, and the station you left drifts overhead as a moving star.

Core metaphor: **"I build things."** Projects are not cards on a page; they are
structures you built on another world.

---

## 2. Story structure (acts, scroll budget, time of day)

Scroll = time. Each act is a sticky section with a "dwell" zone so the reader can stop
and read without scroll-jacking.

| # | Act | Scroll | Time of day | Portfolio content |
|---|-----|--------|-------------|-------------------|
| 0 | **Suit boot** (loading) | — | — | Name, loading status |
| 1 | **Orbit — hatch open** | 0–6% | Orbital sunrise over the limb | Hero: name, role, tagline, Begin EVA, Download CV |
| 2 | **Spacewalk** along the station truss | 6–14% | Day side | Stats: 600+ internship hours, 4+ major projects, 20+ technologies, 1 research project |
| 3 | **Descent & entry** in the lander | 14–22% | Entry plasma glow | Transition only (no content) |
| 4 | **Landfall** — hatch opens on the plain | 22–28% | Morning, warm dust haze | Outpost overview: site map of everything ahead |
| 5 | **HealthBridge Med-Lab** | 28–34% | Morning | Project 1 |
| 6 | **Ezy Map Logistics Depot** | 34–40% | Late morning | Project 2 |
| 7 | **KV Audio Equipment Hangar** | 40–46% | Midday | Project 3 |
| 8 | **StoryBloom Greenhouse** | 46–52% | Midday | Project 4 |
| 9 | **Crew Habitat** | 52–60% | Midday | Experience: Pure Heart Family internship |
| 10 | **Power Grid** — solar arrays | 60–68% | Harsh noon | Skills: 5 groups with levels |
| 11 | **Off-shift quarters** (inside the habitat) | 68–76% | Warm interior light | Creative works gallery |
| 12 | **Observatory** on the ridge | 76–84% | Golden hour → **blue sunset** | Future learning goals |
| 13 | **Comms Mast** | 84–94% | Dusk | Contact: email, phone, GitHub, LinkedIn, CV |
| 14 | **Night — log end** | 94–100% | Night sky, station passes overhead | Footer, return to orbit |

Why this order: it keeps the current navigation order (Projects → Experience → Skills →
Contact), puts your strongest work right after landing, and moves through one full day so
the lighting itself tells time.

Realism detail worth keeping: on Mars-like worlds the daytime sky is butterscotch and the
**sunset is blue** (dust scatters red light). That gives the Observatory act a unique,
scientifically grounded moment no generic space portfolio has.

### Structure metaphors

| Content | Structure | Why it fits |
|---|---|---|
| HealthBridge (medical ML) | Med-Lab research module | Research + healthcare |
| Ezy Map (rides, delivery, marketplace) | Logistics depot with rover tracks | Transport and delivery |
| KV Audio (equipment rental) | Equipment hangar with inventory racks | Rental inventory and bookings |
| StoryBloom (storytelling app) | Small greenhouse pod | "Bloom" |
| Internship | Crew habitat | First mission with a real crew |
| Skills | Solar arrays; skill level = power output | Your capabilities power the outpost |
| Creative works | Your sketches pinned on the quarters wall | The human side, off-shift |
| Future goals | Telescope tracking targets; progress = signal lock % | Looking ahead |
| Contact | Long-range comms mast | Opening a channel to you |

---

## 3. Narration — how the story is told

Two speakers on the radio:

- **PK** — you, first person.
- **CONTROL** — Mission Control: short prompts and replies that move the story forward.

Every factual line must come from `data/*.ts` or existing site copy. The lines below are
**draft copy for your approval**; the voice can change, the facts cannot.

**Act 0 — Suit boot**
> CONTROL: Suit check, Pasindu. Report.
> PK: Power on. O2 nominal. Comms clear.

**Act 1 — Orbit (hero)**
> PK: This is Pasindu Kavishka. Software engineer.
> PK: I build scalable web, mobile, cloud and AI-powered solutions.
> CONTROL: Copy. Hatch is yours.
> Actions: `[ BEGIN EVA ]` (scrolls on) · `DOWNLOAD CV`

**Act 2 — Spacewalk**
> CONTROL: Give me your manifest on the way down.
> PK: Six hundred plus internship hours. Four major projects. Twenty-plus technologies. One research project.
> CONTROL: Full load. Where are you headed?
> PK: The outpost. Everything I've built is down there.

**Act 3 — Descent**
> CONTROL: Entry interface in three… two… one.
> PK: Holding steady.

**Act 4 — Landfall**
> PK: Boots on the surface. Outpost in sight.
> Visor shows the site map with all structures.

**Acts 5–8 — Projects** (one pattern, four times)
> CONTROL: What's in the Med-Lab?
> PK: HealthBridge. An ML-based kidney donor matching platform. It reads medical reports with OCR, extracts HLA data and predicts compatibility.
> Visor callout: subtitle, technologies, key features → `OPEN MISSION FILE` (full project dossier with screenshots, architecture, challenges, lessons, GitHub).

**Act 9 — Crew Habitat**
> CONTROL: Tell me about your first crew mission.
> PK: Backend Developer Intern at Pure Heart Family, February to May 2026. I worked on Ezy Map.
> Visor callout: technologies and achievements.

**Act 10 — Power Grid**
> CONTROL: Grid readings?
> PK: Frontend at ninety. Backend and database at eighty-five. Cloud at seventy-five. AI and research at sixty-five.
> Each array shows its group's technologies.

**Act 11 — Quarters**
> PK: Off-shift, I draw.
> Gallery of pencil, painting, digital art, UI designs, logos and the HealthBridge research poster.

**Act 12 — Observatory**
> PK: Tracking what's next.
> Each learning goal is a tracked target; its progress is the signal-lock percentage.

**Act 13 — Comms Mast**
> CONTROL: Channel's open. Who's listening?
> PK: You are. Send a message.
> Real actions: email, phone, GitHub, LinkedIn, CV.

**Act 14 — Night**
> CONTROL: Good work today, Pasindu.
> PK: Log ends. Signal stays open.
> Footer, `RETURN TO ORBIT` (back to top).

Content gap: there is **no About/bio or education data** in the repo. If you want a
personal line in the Spacewalk act ("where I'm from / what drives me"), you need to
provide that text; it will not be invented.

---

## 4. Visual direction — realistic, not neon

Reference: real NASA/ESA EVA photography (ISS, Artemis), Apollo surface photos, Mars rover
panoramas. Hard single sunlight, true black shadows, warm dust, white thermal fabric,
gold visor foil, and NASA's real safety orange.

### Remove
Cyan/teal neon (`#22d3ee`, `#67e8f9`, emerald), glowing borders, glassmorphism boxes,
purple gradients, stylised quasar, comet beam and asteroid field.

### Palette

| Token | Hex | Use |
|---|---|---|
| Void | `#050505` | Space, deep shadows (true black, not navy) |
| Sunlight | `#FFF4E2` | Key light, sun disc |
| Suit White (beta cloth) | `#E9E6DF` | Primary HUD text, structures' thermal panels |
| Visor Gold | `#C9A45C` | Visor tint, reflections, gold foil insulation on structures |
| Regolith Light | `#B08A68` | Lit terrain |
| Regolith Mid | `#8C6A4F` | Terrain base |
| Regolith Shadow | `#3E2F25` | Terrain in shade |
| Dust Haze | `#D9B79A` | Daytime sky and fog |
| Martian Blue Hour | `#6F8FAF` | Sunset glow around the sun |
| Caution Amber | `#E8A33D` | HUD highlights, active waypoint, focus |
| International Orange | `#FF4F00` | Primary actions only (NASA's real safety colour) |
| Nominal Green | `#8DB580` | Status "OK" indicators, sparingly |

Rule: the HUD is **suit white + amber**, like real aviation and suit displays. Orange
appears only on things you can press. No colour glows except the sun.

### Typography
- HUD and telemetry: **IBM Plex Mono** (engineering-grade; free; via `next/font`).
- Radio transcript and readable copy: **IBM Plex Sans** / **Plex Sans Condensed**.
- Alternative with no new fonts: keep Geist Sans/Mono. (Decision needed; see §10.)

### 3D realism techniques
- Filmic tone mapping (AgX/ACES), physically based materials, one directional sun,
  hemisphere fill tinted by the ground; no decorative coloured lights.
- Planet from orbit: albedo + normal map, thin atmospheric scattering rim, a sharp
  day/night terminator line, and a slow dust/cloud layer.
- Surface: heightmap terrain with detail normals, instanced rocks, drifting dust,
  warm-haze fog, a sky gradient shader that follows the time of day.
- Structures: modular, low-poly, PBR: white panels, gold foil, brushed aluminium,
  orange markings, work lights at dusk.
- Light post-processing: film grain, helmet vignette, sun-only bloom, slight chromatic
  aberration at visor edges, sun lens flare.

---

## 5. The visor — the UI layer

Everything is "projected inside the helmet". No floating cards with boxes.

1. **Helmet frame** (always on): curved visor edges, faint gold tint at the top, edge
   condensation, reflections that follow the sun. CSS/SVG overlay, `pointer-events: none`.
2. **Top HUD** (evolves the current Visor HUD navbar): your callsign, mission waypoints
   (`PROJECTS · EXPERIENCE · SKILLS · CONTACT`, plain words for recruiters), Mission
   Elapsed Time, suit telemetry (O2, suit pressure, battery), sound toggle and the
   **Mission Summary** (quick-view) toggle. Recoloured to white + amber.
3. **Heading tape and waypoint marker**: a compass strip like real HUDs, showing the
   bearing and distance to the next structure. It doubles as a progress indicator.
4. **Radio transcript** (bottom centre, film-subtitle style): speaker tag (`PK` /
   `CONTROL`), the line, a small voice waveform and a squelch click. Text reveals at
   reading speed and is driven by scroll position, so the reader controls pace.
5. **AR callouts**: a thin leader line from a structure to a compact data block (title,
   one-line summary, 3–5 facts, `OPEN MISSION FILE`). Screen-anchored, so they never
   cover the structure or the navigation.
6. **Mission file** (modal): the existing ProjectModal and CreativeModal content,
   restyled as a printed technical dossier: paper-white sheet, black type, orange tabs.

---

## 6. Camera and motion language

- First person only. Gloved hands appear at key beats: grabbing a handrail on the EVA,
  pointing at the outpost on landfall. These are optional and need a model or render.
- Spacewalk: slow drift, breathing sway, tether in view.
- Descent: shake grows with scroll velocity; orange plasma on the visor; quiet after
  touchdown.
- Surface: walking head-bob (very subtle); turns of the head at each structure;
  slows down in dwell zones.
- Mouse: small head-look parallax (reuses the current pointer system).
- Reduced motion: no shake, no bob, cross-fades instead of camera flights.

---

## 7. Sound (optional, off by default)

Breathing, suit fan hum, radio squelch on each line, muffled footsteps, thin-air wind on
the surface, interior hum in the quarters. A single toggle in the HUD; it starts muted
because browsers block autoplay. Sources: CC0 libraries (e.g. Freesound CC0), checked
individually.

---

## 8. Mission Summary (quick view) and accessibility

- A visible `MISSION SUMMARY` toggle in the HUD switches to a fast, plain, single-page
  view of all content: no 3D, same data, same links.
- The same view is the fallback when WebGL is unavailable, and it is what search
  engines index (server-rendered).
- Reduced-motion users get the journey with cross-fades, or can open the summary.
- The transcript is real text (`aria-live="polite"`); every visor action is a focusable
  button or link.

---

## 9. Architecture and performance

### Keep and reuse
`JourneyController` (single source of progress), the camera keyframe rig, the shared
pointer, the loading gate, `TypewriterText`, the Visor HUD structure and MET clock,
project/creative modals (content and behaviour), and all `data/*.ts`.

### Replace over the phases
- Opening scene (quasar, comet, asteroids, ringed gas giant) → orbital station, realistic
  planet and sun. The gas giant may return as a realistic moon in the planet's sky.
- `JourneyHUD` messages → radio transcript.
- Digital City, districts and landmarks → outpost terrain and structures.
- `JourneyContentOverlay` panels → AR callouts.
- Cyan theme tokens in `globals.css` → the palette above.

### New pieces
- `storyScript.ts`: one ordered list of beats: `{ id, act, scrollRange, speaker, line, dataRef }`.
  Narration lives in one file and references data, never copies it.
- World folders per act: `Orbit/`, `Descent/`, `Surface/`, `Outpost/` (one component per
  structure), `Sky/` (time-of-day).
- Lazy-load the surface world after the orbit act.

### Performance budget
- 60 fps desktop, 30+ fps mid-range phones; adaptive resolution and quality tiers
  (drei `PerformanceMonitor` / `AdaptiveDpr`).
- Textures ≤ ~6 MB total, compressed (KTX2); geometry low-poly with instancing.
- Mobile: same story, lighter terrain, fewer particles, no post-processing extras.

### Assets (licence-checked before use)
- NASA 3D Resources and imagery (public domain) for station parts and planet texture
  bases; Poly Haven (CC0) for rock/terrain textures and HDRIs.

---

## 10. Decisions still needed (before the matching phase)

1. Fonts: IBM Plex (new, recommended) or keep Geist.
2. Post-processing: add `@react-three/postprocessing` (recommended, new dependency) or
   do grain/vignette in CSS only.
3. About/bio text for the Spacewalk act (optional; you provide it).
4. Gloved hands in view: yes (needs a model) or skip.
5. Approval of the narration voice and lines in §3.
6. Update `.github/copilot-instructions.md` to match this plan once approved.

---

## 11. Implementation roadmap

Each phase is built, verified and approved before the next starts.

| Phase | Scope | Main outcome |
|---|---|---|
| P0 | Design system | Palette tokens, fonts, helmet frame, radio transcript component, `storyScript.ts`; recolour the Visor HUD |
| P1 | Orbit (hero) | Station truss, realistic planet, orbital sunrise; hero copy as narration |
| P2 | Spacewalk | EVA camera path, tether, stats beat |
| P3 | Descent & landing | Lander, entry plasma, touchdown, hatch reveal |
| P4 | Surface & walking | Terrain, sky/time-of-day system, walking camera, site map, heading tape |
| P5 | Project structures | Four structures, AR callouts, restyled mission file modal |
| P6 | Habitat & Power Grid | Experience and skills acts |
| P7 | Quarters & Observatory | Creative gallery interior; blue sunset and future goals |
| P8 | Comms Mast & Night | Contact act, ending, footer, return to orbit |
| P9 | Mission Summary & fallback | Quick view, no-WebGL fallback, SEO, accessibility pass |
| P10 | Sound & polish | Audio, mobile tuning, performance budget, final QA |

Retired components are removed only in the phase that replaces them, after you approve.
