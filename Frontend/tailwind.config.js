// export default {
//   content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
//   theme: {
//     extend: {
//       fontFamily: {
//         orbitron: ["Orbitron", "sans-serif"],
//         inter: ["Inter", "sans-serif"],
//       },
//     },
//   },
//   plugins: [],
// };
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: './', // ensures correct asset paths on Vercel
  server: {
    port: 5173, // optional, default Vite port
  },
});
