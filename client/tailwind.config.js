/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        dangen: {
          dark: '#0b000f',
          card: '#14040a',
          red: '#ff003c',
          darkred: '#7a0019',
          accent: '#ff4d6d',
          glow: '#ff1744',
          cyan: '#ff003c',
          purple: '#7a0019',
          green: '#ff4d6d'
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
        display: ['Space Grotesk', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
