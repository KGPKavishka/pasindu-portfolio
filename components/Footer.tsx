import Link from "next/link";

const MailIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    className="w-7 h-7"
  >
    <rect x="3" y="5" width="18" height="14" rx="2" />
    <path d="M3 7l9 6 9-6" />
  </svg>
);

const GitHubIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className="w-7 h-7"
  >
    <path d="M12 .5A12 12 0 0 0 8.2 23.9c.6.1.8-.3.8-.6v-2.2c-3.3.7-4-1.4-4-1.4-.5-1.3-1.2-1.7-1.2-1.7-1-.7.1-.7.1-.7 1 .1 1.7 1.1 1.7 1.1 1 .1 1.7.8 2 1.4.8 1.3 2.3.9 2.9.7.1-.6.3-1 .6-1.3-2.7-.3-5.5-1.3-5.5-6A4.7 4.7 0 0 1 7.3 9c-.1-.3-.5-1.5.1-3.1 0 0 1-.3 3.2 1.2a11 11 0 0 1 5.8 0c2.2-1.5 3.2-1.2 3.2-1.2.6 1.6.2 2.8.1 3.1a4.7 4.7 0 0 1 1.2 3.2c0 4.7-2.8 5.7-5.5 6 .4.3.7.9.7 1.8v2.7c0 .3.2.7.8.6A12 12 0 0 0 12 .5Z" />
  </svg>
);

const LinkedInIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className="w-7 h-7"
  >
    <path d="M4.98 3.5A2.5 2.5 0 1 0 5 8.5 2.5 2.5 0 0 0 4.98 3.5ZM3 9h4v12H3Zm7 0h3.8v1.7h.1c.5-1 1.8-2.1 3.8-2.1 4 0 4.8 2.6 4.8 6V21h-4v-5.3c0-1.3 0-2.9-1.8-2.9s-2 1.4-2 2.8V21h-4Z" />
  </svg>
);

const ResumeIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    className="w-7 h-7"
  >
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <path d="M14 2v6h6" />
  </svg>
);

const ArrowIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    className="w-4 h-4"
  >
    <path d="M7 17L17 7" />
    <path d="M8 7h9v9" />
  </svg>
);

export default function Footer() {
  const year = new Date().getFullYear();

  const links = [
    {
      title: "Email",
      value: "pasindukv29@gmail.com",
      href: "mailto:pasindukv29@gmail.com",
      action: "Contact",
      icon: <MailIcon />,
      external: false,
    },
    {
      title: "GitHub",
      value: "github.com/KGPKavishka",
      href: "https://github.com/KGPKavishka",
      action: "Open Profile",
      icon: <GitHubIcon />,
      external: true,
    },
    {
      title: "LinkedIn",
      value: "linkedin.com/in/pasindu-kavishka",
      href: "https://www.linkedin.com/in/pasindu-kavishka-695a18280/",
      action: "Connect",
      icon: <LinkedInIcon />,
      external: true,
    },
    {
      title: "Resume",
      value: "Professional Resume",
      href: "/resume.pdf",
      action: "Download",
      icon: <ResumeIcon />,
      external: false,
      download: true,
    },
  ];

  return (
    <footer className="border-t border-white/10 bg-[#050816]">
      <div className="max-w-7xl mx-auto px-6 py-16">

        {/* Header */}
        <div className="text-center">
          <h2 className="text-3xl font-bold">
            Pasindu Kavishka
          </h2>

          <p className="mt-3 text-sm uppercase tracking-[0.35em] text-cyan-400">
            Software Engineer
          </p>

          <p className="mx-auto mt-6 max-w-xl text-gray-400 leading-8">
            Building scalable web, mobile, cloud and AI-powered
            solutions with a passion for creating modern digital
            experiences.
          </p>
        </div>

        {/* Divider */}
        <div className="my-12 h-px bg-white/10" />

        {/* Links */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          {links.map((item) => (
            <Link
              key={item.title}
              href={item.href}
              target={item.external ? "_blank" : undefined}
              rel={item.external ? "noopener noreferrer" : undefined}
              download={item.download}
              className="
                group
                flex
                flex-col
                items-center
                text-center
                rounded-2xl
                px-4
                py-5
                transition-all
                duration-300
                hover:-translate-y-2
                hover:bg-white/[0.03]
                sm:px-2
                sm:py-0
                sm:hover:bg-transparent
              "
            >
              <div
                className="
                  flex
                  h-16
                  w-16
                  items-center
                  justify-center
                  rounded-2xl
                  border
                  border-cyan-500/20
                  bg-cyan-500/10
                  text-cyan-400
                  transition-all
                  duration-300
                  group-hover:scale-110
                  group-hover:border-cyan-400
                  group-hover:shadow-lg
                  group-hover:shadow-cyan-500/20
                "
              >
                {item.icon}
              </div>

              <h3 className="mt-5 text-lg font-semibold">
                {item.title}
              </h3>

              <p
                className="
                  mt-2
                  max-w-full
                  text-sm
                  text-gray-400
                  break-words
                "
              >
                {item.value}
              </p>

              <div
                className="
                  mt-5
                  flex
                  items-center
                  gap-2
                  text-cyan-400
                  opacity-0
                  transition-all
                  duration-300
                  group-hover:opacity-100
                "
              >
                <span className="text-sm">
                  {item.action}
                </span>

                <ArrowIcon />
              </div>
            </Link>
          ))}
        </div>

        {/* Divider */}
        <div className="my-12 h-px bg-white/10" />

        {/* Bottom */}
        <div className="flex flex-col items-center gap-3 text-center text-sm text-gray-500">
          <p>
            © {year} Pasindu Kavishka. All Rights Reserved.
          </p>

          <p>
            Built with{" "}
            <span className="text-cyan-400">
              Next.js
            </span>
            {" • "}
            <span className="text-cyan-400">
              TypeScript
            </span>
            {" • "}
            <span className="text-cyan-400">
              Tailwind CSS
            </span>
          </p>
        </div>

      </div>
    </footer>
  );
}