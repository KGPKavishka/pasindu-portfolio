import { futureSkills } from "../data/futureData";
import FutureCard from "./FutureCard";
import MissionCard from "./MissionCard";

export default function FutureLab() {
    return (
        <section className="py-24 px-6">
            <div className="max-w-7xl mx-auto">

                {/* Heading */}
                <div className="max-w-2xl">

                    <div className="inline-flex items-center gap-3">

                        <div className="w-3 h-3 rounded-full bg-cyan-400 animate-pulse" />

                        <span className="text-cyan-400 font-medium tracking-wide uppercase">
                            Looking Ahead
                        </span>

                    </div>

                    <h2 className="text-5xl font-bold mt-4">
                        Future Lab
                    </h2>

                    <p className="text-gray-400 mt-6 leading-8 max-w-3xl">
                        I'm continuously exploring new technologies
                        that will help me build scalable, intelligent
                        and production-ready software.
                    </p>

                </div>

                {/* Content */}
                <div className="grid lg:grid-cols-3 gap-10 mt-16">

                    {/* Learning Cards */}
                    <div className="lg:col-span-2 grid md:grid-cols-2 gap-6">

                        {futureSkills.map((skill) => (
                            <FutureCard
                                key={skill.id}
                                icon={skill.icon}
                                title={skill.title}
                                description={skill.description}
                                progress={skill.progress}
                                color={skill.color}
                            />
                        ))}

                    </div>

                    {/* Mission */}
                    <div>

                        <MissionCard />

                    </div>

                </div>

            </div>
        </section>
    );
}