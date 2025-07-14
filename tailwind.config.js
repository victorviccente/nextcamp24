/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'primary': '#008080',      // Verde-azulado (Teal)
        'accent': '#FF7F50',       // Laranja (Coral/Tangerine)
        'background': '#F5F5F3',   // Creme/Off-white
        'dark': '#2F2F2F',         // Carvão/Near-black
      },
      fontFamily: {
        // Adiciona a fonte 'Inter' à sua configuração
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}