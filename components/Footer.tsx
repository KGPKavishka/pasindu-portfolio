import Link from "next/link";

import { contactItems } from "@/data/contactData";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer
      id="journey-complete"
      className="flex min-h-[60vh] flex-col items-center justify-end px-6 pb-10 text-center"
    >
      <nav aria-label="Footer contact links" className="flex flex-wrap justify-center gap-x-5 gap-y-2 border-y border-cyan-300/15 py-3">
        {contactItems
          .filter((item) => ["email", "github", "linkedin", "resume"].includes(item.id))
          .map((item) => {
            const external = item.href.startsWith("http");

            return (
              <Link
                key={item.id}
                href={item.href}
                target={external ? "_blank" : undefined}
                rel={external ? "noopener noreferrer" : undefined}
                download={item.id === "resume"}
                className="terminal-link"
              >
                {item.title}
              </Link>
            );
          })}
      </nav>
      <p className="terminal-meta mt-4 text-white/35">
        © {year} Pasindu Kavishka
      </p>
    </footer>
  );
}