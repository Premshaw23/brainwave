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
  title: {
    default: "BrainWave - AI Learning Platform",
    template: "%s | BrainWave"
  },
  description: "BrainWave is an all-in-one AI-powered platform for students and lifelong learners. Create, share, and study notes, quizzes, flashcards, and join a vibrant learning community. Track your progress with analytics and boost your knowledge efficiently.",
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'BrainWave',
    // icon property removed because it is not valid for AppleWebApp type
  },
  openGraph: {
    title: "BrainWave - AI Learning Platform",
    description: "Collaborative AI-powered learning platform for notes, quizzes, flashcards, analytics, and community.",
    url: "https://brainwave-two-iota.vercel.app/",
    siteName: "BrainWave",
    images: [
      {
        url: "/brain.png",
        width: 512,
        height: 512,
        alt: "BrainWave Logo"
      }
    ],
    locale: "en_US",
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: "BrainWave - AI Learning Platform",
    description: "Collaborative AI-powered learning platform for notes, quizzes, flashcards, analytics, and community.",
    images: [
      "/dashboard-screenshot.png"
    ],
    creator: "@PremShaw"
  }
};

export const viewport = {
  themeColor: '#4f46e5',
};



import { AuthProvider } from "../context/AuthContext";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
