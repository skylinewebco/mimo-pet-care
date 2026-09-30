/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        maroon: { DEFAULT: '#91352B', deep: '#6E261F', soft: '#A94C41' },
        peach: { DEFAULT: '#F8C9B7', deep: '#F2B8A3' },
        cream: '#F9DFC8',
        yellow: '#FBE07A',
        teal: '#6AA9B5',
        green: '#6AAA4B',
      },
      fontFamily: {
        display: ['Fredoka', 'ui-rounded', 'system-ui', 'sans-serif'],
        body: ['Manrope', 'system-ui', 'sans-serif'],
      },
      borderWidth: { 1.5: '1.5px' },
      borderRadius: { '4xl': '2rem', '5xl': '2.5rem' },
      screens: { xs: '400px', '3xl': '1680px' },
      boxShadow: {
        soft: '0 10px 30px -12px rgba(110, 38, 31, 0.25)',
        lift: '0 22px 40px -18px rgba(110, 38, 31, 0.35)',
        press: '0 6px 0 0 #6E261F',
      },
    },
  },
  plugins: [],
}
