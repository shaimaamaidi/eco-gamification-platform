/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}"
  ],
  theme: {
    extend: {},
  },
  plugins: [],
   safelist: [
    'toast', 'toast-success', 'toast-error', 'toast-info', 'toast-warning',
    'toast-top-right', 'toast-top-left', 'toast-bottom-right', 'toast-bottom-left',
    'toast-bottom-center', 'toast-top-center'
  ],
}
