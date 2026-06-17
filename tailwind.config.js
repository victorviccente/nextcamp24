/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Paleta NEXT CAMP 26 (acampamento / camuflagem / céu / fogueira)
        sky: { light: '#7EC8E3', DEFAULT: '#4BA3C7', deep: '#2E7FA8' },
        army: { light: '#4F5D34', DEFAULT: '#3C4A2A', dark: '#2B3520' },
        blaze: { light: '#F26A35', DEFAULT: '#E2542B', dark: '#C2421E' },
        cream: { light: '#F8F3E9', DEFAULT: '#F2EBDD', dark: '#E4D8C0' },
        charcoal: { DEFAULT: '#221F1A', soft: '#2E2A23' },
        spark: '#FFD23F', // brilho de fogueira / marshmallow
        ember: '#A6311A', // sombra de fogueira / botão pressionado
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Anton', 'Inter', 'sans-serif'],
        pixel: ['"Press Start 2P"', 'monospace'],
      },
      boxShadow: {
        'hard': '6px 6px 0 0 #221F1A',
        'hard-sm': '4px 4px 0 0 #221F1A',
        'hard-lg': '10px 10px 0 0 #221F1A',
      },
    },
  },
  plugins: [],
}
