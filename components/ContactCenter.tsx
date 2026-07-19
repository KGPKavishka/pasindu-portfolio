import ContactCard from "./ContactCard";
import { contactItems } from "../data/contactData";
import Reveal from "./Reveal";

export default function ContactCenter() {
    return (
        <Reveal delay={0.5}>
            <section
                id="contact"
                className="py-24 px-6"
            >
                <div className="max-w-7xl mx-auto">

                    {/* Section Heading */}

                    <span className="uppercase tracking-[0.3em] text-cyan-400 text-sm font-medium">
                        Contact
                    </span>

                    <h2 className="mt-3 text-4xl sm:text-5xl font-bold">
                        Contact Center
                    </h2>

                    <p className="mt-6 text-gray-400 max-w-2xl leading-8">
                        Let's build scalable applications,
                        collaborate on exciting ideas,
                        and create something amazing together.
                    </p>

                    {/* Contact Cards */}

                    <div className="mt-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

                        {contactItems.map((item, index) => (
                            <Reveal
                                key={item.id}
                                delay={index * 0.08}
                                y={30}
                            >
                                <div className="h-full">
                                    <ContactCard
                                        icon={item.icon}
                                        title={item.title}
                                        value={item.value}
                                        href={item.href}
                                    />
                                </div>
                            </Reveal>
                        ))}

                    </div>

                    {/* Bottom CTA */}

                    <Reveal delay={0.7}>
                        {/* CTA */}
                        <div className="mt-24 text-center">

                            <span
                                className="
                                    uppercase
                                    tracking-[0.3em]
                                    text-cyan-400
                                    text-sm
                                    font-medium
                                "
                            >
                                Let's Connect
                            </span>

                            <h2
                                className="
                                    mt-4
                                    text-4xl
                                    md:text-5xl
                                    font-bold
                                "
                            >
                                Ready to Build Together?
                            </h2>

                            <p
                                className="
                                    mt-6
                                    max-w-2xl
                                    mx-auto
                                    text-gray-400
                                    leading-8
                                "
                            >
                                Let's create scalable web applications,
                                cloud platforms, mobile experiences,
                                and AI-powered solutions.

                                <br />
                                <br />

                                Whether you're looking for a backend engineer,
                                full-stack developer, or collaboration partner,
                                I'd love to hear from you.
                            </p>

                            <div className="mt-10 flex justify-center">

                                <a
                                    href="mailto:pasindukv29@gmail.com"
                                    className="
                                        group
                                        inline-flex
                                        items-center
                                        gap-3
                                        rounded-full
                                        border
                                        border-cyan-400/30
                                        bg-cyan-500/10
                                        px-8
                                        py-4
                                        font-semibold
                                        text-cyan-300
                                        transition-all
                                        duration-300
                                        hover:-translate-y-1
                                        hover:border-cyan-300
                                        hover:bg-cyan-500/20
                                        hover:shadow-xl
                                        hover:shadow-cyan-500/20
                                    "
                                >
                                    <span className="text-xl">
                                        ✉
                                    </span>

                                    <span>
                                        Get In Touch
                                    </span>

                                    <span
                                        className="
                                            transition-transform
                                            duration-300
                                            group-hover:translate-x-1
                                        "
                                    >
                                        →
                                    </span>

                                </a>

                            </div>

                            <div className="mt-8 flex flex-wrap justify-center gap-3">

                                <span
                                    className="
                                        rounded-full
                                        border
                                        border-emerald-500/30
                                        bg-emerald-500/10
                                        px-4
                                        py-2
                                        text-sm
                                        text-emerald-300
                                    "
                                >
                                    ● Available for Full-Time
                                </span>

                                <span
                                    className="
                                        rounded-full
                                        border
                                        border-cyan-500/30
                                        bg-cyan-500/10
                                        px-4
                                        py-2
                                        text-sm
                                        text-cyan-300
                                    "
                                >
                                    Remote Friendly
                                </span>

                                <span
                                    className="
                                        rounded-full
                                        border
                                        border-violet-500/30
                                        bg-violet-500/10
                                        px-4
                                        py-2
                                        text-sm
                                        text-violet-300
                                    "
                                >
                                    Sri Lanka 🇱🇰
                                </span>

                            </div>

                        </div>
                    </Reveal>

                </div>
            </section>
        </Reveal>
    );
}