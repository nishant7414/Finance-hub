/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#0a0f1e',
        accent: '#6366f1',
        income: '#10b981',
        expense: '#f43f5e',
      },
      fontFamily: {
        sans: ['"Inter"', 'sans-serif'],
        display: ['"Inter"', 'sans-serif'],
      },
      boxShadow: {
        panel: '0 25px 70px -34px rgba(15, 23, 42, 0.28)',
      },
    },
  },
  plugins: [],
}
