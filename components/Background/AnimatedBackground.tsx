import GlowBlobs from "./GlowBlobs";
import Particles from "./Particles";
import GridOverlay from "./GridOverlay";

export default function AnimatedBackground() {
  return (
    <div
      className="
        fixed
        inset-0
        z-0
        overflow-hidden
        pointer-events-none
      "
    >
      {/* Base Background */}
      <div className="absolute inset-0 bg-[#050816]" />

      {/* Left Soft Light */}
      <div
        className="
          absolute
          left-[-20%]
          top-[-10%]
          h-[70rem]
          w-[70rem]
          rounded-full
          opacity-30
        "
        style={{
          background:
            "radial-gradient(circle, rgba(34,211,238,0.18) 0%, rgba(34,211,238,0.08) 35%, transparent 70%)",
        }}
      />

      {/* Right Purple Light */}
      <div
        className="
          absolute
          right-[-20%]
          top-[10%]
          h-[65rem]
          w-[65rem]
          rounded-full
          opacity-30
        "
        style={{
          background:
            "radial-gradient(circle, rgba(139,92,246,0.16) 0%, rgba(139,92,246,0.06) 35%, transparent 70%)",
        }}
      />

      {/* Bottom Cyan Light */}
      <div
        className="
          absolute
          left-1/2
          bottom-[-30rem]
          h-[60rem]
          w-[60rem]
          -translate-x-1/2
          rounded-full
          opacity-25
        "
        style={{
          background:
            "radial-gradient(circle, rgba(34,211,238,0.14) 0%, rgba(34,211,238,0.05) 40%, transparent 75%)",
        }}
      />

      {/* Animated Glow */}
      <GlowBlobs />

      {/* Floating Particles */}
      <Particles />

      <GridOverlay />
    </div>
  );
}