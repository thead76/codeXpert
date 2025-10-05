/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        // This makes "Fira Code" the default font for the application.
        sans: ["Fira Code", "sans-serif"],
        // We keep 'orbitron' as a custom font for special headings.
        orbitron: ["Orbitron", "sans-serif"],
      },
    },
  },
  plugins: [],
};

