import type { Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        ink: "#11110f",
        paper: "#f3f1eb",
        chalk: "#faf9f5",
        stone: "#d8d4ca",
        muted: "#696760",
        cobalt: "#2447d8",
      },
      fontFamily: {
        sans: ["Archivo Variable", "Arial", "sans-serif"],
        serif: ["Instrument Serif", "Georgia", "serif"],
      },
      letterSpacing: {
        tightest: "-0.065em",
      },
      maxWidth: {
        frame: "1600px",
      },
      transitionTimingFunction: {
        editorial: "cubic-bezier(0.22, 1, 0.36, 1)",
      },
      keyframes: {
        marquee: {
          from: { transform: "translateX(0)" },
          to: { transform: "translateX(-50%)" },
        },
      },
      animation: {
        marquee: "marquee 28s linear infinite",
      },
    },
  },
  plugins: [],
} satisfies Config;
