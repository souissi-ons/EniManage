/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,ts}"],
  theme: {
    extend: {},
  },
  plugins: [],
  theme: {
    extend: {
      colors: {
        teal: {
          light: "#4FD1C5",
          DEFAULT: "#4FD1C5",
          dark: "#38B2AC",
        },
      },
    },
  },
};
