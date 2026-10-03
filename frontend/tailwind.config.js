export default {
  content: ["./frontend/index.html", "./frontend/src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        bg: "#0A0A0A",
        card: "#121212",
        card2: "#181818",
        line: "#242424",
        line2: "#2C2C2C",
        acc: "#FF9F2F",
        gold: "#D88924",
        mute: "#A1A1A1",
        dim: "#6F6F6F",
      },
      fontFamily: {
        serif: ['"Playfair Display"', "serif"],
        sans: ["Inter", "sans-serif"],
        script: ['"Pinyon Script"', "cursive"],
      },
      keyframes: {
        up: {
          from: { opacity: 0, transform: "translateY(12px)" },
          to: { opacity: 1, transform: "none" },
        },
      },
      animation: { up: "up .35s ease-out both" },
    },
  },
  plugins: [],
};
