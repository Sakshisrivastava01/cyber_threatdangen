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
          dark: '#0B1020',
          card: '#121A2B',
          cyan: '#00E5FF',
          purple: '#7B61FF',
          green: '#00FFA3'
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
