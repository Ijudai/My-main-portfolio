import type { Metadata } from "next";
import { Bebas_Neue, DM_Sans } from "next/font/google";
import "./globals.css";

const bebasNeue = Bebas_Neue({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-bebas-neue",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
});

export const metadata: Metadata = {
  title: "Waida Alpha Wayne | Creative Strategist",
  description: "I turn creative ideas into ecommerce growth. Specialized in Ecommerce & SME brands.",
};

import CursorGlow from "@/components/ui/CursorGlow";
import ParticleBackground from "@/components/ui/ParticleBackground";
import Navigation from "@/components/layout/Navigation";
import Footer from "@/components/layout/Footer";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${bebasNeue.variable} ${dmSans.variable} font-sans antialiased bg-[#0a0a0f] text-[#e8f0ff] overflow-x-hidden`}
      >
        <div className="noise-overlay" />
        <CursorGlow />
        <ParticleBackground />
        <Navigation />
        <main className="relative z-0 pt-20 lg:pt-0">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
