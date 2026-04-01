/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#132238',
        sand: '#f4efe7',
        aurora: '#0f766e',
        ember: '#f97316',
      },
      fontFamily: {
        sans: ['"Manrope"', 'sans-serif'],
        display: ['"Space Grotesk"', 'sans-serif'],
      },
      boxShadow: {
        panel: '0 20px 60px -32px rgba(15, 23, 42, 0.35)',
      },
    },
  },
  plugins: [],
}
