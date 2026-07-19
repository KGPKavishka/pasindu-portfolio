export interface Project {
  id: string;

  title: string;

  subtitle: string;

  description: string;

  heroImage: string;

  emoji: string;

  accentColor?: string;

  technologies: string[];

  architecture: string[];

  features: string[];

  challenges: string[];

  lessons: string[];

  github: string;

  demo?: string;

  screenshots: string[];

  category?: string;
  featured?: boolean;

}