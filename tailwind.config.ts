import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        crm: {
          ink: "#172033",
          muted: "#64748b",
          line: "#e2e8f0",
          surface: "#f8fafc",
          primary: "#2563eb"
        }
      }
    }
  },
  plugins: []
};

export default config;
