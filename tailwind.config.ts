import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        corporate: {
          50: "#F4F7FB",
          100: "#E6EDF7",
          200: "#D9E2F3",
          300: "#ADC2E4",
          400: "#5D85C5",
          500: "#2B579A",
          600: "#1F3864",
          700: "#192D50",
          800: "#13223D",
          900: "#0D172A",
        },
      },
    },
  },
  plugins: [],
};
export default config;
