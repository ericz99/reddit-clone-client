module.exports = {
  purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      spacing: {
        312: '312px',
        640: '640px',
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
