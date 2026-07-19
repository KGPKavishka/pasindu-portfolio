"use client";

export default function GridOverlay() {
  return (
    <div
      className="
        absolute
        inset-[-60px]
        animate-grid
        opacity-[0.06]
        [mask-image:radial-gradient(circle_at_center,black_35%,transparent_100%)]
        [-webkit-mask-image:radial-gradient(circle_at_center,black_35%,transparent_100%)]
      "
      style={{
        backgroundImage: `
          linear-gradient(
            rgba(34,211,238,0.12) 1px,
            transparent 1px
          ),
          linear-gradient(
            90deg,
            rgba(34,211,238,0.12) 1px,
            transparent 1px
          )
        `,
        backgroundSize: "60px 60px",
      }}
    />
  );
}