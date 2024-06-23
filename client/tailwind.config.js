const flowbite = require("flowbite-react/tailwind");

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    flowbite.content(),
  ],
  theme: {
    extend: {},
    colors: {
      'dark-blue': {
        DEFAULT: '#00072D'
      },
      'mid-blue': {
        DEFAULT: '#064998'
      },
      'light-blue': {
        DEFAULT: '#E2ECF3'
      },
    }
  },
  plugins: [
    flowbite.plugin(),
  ],
}

