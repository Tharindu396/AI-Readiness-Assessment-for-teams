import type { Config } from "tailwindcss";

// One type scale, one spacing scale (Tailwind's default 4px rhythm, used as-is —
// no arbitrary values), one accent, one warning, everything else neutral "ink".
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
        paper: "#FBFAF8",
        ink: {
          950: "#15151A",
          900: "#1D1D24",
          700: "#44444E",
          500: "#6E6E78",
          300: "#A9A9B2",
          200: "#D9D9DE",
          100: "#EAEAED",
          50: "#F4F4F5",
        },
        accent: {
          50: "#EEF0FA",
          100: "#DCE0F4",
          200: "#B7BFE5",
          500: "#3B4EA8",
          600: "#2E3E8C",
          700: "#242F6E",
        },
        warning: {
          50: "#FBEFE4",
          100: "#F6DEC8",
          500: "#B5651D",
          600: "#98531B",
          700: "#7A4211",
        },
      },
      maxWidth: {
        prose: "38rem",
        page: "72rem",
      },
      transitionDuration: {
        250: "250ms",
      },
      keyframes: {
        "fade-slide-in": {
          from: { opacity: "0", transform: "translateY(6px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "fade-slide-in": "fade-slide-in 300ms ease-out",
      },
    },
  },
  plugins: [],
};

export default config;
