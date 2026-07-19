import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(
    "https://pasindu-portfolio-rho.vercel.app"
  ),

  title: "Pasindu Kavishka | Software Engineer",

  description:
    "Portfolio of Pasindu Kavishka, a Software Engineer specializing in web development, mobile applications, backend engineering, cloud technologies, and AI-powered solutions.",

  alternates: {
    canonical: "/",
  },

  openGraph: {
    title: "Pasindu Kavishka | Software Engineer",
    description:
      "Software Engineer specializing in web, mobile, backend, cloud, and AI-powered solutions.",
    url: "/",
    siteName: "Pasindu Kavishka Portfolio",
    images: [
      {
        url: "/og/og-image.png",
        width: 1200,
        height: 630,
        alt: "Pasindu Kavishka - Software Engineer",
      },
    ],
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "Pasindu Kavishka | Software Engineer",
    description:
      "Software Engineer specializing in web, mobile, backend, cloud, and AI-powered solutions.",
    images: ["/og/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
