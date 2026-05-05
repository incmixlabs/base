const baseConfig = require('@incmix/config/tailwind.config')

/** @type {import('tailwindcss').Config} */
module.exports = {
  ...baseConfig,
  content: ['./src/**/*.{js,ts,jsx,tsx}', '../ui/src/**/*.{js,ts,jsx,tsx}', '../ui/dist/**/*.js'],
}
