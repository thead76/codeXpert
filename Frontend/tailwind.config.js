/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        // Add the line below
        georgia: ['Georgia', 'serif'],
        
        // You can keep other custom fonts here
        orbitron: ['"Orbitron"', 'sans-serif'],
      },
    },
  },
  plugins: [],
}