/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        brand: {
          bg:      '#0F172A',
          surface: '#1E293B',
          card:    '#162032',
          border:  '#2D3F5C',
          cyan:    '#00D4FF',
          cyan2:   '#0EA5E9',
          amber:   '#F59E0B',
          dim:     '#94A3B8',
          text:    '#CBD5E1',
        },
      },
      fontFamily: {
        sans:    ['Inter', 'system-ui', 'sans-serif'],
        display: ['"Plus Jakarta Sans"', 'Inter', 'sans-serif'],
      },
      typography: (theme) => ({
        DEFAULT: {
          css: {
            color: theme('colors.brand.text'),
            a: { color: theme('colors.brand.cyan'), '&:hover': { color: '#fff' } },
            h1: { color: '#fff', fontFamily: '"Plus Jakarta Sans", sans-serif' },
            h2: { color: '#fff', fontFamily: '"Plus Jakarta Sans", sans-serif' },
            h3: { color: '#fff', fontFamily: '"Plus Jakarta Sans", sans-serif' },
            h4: { color: '#fff' },
            strong: { color: '#fff' },
            code: { color: theme('colors.brand.cyan'), background: '#162032', padding: '2px 6px', borderRadius: '4px' },
            blockquote: { borderLeftColor: theme('colors.brand.cyan'), color: theme('colors.brand.dim') },
          },
        },
      }),
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
};
