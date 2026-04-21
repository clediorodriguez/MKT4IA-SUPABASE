/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          500: '#0ea5e9',
          600: '#0284c7',
          900: '#0c4a6e',
        },
        purple: {
          500: '#a855f7',
          600: '#9333ea',
        },
        dark: {
          bg: '#0f172a',
          card: '#1e293b',
          input: '#334155'
        }
      }
    },
  },
  plugins: [],
}
