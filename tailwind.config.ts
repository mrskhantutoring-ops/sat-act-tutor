import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#eef4ff",
          100: "#dbe7fe",
          500: "#2f6df6",
          600: "#1f56d8",
          700: "#1a46b0",
          900: "#16294f",
        },
      },
    },
  },
  plugins: [],
};

export default config;
