export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        brand: "#6C63FF",        // stays constant in light & dark
        "brand-hover": "#5B52E6",
        "brand-hover-dark": "#7C73FF",
        "brand-soft": "#E7E2FF", // light mode active bg
      },
    },
  },
  plugins: [],
};