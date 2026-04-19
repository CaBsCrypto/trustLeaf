import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        "tl-green": "#4caf50",
        "tl-green-light": "#81c784",
        "tl-bg": "#0a0f0a",
      },
    },
  },
  plugins: [],
};

export default config;
