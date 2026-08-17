/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',

  content: [
    './app/**/*.{js,jsx,ts,tsx}',
    './components/**/*.{js,jsx,ts,tsx}',
    './screens/**/*.{js,jsx,ts,tsx}',
    './src/**/*.{js,jsx,ts,tsx}',
  ],

  presets: [require('nativewind/preset')],

  theme: {
    extend: {
      fontFamily: {
        manrope: ['manrope-regular'],
        'manrope-medium': ['manrope-medium'],
        'manrope-semibold': ['manrope-semiBold'],
        'manrope-bold': ['manrope-bold'],
        'manrope-light': ['manrope-light'],
      },

      colors: {
        bg: {
          DEFAULT: '#F8F7FC',
          dark: '#0B1120',
        },

        surface: {
          DEFAULT: '#FFFFFF',
          dark: '#111827',
        },

        card: {
          DEFAULT: '#FFFFFF',
          dark: '#111827',
        },

        text: {
          DEFAULT: '#171A2B',
          secondary: '#667085',
          muted: '#98A2B3',

          dark: '#F8FAFC',
          darkSecondary: '#CBD5E1',
          darkMuted: '#94A3B8',
        },

        border: {
          DEFAULT: '#E5E7EB',
          light: '#F3F4F6',

          dark: '#263449',
          darkLight: '#334155',
        },

        input: {
          DEFAULT: '#FFFFFF',
          background: '#F8F7FC',
          placeholder: '#98A2B3',

          border: '#E5E7EB',

          dark: '#1E293B',
          darkBackground: '#111827',
          darkBorder: '#334155',
          darkPlaceholder: '#64748B',
        },

        primary: {
          DEFAULT: '#5B3DF5',
          light: '#F1EEFF',
          lighter: '#F8F5FF',
          dark: '#111827',
        },

        secondary: {
          DEFAULT: '#8B3DFF',
          light: '#F7F2FF',
          dark: '#6D28D9',
        },

        button: {
          primary: '#5B3DF5',
          primaryPressed: '#4525D9',

          secondary: '#F1EEFF',
          secondaryText: '#5B3DF5',

          disabled: '#D1D5DB',
          disabledText: '#9CA3AF',

          dark: '#FFFFFF',
          darkText: '#171A2B',
        },

        success: {
          DEFAULT: '#20C878',
          background: '#E9FBF2',
          text: '#15803D',

          darkBackground: '#064E3B',
          darkText: '#6EE7B7',
        },

        warning: {
          DEFAULT: '#F5A623',
          background: '#FFF7E6',
          text: '#B45309',

          darkBackground: '#78350F',
          darkText: '#FCD34D',
        },

        danger: {
          DEFAULT: '#EF4444',
          background: '#FEECEC',
          text: '#B91C1C',

          darkBackground: '#7F1D1D',
          darkText: '#FCA5A5',
        },

        info: {
          DEFAULT: '#3B82F6',
          background: '#EFF6FF',
          text: '#1D4ED8',

          darkBackground: '#1E3A8A',
          darkText: '#93C5FD',
        },

        icon: {
          DEFAULT: '#667085',
          active: '#5B3DF5',
          muted: '#98A2B3',

          dark: '#CBD5E1',
          darkActive: '#A78BFA',
        },

        overlay: {
          DEFAULT: 'rgba(15,23,42,0.45)',
          dark: 'rgba(0,0,0,0.65)',
        },

        skeleton: {
          DEFAULT: '#E5E7EB',
          highlight: '#F3F4F6',

          dark: '#334155',
          darkHighlight: '#475569',
        },
      },

      borderRadius: {
        sm: '8px',
        md: '12px',
        lg: '16px',
        xl: '20px',
        '2xl': '24px',
        '3xl': '32px',
      },

      boxShadow: {
        card: '0 8px 25px rgba(0,0,0,0.06)',

        cardDark: '0 8px 30px rgba(0,0,0,0.35)',

        button: '0 8px 20px rgba(91,61,245,0.25)',

        floating: '0 12px 40px rgba(0,0,0,0.12)',
      },
    },
  },

  plugins: [],
};
