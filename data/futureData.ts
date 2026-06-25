export interface FutureSkill {
  id: string;
  title: string;
  progress: number;
  icon: string;
  description: string;
  color: string;
}

export const futureSkills: FutureSkill[] = [
  {
    id: "ai-engineering",
    title: "AI Engineering",
    progress: 65,
    icon: "🤖",
    description:
      "Building intelligent applications using AI models and automation.",
    color: "purple",
  },

  {
    id: "machine-learning",
    title: "Machine Learning",
    progress: 60,
    icon: "🧠",
    description:
      "Exploring model training, evaluation and production deployment.",
    color: "pink",
  },

  {
    id: "cloud-computing",
    title: "Cloud Computing",
    progress: 55,
    icon: "☁️",
    description:
      "Learning scalable cloud infrastructure and deployment strategies.",
    color: "blue",
  },

  {
    id: "system-design",
    title: "System Design",
    progress: 50,
    icon: "🏗️",
    description:
      "Designing scalable backend architectures and distributed systems.",
    color: "green",
  },

  {
    id: "docker",
    title: "Docker",
    progress: 45,
    icon: "🐳",
    description:
      "Containerizing applications for consistent deployment.",
    color: "cyan",
  },

  {
    id: "Kubernetes",
    title: "Kubernetes",
    progress: 35,
    icon: "⚙️",
    description:
      "Learning orchestration of containerized applications.",
    color: "indigo",
  },

  {
    id: "aws",
    title: "AWS",
    progress: 40,
    icon: "🚀",
    description:
      "Exploring cloud services for modern application hosting.",
    color: "orange",
  },

  {
    id: "llms",
    title: "LLMs",
    progress: 50,
    icon: "💡",
    description:
      "Experimenting with large language models and AI assistants.",
    color: "rose",
  },
];