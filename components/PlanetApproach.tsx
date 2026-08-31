"use client";

import Reveal from "./Reveal";

export default function PlanetApproach() {
    return (
        <section
            className="
                relative
                min-h-screen
                flex
                items-center
                justify-center
                overflow-hidden
            "
        >
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
                            A software engineering ecosystem built from
                            projects, experience, technology and innovation.
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
                                bg-cyan-400/[0.03]
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