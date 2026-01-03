/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './App.{js,ts,tsx}',
    './components/**/*.{js,ts,tsx}',
  ],

  presets: [require('nativewind/preset')],

  theme: {
    extend: {
      colors: {
        primary: '#8F42DE',
        primaryVariant: '#3700B3',
        secondary: '#03DAC6',
        background: '#DBDBDB',
        backgroundLight: '#d4cdf7ff',
        border: '#E2E2E2',
        inactive: '#9E9E9E',
        active: '#844cd3ff',
        white: '#FFFFFF',
      },
    },
  },

  plugins: [],
};
