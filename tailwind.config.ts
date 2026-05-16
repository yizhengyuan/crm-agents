import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        crm: {
          ink: "oklch(0.145 0 0)",
          muted: "oklch(0.556 0 0)",
          line: "oklch(0.922 0 0)",
          surface: "oklch(0.985 0 0)",
          primary: "oklch(0.546 0.245 262.881)",
        },
        layer: {
          s: "oklch(0.6 0.18 160)",
          a: "oklch(0.55 0.22 260)",
          b: "oklch(0.5 0.2 290)",
          c: "oklch(0.45 0.05 250)",
          d: "oklch(0.5 0 0)",
        },
      },
      borderRadius: {
        xl: "0.75rem",
        "2xl": "1rem",
      },
    },
  },
  plugins: [],
};

export default config;
