/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      "./src/**/*.{js,jsx,ts,tsx}",
      "./public/index.html",
    ],
    theme: {
      extend: {
        colors: {
          primary: "#1E88E5",
          secondary: "#43A047",
          warning: "#FB8C00",
          danger: "#E53935",
          dark: "#263238",
          light: "#ECEFF1"
        },
        fontFamily: {
          sans: [
            '-apple-system',
            'BlinkMacSystemFont',
            'Segoe UI',
            'Roboto',
            'Oxygen',
            'Ubuntu',
            'Cantarell',
            'Fira Sans',
            'Droid Sans',
            'Helvetica Neue',
            'sans-serif'
          ]
        }
      },
    },
    plugins: [
      require('@tailwindcss/forms')({
        strategy: 'class',
      }),
    ],
  }