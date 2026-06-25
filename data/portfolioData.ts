import { Project } from "../types/project";

export const projects: Project[] = [
  {
    id: "healthbridge",

    title: "HealthBridge",

    emoji: "🏥",

    subtitle:
      "ML-Based Kidney Donor Matching Platform",

    description:
      "A machine learning powered mobile application for kidney donor and patient matching.",

    technologies: [
      "Flutter",
      "FastAPI",
      "PostgreSQL",
      "Redis",
      "Celery",
      "MinIO",
      "OpenCV",
      "Tesseract OCR",
      "Scikit-Learn"
    ],

    category: "research",

    featured: true,

    github:
      "https://github.com/KGPKavishka/Health_Bridge_App",

    architecture: [
      "Flutter",
      "FastAPI",
      "OCR Engine",
      "ML Engine",
      "PostgreSQL"
    ],

    achievements: [
      "96.1% OCR Accuracy",
      "88.3% ML Accuracy"
    ]
  },

  {
    id: "ezymap",

    title: "Ezy Map",

    emoji: "🚕",

    subtitle:
      "Multi-Service Taxi, Delivery and Marketplace Platform",

    description:
      "Backend development for a ride hailing, delivery and marketplace platform during internship.",

    technologies: [
      "NestJS",
      "TypeScript",
      "Prisma",
      "PostgreSQL",
      "Swagger",
      "JWT"
    ],

    category: "internship",

    featured: true,

    architecture: [
      "Mobile App",
      "NestJS API",
      "Prisma ORM",
      "PostgreSQL"
    ],

    achievements: [
      "600+ Internship Hours",
      "REST API Development",
      "Database Design",
      "Authentication & Authorization"
    ]
  },

  {
    id: "kvaudio",

    title: "KV Audio",

    emoji: "🎵",

    subtitle:
      "Audio Equipment Rental Management Platform",

    description:
      "Full-stack audio equipment rental management platform built independently using the MERN stack.",

    technologies: [
      "React",
      "Vite",
      "Node.js",
      "Express.js",
      "MongoDB",
      "JWT",
      "Supabase"
    ],

    category: "web",

    featured: true,

    github:
      "https://github.com/KGPKavishka/kv-audio-frontend",

    architecture: [
      "React Frontend",
      "Express API",
      "MongoDB",
      "Supabase Storage"
    ],

    achievements: [
      "JWT Authentication",
      "Role-Based Access Control",
      "Admin Dashboard",
      "Rental Booking System"
    ]
  },

  {
    id: "storybloom",

    title: "StoryBloom",

    emoji: "📱",

    subtitle:
      "Flutter Storytelling Application",

    description:
      "Built the initial UI prototype for a Flutter storytelling application.",

    technologies: [
      "Flutter",
      "Dart"
    ],

    category: "mobile",

    featured: false,

    github:
      "https://github.com/KGPKavishka/StroryBloom",

    achievements: [
      "Reusable Widgets",
      "Responsive Layouts",
      "Navigation Design"
    ]
  }
];