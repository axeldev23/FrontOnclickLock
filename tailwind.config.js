const withMT = require("@material-tailwind/react/utils/withMT");


/** @type {import('tailwindcss').Config} */
module.exports = withMT({
  darkMode: 'media', // Puedes usar 'media' para detectar automáticamente el modo oscuro

  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}", // Asegúrate de incluir jsx si usas JSX en React
  ],
  theme: {
    extend: {
      boxShadow: {
        'custom': '15px 15px 30px rgb(25, 25, 25), -15px -15px 30px rgb(60, 60, 60)',

      },
      textColor: ['disabled'],
      colors: {
        'dark-background': '#02040a',
        'dark-secondary': '#0e1117',
        'dark-border': '#30363c',
        'slider-color': '#f2f2f2',
        'slider-color-button': '#3363ff'
      }

    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}
);

