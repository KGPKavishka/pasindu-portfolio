import { Project } from "../types/project";

export const projects: Project[] = [
  {
    id: "healthbridge",

    title: "HealthBridge",

    subtitle: "ML-Based Kidney Donor Matching Platform",

    description:
      "A machine learning powered healthcare platform that matches kidney donors and patients using OCR, HLA extraction and compatibility prediction.",

    heroImage: "/projects/healthbridge/cover.jpg",

    accentColor: "#00d4ff",

    emoji: "🏥",

    technologies: [
      "Flutter",
      "FastAPI",
      "PostgreSQL",
      "Redis",
      "Celery",
      "MinIO",
      "Scikit-Learn",
      "OpenCV",
      "Tesseract OCR",
    ],

    architecture: [
      "Flutter App",
      "FastAPI Backend",
      "OCR Pipeline",
      "Machine Learning Engine",
      "PostgreSQL",
    ],

    features: [
      "OCR-based HLA extraction",
      "Kidney donor matching",
      "JWT authentication",
      "Medical report upload",
      "Random Forest prediction",
    ],

    challenges: [
      "Accurate OCR extraction from medical reports",
      "Handling asynchronous ML processing",
      "Managing secure medical data",
    ],

    lessons: [
      "Backend API design",
      "Cloud deployment",
      "Medical AI workflow",
      "FastAPI performance optimization",
    ],

    github:
      "https://github.com/KGPKavishka/Health_Bridge_App",

    demo: "",

    screenshots: [
      "/projects/healthbridge/1.png",
      "/projects/healthbridge/2.png",
      "/projects/healthbridge/3.png",
    ],

    category: "mobile",

    featured: true,
  },

  {
    id: "ezymap",

    title: "Ezy Map",

    subtitle:
      "Multi-Service Taxi, Delivery and Marketplace Platform",

    description:
      "Backend development for a ride hailing, delivery and marketplace platform during my internship. I contributed to authentication, driver management, ride management, seller modules and database architecture using NestJS and PostgreSQL.",

    heroImage: "/projects/ezymap/cover.jpg",

    accentColor: "#f59e0b",

    emoji: "🚕",

    technologies: [
      "NestJS",
      "TypeScript",
      "Prisma ORM",
      "PostgreSQL",
      "JWT",
      "Swagger",
      "DigitalOcean",
      "Class Validator",
      "REST API",
    ],

    architecture: [
      "Mobile Application",
      "NestJS Backend",
      "Authentication Layer",
      "Prisma ORM",
      "PostgreSQL Database",
    ],

    features: [
      "Driver registration & KYC",
      "Ride management",
      "Seller & shop management",
      "JWT authentication",
      "Role-based authorization",
      "Swagger API documentation",
      "RESTful API development",
    ],

    challenges: [
      "Designing complex relational database schemas",
      "Managing multiple user roles",
      "Optimizing Prisma database queries",
      "Implementing secure authentication flows",
    ],

    lessons: [
      "Enterprise backend architecture",
      "Professional REST API development",
      "Database optimization with Prisma",
      "Team collaboration using Git",
    ],

    github: "",

    demo: "",

    screenshots: [
      "/projects/ezymap/1.png",
      "/projects/ezymap/2.png",
      "/projects/ezymap/3.png",
    ],

    category: "internship",

    featured: true,
  },

  {
    id: "kvaudio",

    title: "KV Audio",

    subtitle:
      "Audio Equipment Rental Management Platform",

    description:
      "A full-stack MERN application developed for managing audio equipment rentals with booking management, inventory tracking and an admin dashboard.",

    heroImage: "/projects/kvaudio/cover.jpg",

    accentColor: "#8b5cf6",

    emoji: "🎵",

    technologies: [
      "React",
      "Vite",
      "Node.js",
      "Express.js",
      "MongoDB",
      "JWT",
      "Supabase",
      "Tailwind CSS",
    ],

    architecture: [
      "React Frontend",
      "Express Backend",
      "MongoDB Database",
      "Supabase Storage",
    ],

    features: [
      "Equipment rental booking",
      "JWT authentication",
      "Role-based access control",
      "Admin dashboard",
      "Inventory management",
      "Booking management",
    ],

    challenges: [
      "Managing rental availability",
      "Authentication security",
      "Handling media uploads",
      "Booking validation logic",
    ],

    lessons: [
      "Full-stack MERN architecture",
      "REST API integration",
      "MongoDB data modeling",
      "Modern React development",
    ],

    github:
      "https://github.com/KGPKavishka/kv-audio-frontend",

    demo: "",

    screenshots: [
      "/projects/kvaudio/1.png",
      "/projects/kvaudio/2.png",
      "/projects/kvaudio/3.png",
    ],

    category: "web",

    featured: true,
  },

  {
    id: "storybloom",

    title: "StoryBloom",

    subtitle:
      "Flutter Storytelling Application",

    description:
      "A Flutter mobile application prototype focused on creating an engaging storytelling experience with a modern and responsive user interface.",

    heroImage: "/projects/storybloom/cover.jpg",

    accentColor: "#10b981",

    emoji: "📱",

    technologies: [
      "Flutter",
      "Dart",
      "Firebase",
      "Material Design",
    ],

    architecture: [
      "Flutter Application",
      "Firebase Backend",
      "Cloud Storage",
    ],

    features: [
      "Story library",
      "Interactive reading interface",
      "Reusable widgets",
      "Responsive layouts",
      "Smooth navigation",
    ],

    challenges: [
      "Maintaining UI consistency",
      "Building reusable components",
      "Responsive mobile layouts",
    ],

    lessons: [
      "Flutter widget composition",
      "Mobile UI/UX design",
      "Cross-platform development",
      "Component reusability",
    ],

    github:
      "https://github.com/KGPKavishka/StroryBloom",

    demo: "",

    screenshots: [
      "/projects/storybloom/1.png",
      "/projects/storybloom/2.png",
      "/projects/storybloom/3.png",
    ],

    category: "mobile",

    featured: false,
  },
];