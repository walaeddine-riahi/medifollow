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
        // Palette médicale (cf. spec)
        medical: {
          50: "#eff6fb",
          100: "#d6e8f3",
          200: "#a8cde5",
          300: "#73add4",
          400: "#3f8cc2",
          500: "#1a6fbc", // primaire
          600: "#155a98",
          700: "#114777",
          800: "#0d3559",
          900: "#0a253e",
        },
        success: {
          50: "#f0fdf4",
          500: "#16a34a",
          600: "#15803d",
        },
        danger: {
          50: "#fef2f2",
          500: "#dc2626",
          600: "#b91c1c",
        },
        warning: {
          50: "#fffbeb",
          500: "#d97706",
          600: "#b45309",
        },
        canvas: "#f8fafc",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      boxShadow: {
        card: "0 1px 3px 0 rgb(15 23 42 / 0.06), 0 1px 2px -1px rgb(15 23 42 / 0.04)",
        soft: "0 8px 24px -8px rgb(15 23 42 / 0.12)",
      },
      animation: {
        pulseAlert: "pulseAlert 1.6s ease-in-out infinite",
      },
      keyframes: {
        pulseAlert: {
          "0%, 100%": { boxShadow: "0 0 0 0 rgba(220, 38, 38, 0.5)" },
          "50%": { boxShadow: "0 0 0 12px rgba(220, 38, 38, 0)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
