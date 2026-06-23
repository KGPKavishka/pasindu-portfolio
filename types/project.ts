export interface Project {
  id: string;

  title: string;

  subtitle: string;

  description: string;

  technologies: string[];

  github?: string;

  demo?: string;

  image?: string;

  category:
    | "research"
    | "internship"
    | "web"
    | "mobile";

  featured: boolean;

  architecture?: string[];

  challenges?: string[];

  achievements?: string[];
}