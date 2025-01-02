/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#09f",
        secondary: "#666",
        success: "#dc143c",
        warning: "#ffd700",
        failure: "#ff6562",
      },
      keyframes: {
        wiggle: {
          "0%, 100%": { transform: "rotate(-1deg)" },
          "50%": { transform: "rotate(1deg)" },
        },
      },
      animation: {
        wiggle: "wiggle 300ms ease-in-out",
      },
    },
  },
  plugins: [],
};
