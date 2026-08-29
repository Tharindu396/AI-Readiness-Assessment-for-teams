import type { Metadata } from "next";
import { Fraunces, Inter } from "next/font/google";
import "./globals.css";

const body = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

const display = Fraunces({
  subsets: ["latin"],
  weight: ["500", "600"],
  variable: "--font-display",
  display: "swap",
});

export const metadata: Metadata = {
  title: "AI Readiness Assessment",
  description:
    "Measure your organization's AI readiness across five dimensions. A ten-question pulse survey reveals tooling access, usage depth, skill confidence, policy clarity, and workflow integration — team by team.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${body.variable} ${display.variable}`}>
      <body className="relative min-h-dvh">
        {/* Ambient glow orbs behind content for depth */}
        <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
          <div className="accent-orb left-[10%] top-[10%] h-[500px] w-[500px] bg-accent-600/[0.07]" />
          <div className="accent-orb right-[5%] top-[60%] h-[400px] w-[400px] bg-violet-500/[0.05]" style={{ animationDelay: "1.5s" }} />
          <div className="accent-orb left-[50%] bottom-[5%] h-[350px] w-[350px] bg-cyan-500/[0.04]" style={{ animationDelay: "3s" }} />
        </div>
        {children}
      </body>
    </html>
  );
}
