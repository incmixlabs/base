const baseConfig = require('@incmix/config/tailwind.config')

/** @type {import('tailwindcss').Config} */
module.exports = {
  ...baseConfig,
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}', './docs/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    ...baseConfig.theme,
    container: {
      center: true,
      padding: '1rem',
    },
  },
}
