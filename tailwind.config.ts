import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: "#0F1216",
        panel: "#1A1E24",
        panelLight: "#22262E",
        bone: "#ECEAE4",
        boneDim: "#A7A79F",
        amber: "#E8A33D",
        violet: "#7C6FFF",
        line: "#2B2F36",
      },
      fontFamily: {
        display: ["var(--font-display)", "sans-serif"],
        body: ["var(--font-body)", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      letterSpacing: {
        tightest: "-0.04em",
        widemono: "0.18em",
      },
    },
  },
  plugins: [],
};

export default config;
