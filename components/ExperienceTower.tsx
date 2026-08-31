"use client";

import { experiences } from "../data/experienceData";
import Reveal from "./Reveal";

export default function ExperienceTower() {
    return (
        <section
            id="experience"
            className="
                relative
                min-h-screen
                overflow-hidden
                px-6
                py-24
                sm:px-10
                lg:px-16
            "
        >
            <div
                className="
                    relative
                    z-10
                    mx-auto
                    w-full
                    max-w-7xl
                "
            >
                {/* ============================= */}
                {/* Section Heading */}
                {/* ============================= */}

                <Reveal y={30}>
                    <div className="text-center">
                        <span
                            className="
                                uppercase
                                tracking-[0.3em]
                                text-cyan-400
                                text-sm
                                font-medium
                            "
                        >
                            Experience
                        </span>

                        <h2
                            className="
                                mt-3
                                text-4xl
                                sm:text-5xl
                                font-bold
                                text-white
                            "
                        >
                            Experience Tower
                        </h2>

                        <p
                            className="
                                mx-auto
                                mt-6
                                max-w-2xl
                                text-gray-400
                                leading-8
                            "
                        >
                            Professional experience and industry exposure.
                        </p>
                    </div>
                </Reveal>

                {/* ============================= */}
                {/* Experience Entries */}
                {/* ============================= */}

                <div className="mt-12">
                    {experiences.map((experience, index) => (
                        <Reveal
                            key={experience.company}
                            delay={index * 0.12}
                            y={40}
                        >
                            <div
                                className="
                                    rounded-3xl
                                    border
                                    border-white/10
                                    bg-white/[0.035]
                                    p-6
                                    backdrop-blur-sm
                                    transition-all
                                    duration-300
                                    hover:border-cyan-500/30
                                    hover:bg-white/[0.045]
                                    hover:shadow-lg
                                    hover:shadow-cyan-500/10
                                    sm:p-8
                                "
                            >
                                {/* ============================= */}
                                {/* Header */}
                                {/* ============================= */}

                                <div
                                    className="
                                        flex
                                        flex-col
                                        gap-10
                                        lg:flex-row
                                        lg:items-start
                                        lg:justify-between
                                    "
                                >
                                    {/* Experience Information */}

                                    <div className="flex-1">
                                        <h3
                                            className="
                                                text-3xl
                                                font-bold
                                                text-white
                                            "
                                        >
                                            {experience.company}
                                        </h3>

                                        <p
                                            className="
                                                mt-2
                                                font-medium
                                                text-cyan-400
                                            "
                                        >
                                            {experience.role}
                                        </p>

                                        <p
                                            className="
                                                mt-1
                                                text-gray-400
                                            "
                                        >
                                            {experience.duration}
                                        </p>

                                        <p
                                            className="
                                                mt-6
                                                max-w-2xl
                                                leading-8
                                                text-gray-300
                                            "
                                        >
                                            {experience.description}
                                        </p>
                                    </div>

                                    {/* ============================= */}
                                    {/* Hours Card */}
                                    {/* ============================= */}

                                    <div
                                        className="
                                            mx-auto
                                            w-full
                                            rounded-2xl
                                            border
                                            border-cyan-500/20
                                            bg-cyan-500/10
                                            px-6
                                            py-5
                                            sm:w-48
                                            lg:mx-0
                                            lg:w-40
                                        "
                                    >
                                        <div className="text-center">
                                            <p
                                                className="
                                                    text-5xl
                                                    font-bold
                                                    text-cyan-400
                                                "
                                            >
                                                600+
                                            </p>

                                            <p
                                                className="
                                                    mt-2
                                                    text-sm
                                                    text-gray-400
                                                "
                                            >
                                                Hours Completed
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* ============================= */}
                                {/* Project */}
                                {/* ============================= */}

                                <div className="mt-10">
                                    <h4
                                        className="
                                            mb-4
                                            text-xl
                                            font-bold
                                            text-white
                                        "
                                    >
                                        Project
                                    </h4>

                                    <div
                                        className="
                                            inline-flex
                                            items-center
                                            gap-2
                                            rounded-xl
                                            border
                                            border-cyan-500/20
                                            bg-cyan-500/10
                                            px-5
                                            py-3
                                            transition-all
                                            duration-300
                                            hover:-translate-y-1
                                            hover:border-cyan-400
                                            hover:bg-cyan-500/20
                                        "
                                    >
                                        <span className="text-xl">
                                            🚕
                                        </span>

                                        <span className="font-medium text-white">
                                            {experience.project}
                                        </span>
                                    </div>
                                </div>

                                {/* ============================= */}
                                {/* Technologies */}
                                {/* ============================= */}

                                <div className="mt-10">
                                    <h4
                                        className="
                                            mb-4
                                            text-xl
                                            font-bold
                                            text-white
                                        "
                                    >
                                        Technologies
                                    </h4>

                                    <div className="flex flex-wrap gap-3">
                                        {experience.technologies.map((tech) => (
                                            <span
                                                key={tech}
                                                className="
                                                    rounded-full
                                                    border
                                                    border-white/10
                                                    bg-white/[0.035]
                                                    px-3
                                                    py-1.5
                                                    text-sm
                                                    text-gray-300
                                                    transition-all
                                                    duration-300
                                                    hover:border-cyan-400
                                                    hover:text-cyan-300
                                                "
                                            >
                                                {tech}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                {/* ============================= */}
                                {/* Key Contributions */}
                                {/* ============================= */}

                                <div className="mt-10">
                                    <h4
                                        className="
                                            mb-4
                                            text-xl
                                            font-bold
                                            text-white
                                        "
                                    >
                                        Key Contributions
                                    </h4>

                                    <div
                                        className="
                                            grid
                                            grid-cols-1
                                            gap-4
                                            md:grid-cols-2
                                        "
                                    >
                                        {experience.achievements.map((item) => (
                                            <div
                                                key={item}
                                                className="
                                                    rounded-xl
                                                    border
                                                    border-white/10
                                                    bg-white/[0.035]
                                                    p-4
                                                    text-gray-300
                                                    transition-all
                                                    duration-300
                                                    hover:border-cyan-500/30
                                                    hover:bg-white/[0.05]
                                                "
                                            >
                                                <span className="mr-2 text-cyan-400">
                                                    ✓
                                                </span>

                                                {item}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </Reveal>
                    ))}
                </div>
            </div>
        </section>
    );
}