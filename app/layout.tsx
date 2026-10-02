import type { Metadata } from "next";
import { Space_Grotesk, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import CustomCursor from "@/components/cursor/CustomCursor";
import SignatureIntro from "@/components/ui/SignatureIntro";
import LiquidGlassFilter from "@/components/ui/LiquidGlassFilter";
import RibbonTrail from "@/components/ui/RibbonTrail";
import Header from "@/components/layout/Header";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: "Eshwar Gottupalli — AI/ML Engineer",
  description:
    "Portfolio of Eshwar Gottupalli, an AI/ML engineer working across computer vision, embedded systems, and LLM-powered applications.",
  openGraph: {
    title: "Eshwar Gottupalli — AI/ML Engineer",
    description:
      "Portfolio of Eshwar Gottupalli, an AI/ML engineer working across computer vision, embedded systems, and LLM-powered applications.",
    type: "website",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} ${jetbrainsMono.variable} antialiased`}
    >
      <body className="flex min-h-screen flex-col">
        <RibbonTrail />
        <LiquidGlassFilter />
        <SignatureIntro />
        <CustomCursor />
        <Header />
        <main className="flex-1">{children}</main>
      </body>
    </html>
  );
}
