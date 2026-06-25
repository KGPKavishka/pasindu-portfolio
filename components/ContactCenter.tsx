import ContactCard from "./ContactCard";
import { contactItems } from "../data/contactData";

export default function ContactCenter() {
    return (
        <section className="py-24 px-6">
            <div className="max-w-7xl mx-auto">

                {/* Heading */}
                <div className="max-w-2xl">
                    <span className="text-cyan-400 font-medium uppercase tracking-wider">
                        Contact
                    </span>

                    <h2 className="mt-4 text-5xl font-bold">
                        Let's Build Something Together
                    </h2>

                    <p className="mt-6 text-gray-400 leading-8">
                        Whether it's a software project, collaboration,
                        internship opportunity or simply a conversation
                        about technology, feel free to reach out.
                    </p>
                </div>

                {/* Contact Cards */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-16">

                    {contactItems.map((item) => (
                        <ContactCard
                            key={item.id}
                            icon={item.icon}
                            title={item.title}
                            value={item.value}
                            href={item.href}
                        />
                    ))}

                </div>

            </div>
        </section>
    );
}