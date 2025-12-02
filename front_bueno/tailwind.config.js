module.exports = {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        'mostaza': "#D19739",
        'dark-green': '#233D2E',
        'card-bg': '#F8F7F3',
        'table-blue': '#AFC3D9',
        'accent-green': '#3CB371',
      },
      fontFamily: {
        pixel: ["'Press Start 2P'", "cursive"],
      },
      keyframes: {
        fadeZoom: {
          'from': {
            opacity: '0',
            transform: 'translate(-50%, -50%) scale(0.93)',
          },
          'to': {
            opacity: '1',
            transform: 'translate(-50%, -50%) scale(1)',
          },
        },
      },
      animation: {
        fadeZoom: 'fadeZoom 0.25s ease-out',
      },
    },
  },
  plugins: [],
}
