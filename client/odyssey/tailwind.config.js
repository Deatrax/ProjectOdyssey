/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        odyssey: ['"Playfair Display"', 'serif'],
        body: ['Manrope', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
