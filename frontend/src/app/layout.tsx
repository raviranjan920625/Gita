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
  title: "Bhagavad Gita Wisdom Platform",
  description: "Explore the eternal wisdom of the Bhagavad Gita",
};

import ParticleFlow from "./components/ParticleFlow";
import SplashScreen from "./components/ui/SplashScreen";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body style={{ margin: 0, padding: 0 }}>
        <div className="app-wrapper">
          <SplashScreen />
          <ParticleFlow />
          <div className="particle-overlay" />
          {children}
        </div>
      </body>
    </html>
  );
}
