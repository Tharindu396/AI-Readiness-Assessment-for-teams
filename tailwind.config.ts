import type { Config } from "tailwindcss";

// Dark-mode design system: deep navy backgrounds, glassmorphic surfaces,
// vibrant indigo→violet→cyan accent gradients, amber warnings.
const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    fontSize: {
      xs: ["0.75rem", { lineHeight: "1.1rem" }],
      sm: ["0.8125rem", { lineHeight: "1.25rem" }],
      base: ["1rem", { lineHeight: "1.55rem" }],
      lg: ["1.125rem", { lineHeight: "1.65rem" }],
      xl: ["1.375rem", { lineHeight: "1.75rem" }],
      "2xl": ["1.75rem", { lineHeight: "2.1rem" }],
      "3xl": ["2.25rem", { lineHeight: "2.5rem" }],
      "4xl": ["3rem", { lineHeight: "3.2rem" }],
      "5xl": ["4rem", { lineHeight: "4.1rem" }],
    },
    extend: {
      fontFamily: {
        sans: ["var(--font-body)", "system-ui", "sans-serif"],
        serif: ["var(--font-display)", "Georgia", "serif"],
      },
      colors: {
        paper: "#0B1120",
        ink: {
          950: "#F1F5F9",
          900: "#E2E8F0",
          700: "#94A3B8",
          500: "#64748B",
          300: "#475569",
          200: "#334155",
          100: "#1E293B",
          50: "#0F172A",
        },
        accent: {
          50: "rgba(99,102,241,0.08)",
          100: "rgba(99,102,241,0.15)",
          200: "#818CF8",
          500: "#6366F1",
          600: "#4F46E5",
          700: "#4338CA",
        },
        warning: {
          50: "rgba(245,158,11,0.1)",
          100: "rgba(245,158,11,0.2)",
          500: "#F59E0B",
          600: "#D97706",
          700: "#B45309",
        },
        surface: {
          DEFAULT: "rgba(255,255,255,0.05)",
          hover: "rgba(255,255,255,0.08)",
          border: "rgba(255,255,255,0.10)",
          "border-hover": "rgba(255,255,255,0.18)",
        },
        glow: {
          accent: "rgba(99,102,241,0.4)",
          warning: "rgba(245,158,11,0.4)",
          success: "rgba(34,197,94,0.4)",
        },
      },
      maxWidth: {
        prose: "38rem",
        page: "72rem",
      },
      transitionDuration: {
        250: "250ms",
      },
      backdropBlur: {
        glass: "16px",
      },
      keyframes: {
        "fade-slide-in": {
          from: { opacity: "0", transform: "translateY(8px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-8px)" },
        },
        "glow-pulse": {
          "0%, 100%": { opacity: "0.4" },
          "50%": { opacity: "0.8" },
        },
        "slide-up": {
          from: { opacity: "0", transform: "translateY(16px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "scale-in": {
          from: { opacity: "0", transform: "scale(0.95)" },
          to: { opacity: "1", transform: "scale(1)" },
        },
        "meter-fill": {
          from: { width: "0%" },
        },
      },
      animation: {
        "fade-slide-in": "fade-slide-in 400ms ease-out",
        shimmer: "shimmer 2s ease-in-out infinite",
        float: "float 6s ease-in-out infinite",
        "glow-pulse": "glow-pulse 3s ease-in-out infinite",
        "slide-up": "slide-up 500ms ease-out",
        "scale-in": "scale-in 300ms ease-out",
        "meter-fill": "meter-fill 800ms ease-out forwards",
      },
    },
  },
  plugins: [],
};

export default config;
