"use client";

import Reveal from "./Reveal";
import Image from "next/image";

export default function SpaceTransition() {
    return (
        <section
            className="
                relative
                min-h-screen
                overflow-hidden
                bg-[#050816]
                flex
                items-center
                justify-center
            "
        >
            {/* ============================= */}
            {/* Cinematic Space Background */}
            {/* ============================= */}

            <div
                className="
                    absolute
                    inset-0
                    pointer-events-none
                    overflow-hidden
                "
            >
                {/* Background Glow */}
                <div
                    className="
                        absolute
                        inset-0
                        bg-[radial-gradient(circle_at_70%_50%,rgba(14,116,144,0.10),transparent_50%)]
                    "
                />

                {/* Planet Image */}
                <Image
                    src="/images/space-planet-desktop.png"
                    alt=""
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
                        bg-[#050816]/40
                    "
                />

                {/* Center Readability */}
                <div
                    className="
                        absolute
                        inset-0
                        bg-[radial-gradient(circle_at_center,rgba(5,8,22,0.10),rgba(5,8,22,0.55)_90%)]
                    "
                />

                {/* ============================= */}
                {/* TOP SCENE BLEND */}
                {/* Stats -> Space */}
                {/* ============================= */}

                <div
                    className="
                        absolute
                        inset-x-0
                        top-0
                        h-32
                        sm:h-40
                        md:h-48
                        bg-gradient-to-b
                        from-[#050816]
                        via-[#050816]/45
                        to-transparent
                        pointer-events-none
                    "
                />

                {/* Space -> PlanetApproach seamless color transition */}
                <div
                    className="
                        absolute
                        inset-x-0
                        bottom-0
                        h-[50vh]
                        md:h-[0vh]
                        bg-gradient-to-b
                        from-transparent
                        via-[#040915]
                        to-[#040915]
                        pointer-events-none
                    "
                />
            </div>

            {/* ============================= */}
            {/* Small Stars */}
            {/* ============================= */}

            <div className="absolute inset-0 pointer-events-none">
                <span
                    className="
                        absolute
                        top-[15%]
                        left-[18%]
                        w-1
                        h-1
                        rounded-full
                        bg-cyan-300/40
                    "
                />

                <span
                    className="
                        absolute
                        top-[32%]
                        left-[72%]
                        w-[2px]
                        h-[2px]
                        rounded-full
                        bg-white/40
                    "
                />

                <span
                    className="
                        absolute
                        top-[58%]
                        left-[30%]
                        w-[2px]
                        h-[2px]
                        rounded-full
                        bg-cyan-300/30
                    "
                />

                <span
                    className="
                        absolute
                        top-[70%]
                        left-[80%]
                        w-1
                        h-1
                        rounded-full
                        bg-white/30
                    "
                />

                <span
                    className="
                        absolute
                        top-[82%]
                        left-[55%]
                        w-[2px]
                        h-[2px]
                        rounded-full
                        bg-cyan-300/40
                    "
                />
            </div>

            {/* ============================= */}
            {/* Center Journey Content */}
            {/* ============================= */}

            <div className="relative z-10 text-center px-6">
                <Reveal y={20}>
                    <div className="flex flex-col items-center">

                        {/* Top Navigation Line */}
                        <div
                            className="
                                h-20
                                w-px
                                bg-gradient-to-b
                                from-transparent
                                via-cyan-400/30
                                to-cyan-400/10
                            "
                        />

                        {/* Orbit Indicator */}
                        <div className="relative mt-8 flex items-center justify-center">

                            <div
                                className="
                                    absolute
                                    w-24
                                    h-24
                                    rounded-full
                                    border
                                    border-cyan-400/10
                                "
                            />

                            <div
                                className="
                                    absolute
                                    w-16
                                    h-16
                                    rounded-full
                                    border
                                    border-cyan-400/20
                                "
                            />

                            <div
                                className="
                                    w-2
                                    h-2
                                    rounded-full
                                    bg-cyan-400
                                    shadow-[0_0_20px_rgba(34,211,238,0.8)]
                                "
                            />
                        </div>

                        {/* Status */}
                        <p
                            className="
                                mt-16
                                text-[10px]
                                sm:text-xs
                                uppercase
                                tracking-[0.4em]
                                text-cyan-400
                            "
                        >
                            Entering Orbit
                        </p>

                        {/* Heading */}
                        <h2
                            className="
                                mt-5
                                text-3xl
                                sm:text-4xl
                                md:text-5xl
                                font-semibold
                                tracking-tight
                                text-white
                            "
                        >
                            Signal Detected
                        </h2>

                        {/* Description */}
                        <p
                            className="
                                mt-4
                                text-sm
                                sm:text-base
                                text-gray-500
                            "
                        >
                            Approaching the software engineering ecosystem.
                        </p>

                        {/* System Status */}
                        <div
                            className="
                                mt-10
                                flex
                                items-center
                                gap-3
                                rounded-full
                                border
                                border-cyan-400/10
                                bg-cyan-400/[0.03]
                                backdrop-blur-sm
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
                                    shadow-[0_0_10px_rgba(34,211,238,0.8)]
                                "
                            />

                            <span
                                className="
                                    text-[9px]
                                    uppercase
                                    tracking-[0.3em]
                                    text-gray-500
                                "
                            >
                                Digital City // Online
                            </span>
                        </div>

                        {/* Bottom Navigation Line */}
                        <div
                            className="
                                mt-12
                                h-24
                                w-px
                                bg-gradient-to-b
                                from-cyan-400/20
                                to-transparent
                            "
                        />
                    </div>
                </Reveal>
            </div>
        </section>
    );
}