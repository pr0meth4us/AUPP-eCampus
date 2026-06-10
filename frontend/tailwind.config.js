const { heroui } = require("@heroui/theme");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brutal: {
          bg: '#f4f4f0', // Stark cream background
          yellow: '#ffdc00',
          red: '#ff3e3e',
          blue: '#1e3a8a',
          black: '#111111',
        }
      },
      boxShadow: {
        'brutal': '6px 6px 0px 0px rgba(17,17,17,1)',
        'brutal-lg': '10px 10px 0px 0px rgba(17,17,17,1)',
        'brutal-hover': '2px 2px 0px 0px rgba(17,17,17,1)',
      },
      fontFamily: {
        brutal: ['"Space Grotesk"', 'system-ui', 'sans-serif'],
      }
    },
  },
  darkMode: "class",
  plugins: [heroui()],
};