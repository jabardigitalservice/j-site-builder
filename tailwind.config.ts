import type { Config } from 'tailwindcss'

export default <Partial<Config>>{
  theme: {
    extend: {
      fontFamily: {
        lato: ['Lato', 'sans-serif'],
        roboto: ['Roboto', 'sans-serif'],
        lora: ['Lora', 'serif'],
        inter: ['Inter', 'sans-serif'],
      },
      fontSize: {
        xxs: '0.625rem',
      },
      backgroundImage: {
        'pattern-content': "url('/images/pattern-content.svg')",
      },
      colors: {
        green: {
          50: '#E6F6EC',
          100: '#C3E9D0',
          200: '#9BDBB3',
          300: '#70CD94',
          400: '#4DC27E',
          500: '#1FB767',
          600: '#16A75C',
          700: '#069550',
          800: '#008444',
          900: '#006430',
        },
        gray: {
          50: '#FAFAFA',
          100: '#F5F5F5',
          200: '#EEEEEE',
          300: '#E0E0E0',
          400: '#BDBDBD',
          500: '#9E9E9E',
          600: '#757575',
          700: '#616161',
          800: '#424242',
          900: '#212121',
        },
        'blue-gray': {
          50: '#E3E7ED',
          100: '#B9C3D3',
          200: '#8D9DB5',
          300: '#627798',
          400: '#415C84',
          500: '#1A4373',
          600: '#133C6B',
          700: '#083461',
          800: '#022B55',
          900: '#001B3D',
        },
        red: {
          50: '#FFEBEE',
          100: '#FFCDD2',
          200: '#EF9A9A',
          300: '#E57373',
          400: '#EF5350',
          500: '#F44336',
          600: '#E53935',
          700: '#D32F2F',
          800: '#C62828',
          900: '#B71B1C',
        },
      },
    },
  },
  plugins: [],
}
