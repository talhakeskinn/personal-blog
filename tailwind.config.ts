import type { Config } from "tailwindcss";
import typography from "@tailwindcss/typography";

export default {
  darkMode: 'class',
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        heading: ["var(--font-heading)"], // Source Serif 4
        serif: ["var(--font-body)"],     // Crimson Pro
        sans: ["var(--font-ui)"],        // IBM Plex Sans
      },
      colors: {
        win11: {
          bg: "#202020",
          card: "#2c2c2c",
          border: "#3d3d3d",
          hover: "#353535"
        }
      }
    },
  },
  future: {
    hoverOnlyWhenSupported: true,
  },
  plugins: [
    typography,
  ],
} satisfies Config;
