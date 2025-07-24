import typography from '@tailwindcss/typography';
import aspectRatio from '@tailwindcss/aspect-ratio';

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#2563EB',    // biru utama
        secondary: '#1E40AF',  // biru gelap
        light: '#E0F2FE',      // biru muda
        dark: '#0F172A',       // hitam kebiruan untuk bg
      },
      fontFamily: {
        inter: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [
    aspectRatio,
    typography,
  ],
};
