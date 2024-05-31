/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}","./node_modules/react-tailwindcss-datepicker/dist/index.esm.js"],
  theme: {
    extend: {},
    daisyui: {
      themes: ["light"],
    }
  },
  plugins: [
    require('daisyui'),
    require('flowbite/plugin')
  ],
};
