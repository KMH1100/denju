import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Pastel Pink - 柔らかなパステルピンク
        pink: {
          50: '#FFF9FB',
          100: '#FFF2F7',
          200: '#FFE6F0',
          300: '#FFD9E9',
          400: '#FFC7DE',
          500: '#FFB6C1', // メインのパステルピンク
          600: '#FF9DB0',
          700: '#FF849F',
          800: '#FF6B8E',
          900: '#FF527D',
        },
        // Lemon Yellow - 明るいレモンイエロー
        yellow: {
          50: '#FFFEF5',
          100: '#FFFCE0',
          200: '#FFF9C2',
          300: '#FFF7A3',
          400: '#FFF685',
          500: '#FFF44F', // メインのレモンイエロー
          600: '#FFE31A',
          700: '#FFD700',
          800: '#E6C200',
          900: '#CCAD00',
        },
        // Charcoal Gray - 深みのあるチャコールグレー
        charcoal: {
          50: '#F5F5F5',
          100: '#E8E8E8',
          200: '#D1D1D1',
          300: '#BABABA',
          400: '#A3A3A3',
          500: '#8C8C8C',
          600: '#666666',
          700: '#4D4D4D',
          800: '#333333', // メインのチャコールグレー
          900: '#1A1A1A',
        },
      },
      fontFamily: {
        sans: ['var(--font-noto-sans)', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.5rem',
        '3xl': '2rem',
      },
      letterSpacing: {
        'widest': '0.15em',
      },
    },
  },
  plugins: [],
}
export default config
