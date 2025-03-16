import type { Config } from "tailwindcss";
import preline from 'preline/plugin';

export default {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/preline/preline.js"
  ],
  theme: {

    extend: {
      container: {
        center: true,
        padding: "1rem",
        screens: {
          "2xl": "1400px",
        },
      },
      colors: {
        primary: "#001AEF",
        secondary: "#333598",
        tertiary: "#A0A0FF",
        black: "#070834",
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [
    preline,
  ],
} satisfies Config;
