# Portfolio Digital Journey — Copilot Instructions

## Project Purpose

This is Pasindu Kavishka's personal portfolio built with:

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS
- Framer Motion
- React Three Fiber
- Three.js
- @react-three/drei

The goal is to transform the current portfolio into one continuous cinematic Digital City journey.

The experience should feel like:

Loading → Outer Space → Planet Approach → Planet Surface → Digital City → Project Districts → Experience Tower → Data Center → Creative Studio → Future Lab → Contact Center → Footer

Scrolling represents traveling through this world, not navigating ordinary independent webpage sections.

## Critical Preservation Rules

- `main` is the production source of truth.
- `develop` is the testing/integration branch.
- `feature/digital-city-journey` is the current development branch.
- Do NOT modify `main` or `develop`.
- Do NOT merge or copy the old `feature/digital-city-space` branch wholesale.
- Existing finalized portfolio content must be preserved.
- Existing data files remain the source of truth for portfolio content.
- Do not delete existing components unless explicitly instructed.
- Do not replace existing portfolio sections with placeholder content.
- Do not rewrite large parts of the application when a smaller change is sufficient.
- Before modifying an existing component, inspect its current implementation.
- Preserve existing functionality unless the task explicitly requires changing it.

## Existing Portfolio Content

Important existing components include:

- Hero
- Stats
- CityOverview
- ExperienceTower
- DataCenter
- CreativeStudio
- FutureLab
- ContactCenter
- Footer
- Navbar
- LoadingScreen
- ScrollProgress
- BackToTop

Important data files include:

- data/contactData.ts
- data/creativeData.ts
- data/experienceData.ts
- data/futureData.ts
- data/portfolioData.ts
- data/skillsData.ts

These data files are authoritative.

Do not replace their content with invented content.

## Digital Journey Design

The final journey order is:

1. Loading Screen
2. Outer Space
3. Planet Approach
4. Planet Surface / Landing
5. Digital City Entrance
6. HealthBridge District
7. Ezy Map District
8. KV Audio District
9. Story Bloom District
10. Experience Tower
11. Data Center
12. Creative Studio
13. Future Lab
14. Contact Center
15. Footer / Journey Complete

The experience should feel like one continuous cinematic environment.

Use:

- forward camera travel
- smooth transitions
- occasional cinematic turns
- focus moments at important landmarks
- environmental storytelling
- futuristic HUD elements
- terminal/typewriter effects for important system messages
- subtle cyan/teal futuristic lighting
- dark space/city atmosphere

Do not make the experience feel like ordinary webpage sections stacked vertically.

## Architecture

Use a centralized journey controller.

Conceptually:

Browser Scroll
→ Journey Controller
→ progress / velocity / current phase / active landmark
→ Camera + World + UI

Do NOT make every 3D component independently read `window.scrollY`.

Prefer a clean architecture such as:

components/
  Journey/
    JourneyScene
    JourneyController
    JourneyProgress
    JourneyHUD

  World/
    Space/
    Planet/
    Surface/
    City/
    Districts/
    Experience/
    Data/
    Creative/
    Future/
    Contact/

  UI/
    Typewriter
    HUDPanel
    InformationPanel
    ProjectPanel

Create only the folders/components actually needed at each implementation stage.

Do not create the entire architecture with placeholder files at once.

## Current 3D Foundation

The current branch already contains:

- React Three Fiber
- Three.js
- @react-three/drei
- components/Journey/JourneyScene.tsx

The current JourneyScene contains a minimal test scene used to verify that React Three Fiber is working.

Do not remove the working 3D foundation unless the implementation specifically requires replacing it.

## Old Digital City Prototype

The old branch is:

`feature/digital-city-space`

It is a prototype/reference only.

Useful concepts may be reused after inspection, including:

- SceneCanvas
- CameraRig
- ScrollController
- Stars3D
- Atmosphere
- Lights
- Planet
- CityGround
- CityCore
- CityWindows
- CityNeonStrips
- CityEnergyRoutes
- district concepts
- ExperienceTower
- DataCenter
- CreativeDistrict
- JourneyHUD

However:

- Do not cherry-pick the old commits.
- Do not copy the old page implementation wholesale.
- Do not copy old data files over the current data files.
- Do not copy the old package-lock.
- Do not blindly copy old components without understanding them.
- Rebuild or adapt useful concepts into the new architecture.

## Development Method

Work incrementally.

For every implementation phase:

1. Inspect relevant existing files.
2. Explain the intended changes briefly.
3. Make only the changes required for that phase.
4. Run appropriate checks.
5. Fix errors related to the current phase.
6. Review the diff.
7. Stop before starting the next major phase.

Do not silently continue into unrelated phases.

Never make large unrelated refactors.

## Git Safety

Do not:

- commit changes
- push changes
- merge branches
- checkout another branch
- reset the repository
- delete branches

unless explicitly instructed by the user.

The user controls Git history.

## Performance

This is a portfolio website and must remain performant.

Prefer:

- instancing where appropriate
- lightweight geometry
- reasonable particle counts
- lazy loading where appropriate
- reusable materials
- avoiding unnecessary per-frame React state updates
- `useFrame` for animation that belongs in the render loop
- avoiding expensive procedural textures unless necessary

The scene must work on desktop and mobile.

Mobile should simplify effects and geometry rather than becoming a completely different portfolio.

## UI Layering

Existing portfolio content must remain readable above the 3D environment.

3D is the environment.

UI is the information layer.

Do not allow 3D elements to randomly cover important text, buttons, navigation, or controls.

Use deliberate z-index and pointer-event behavior.

## Content

Do not invent portfolio projects, technologies, statistics, experience, education, achievements, or personal information.

Use existing project data and content as the source of truth.

The visual presentation can change, but the factual content must remain correct.

## Verification

After meaningful changes:

- run TypeScript checks when appropriate
- run the development server when visual verification is needed
- inspect browser console errors
- inspect Git diff
- verify existing functionality has not been broken

Never assume a change works without verification.

## Current Development Strategy

The implementation should proceed in small phases.

Phase 1:
Establish the clean Journey foundation and centralized journey state.

Phase 2:
Build Outer Space.

Phase 3:
Build Planet Approach.

Phase 4:
Build Planet Surface / Landing.

Phase 5:
Build Digital City.

Phase 6:
Integrate project districts.

Phase 7:
Integrate Experience Tower and Data Center.

Phase 8:
Integrate Creative Studio and Future Lab.

Phase 9:
Integrate Contact Center and Footer.

Phase 10:
Polish transitions, HUD, typewriter effects, audio, mobile performance, accessibility, and SEO.

Do not implement multiple major phases unless explicitly requested.

## Important Working Principle

The goal is not to replace the existing portfolio.

The goal is to evolve the existing portfolio into a continuous cinematic 3D journey while preserving its finalized content and functionality.

When uncertain about an existing feature, inspect it before changing it.