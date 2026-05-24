/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Suisse Intl"', 'Helvetica', 'Arial', 'sans-serif'],
        mono: ['"Suisse Intl Mono"', '"Courier New"', 'monospace'],
        pixel: ['apkarchivr21', 'monospace'],
      },
      colors: {
        terminal: '#0B0B0B',
        shell: '#E7E6D9',
        ultraviolet: '#6236F4',
        'neutral-800': '#262625',
        'neutral-700': '#42413e',
        'neutral-300': '#B0AFA6',
      },
      spacing: {
        xs: '40px',
        sm: '60px',
        md: '80px',
        lg: '100px',
        xl: '160px',
      },
      fontSize: {
        '7xl': '7.315rem',
        '6xl': '6rem',
        '5xl': '4.5rem',
        '2xl': '2.15rem',
      },
      letterSpacing: {
        tighter: '-0.02em',
        widest: '0.05em',
      },
      lineHeight: {
        none: '100%',
        tight: '110%',
      },
    },
  },
  plugins: [],
}
