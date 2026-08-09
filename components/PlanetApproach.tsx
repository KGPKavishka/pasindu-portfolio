"use client";

import Image from "next/image";
import Reveal from "./Reveal";

export default function PlanetApproach() {
    return (
        <section
            className="
                relative
                min-h-screen
                overflow-hidden
                bg-[#040915]
                flex
                items-center
                justify-center
            "
        >
            {/* ============================= */}
            {/* Digital City Background */}
            {/* ============================= */}

            <div
                className="
                    absolute
                    inset-0
                    pointer-events-none
                    overflow-hidden
                "
            >
                {/* Digital City Image */}
                <Image
                    src="/images/digital-city-planet-desktop.jpg"
                    alt="Digital City"
                    fill
                    sizes="100vw"
                    className="
                        object-cover
                        object-center
                        opacity-55
                    "
                    priority
                />

                {/* Base Dark Overlay */}
                <div
                    className="
                        absolute
                        inset-0
                        bg-[#050816]/45
                    "
                />

                {/* Center Readability */}
                <div
                    className="
                        absolute
                        inset-0
                        bg-[radial-gradient(circle_at_center,rgba(5,8,22,0.15),rgba(5,8,22,0.55)_75%)]
                    "
                />

                {/* ============================= */}
                {/* TOP SCENE BLEND */}
                {/* Continue from SpaceTransition */}
                {/* ============================= */}

                <div
                    className="
                        absolute
                        inset-x-0
                        top-0
                        h-[32vh]
                        sm:h-[35vh]
                        md:h-[4vh]
                        bg-[linear-gradient(to_bottom,#040915_0%,#040915_12%,transparent_100%)]
                        pointer-events-none
                    "
                />

                {/* ============================= */}
                {/* BOTTOM SCENE BLEND */}
                {/* Digital City -> Next Section */}
                {/* ============================= */}

                <div
                    className="
                        absolute
                        inset-x-0
                        bottom-0
                        h-32
                        sm:h-40
                        md:h-48
                        bg-gradient-to-b
                        from-transparent
                        via-[#050816]/45
                        to-[#050816]
                        pointer-events-none
                    "
                />
            </div>

            {/* ============================= */}
            {/* Ambient Cyan Glow */}
            {/* ============================= */}

            <div
                className="
                    absolute
                    left-1/2
                    bottom-[-200px]
                    -translate-x-1/2
                    w-[900px]
                    h-[500px]
                    rounded-full
                    bg-cyan-500/[0.08]
                    blur-[160px]
                    pointer-events-none
                "
            />

            {/* ============================= */}
            {/* Main Content */}
            {/* ============================= */}

            <div
                className="
                    relative
                    z-10
                    w-full
                    px-6
                    text-center
                "
            >
                <Reveal y={30}>
                    <div className="flex flex-col items-center">

                        {/* Status */}
                        <p
                            className="
                                text-[10px]
                                sm:text-xs
                                uppercase
                                tracking-[0.45em]
                                text-cyan-400
                            "
                        >
                            Destination Identified
                        </p>

                        {/* Heading */}
                        <h2
                            className="
                                mt-5
                                text-4xl
                                sm:text-5xl
                                md:text-6xl
                                font-bold
                                tracking-tight
                                text-white
                            "
                        >
                            Digital City
                        </h2>

                        {/* Description */}
                        <p
                            className="
                                mt-5
                                max-w-xl
                                text-sm
                                sm:text-base
                                text-gray-300
                                leading-relaxed
                            "
                        >
                            A software engineering ecosystem built from projects,
                            experience, technology and innovation.
                        </p>

                        {/* City Connection Status */}
                        <div
                            className="
                                mt-8
                                flex
                                items-center
                                gap-3
                                rounded-full
                                border
                                border-cyan-400/20
                                bg-black/20
                                backdrop-blur-md
                                px-5
                                py-2
                            "
                        >
                            <span
                                className="
                                    w-1.5
                                    h-1.5
                                    rounded-full
                                    bg-cyan-400
                                    shadow-[0_0_12px_rgba(34,211,238,0.9)]
                                "
                            />

                            <span
                                className="
                                    text-[9px]
                                    uppercase
                                    tracking-[0.3em]
                                    text-gray-400
                                "
                            >
                                City Core // Connection Established
                            </span>
                        </div>
                    </div>
                </Reveal>
            </div>

            {/* ============================= */}
            {/* Continue Indicator */}
            {/* ============================= */}

            <div
                className="
                    absolute
                    bottom-10
                    left-1/2
                    -translate-x-1/2
                    z-10
                    flex
                    flex-col
                    items-center
                    gap-3
                "
            >
                <span
                    className="
                        text-[9px]
                        uppercase
                        tracking-[0.35em]
                        text-gray-500
                    "
                >
                    Enter the City
                </span>

                <span className="text-cyan-400 text-lg">
                    ↓
                </span>
            </div>
        </section>
    );
}