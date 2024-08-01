/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
    "./src/app/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
  },
  plugins: [
    function ({ addUtilities }) {
      addUtilities({
          '.scrollbar-thin': {
              '::-webkit-scrollbar': {
                  width: '8px',
                  height: '8px',
              },
              '::-webkit-scrollbar-thumb': {
                  backgroundColor: 'rgba(100, 100, 100, 0.6)',
                  borderRadius: '4px',
              },
              '::-webkit-scrollbar-thumb:hover': {
                  backgroundColor: 'rgba(100, 100, 100, 0.8)',
              },
              '::-webkit-scrollbar-track': {
                  background: 'rgba(200, 200, 200, 0.2)',
              },
          },
      });
  },
  ],
};
