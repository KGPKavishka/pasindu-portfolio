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
                        <div className="mt-20 text-center">

                            <h3 className="text-3xl font-bold">
                                Ready to Build Something Amazing?
                            </h3>

                            <p className="mt-4 text-gray-400 max-w-xl mx-auto">
                                I'm always open to discussing new projects,
                                innovative ideas, and exciting opportunities.
                            </p>

                        </div>
                    </Reveal>

                </div>
            </section>
        </Reveal>
    );
}