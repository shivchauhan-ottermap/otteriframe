/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        bg: "#0a0a0a",
        surface: "#111111",
        surface2: "#181818",
        border: "#2a2a2a",
        "border-bright": "#3d3d3d",
        text: "#e8e8e8",
        muted: "#666666",
        accent: "#00e5a0",
        warn: "#f5a623",
        danger: "#ff4d4d",
      },
      fontFamily: {
        mono: ['"IBM Plex Mono"', "monospace"],
        sans: ["Syne", "sans-serif"],
      },
      transitionDuration: {
        400: "400ms",
      },
      opacity: {
        35: "0.35",
      },
    },
  },
  plugins: [],
};
