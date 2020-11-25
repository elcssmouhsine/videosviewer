const colors = require('tailwindcss/colors')

module.exports = {
  purge: [],
  darkMode: 'class', // or 'media' or 'class'
  theme: {
    extend: {},
    colors: {
      rose: colors.rose,
      purple: colors.purple,
      red: colors.red,
      white: colors.white,
      black: colors.black,
      blue: colors.blue,
      gray: colors.coolGray,
      yellow: colors.yellow,
      indigo: colors.indigo,
      green: colors.green,
      lime: colors.lime
    }
  },
  variants: {
    extend: {
      ringColor: ['hover'],
      ringWidth: ['hover'],
      zIndex: ['hover'],
    },
  },
  plugins: [],
}
