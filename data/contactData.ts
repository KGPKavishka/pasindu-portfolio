export interface ContactItem {
  id: string;
  title: string;
  value: string;
  href: string;
  icon: string;
}

export const contactItems: ContactItem[] = [
  {
    id: "email",
    title: "Email",
    value: "pasindukv29@gmail.com",
    href: "mailto:pasindukv29@gmail.com",
    icon: "📧",
  },
  {
    id: "phone",
    title: "Phone",
    value: "+94 76 962 9662",
    href: "tel:+94769629662",
    icon: "📱",
  },
  {
    id: "github",
    title: "GitHub",
    value: "github.com/KGPKavishka",
    href: "https://github.com/KGPKavishka",
    icon: "💻",
  },
  {
    id: "linkedin",
    title: "LinkedIn",
    value: "linkedin.com/in/pasindu-kavishka",
    href: "https://www.linkedin.com/in/pasindu-kavishka-695a18280/",
    icon: "💼",
  },
  {
    id: "resume",
    title: "Resume",
    value: "Download CV",
    href: "/resume.pdf",
    icon: "📄",
  },
];