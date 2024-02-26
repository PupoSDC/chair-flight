const { createGlobPatternsForDependencies } = require("@nx/react/tailwind");
const { join } = require("path");

const colors = require('tailwindcss/colors');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    join(
      __dirname,
      "{src,pages,components,app}/**/*!(*.stories|*.spec).{ts,tsx,html}",
    ),
    ...createGlobPatternsForDependencies(__dirname),
  ],
  theme: {
    extend: {
      colors: {
        primary: colors.blue,
        neutral: colors.zinc,
      },
      spacing: {
        'header': 'var(--header-height)',
      },
      fontFamily: {
        sans: ['Graphik', 'sans-serif'],
        serif: ['Merriweather', 'serif'],
      },
      keyframes: {
        blink: {
          '50%': { opacity: 0 },
        }
      },
      animation: {
        blink: 'blink 1s infinite step-start',
      }
    },
  },
  plugins: [],
  darkMode: 'selector',
};
