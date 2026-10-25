/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        burgundy: {
          950: '#1a0407',
          900: '#2b070d',
          800: '#460b14',
          700: '#67101e',
          600: '#8e1629',
          500: '#b81d36',
          400: '#dc2626'
        },
        gold: {
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309'
        }
      }
    },
  },
  plugins: [],
}
