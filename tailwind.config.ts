import type { Config } from 'tailwindcss'
export default <Partial<Config>>{
    content: ['./src/**/*.{vue,js,ts,jsx,tsx}'],
    theme: {
        extend: {
          colors: {
              primary: 'var(--color-primary)',
              secondary: 'var(--color-secondary)',
              accent: 'var(--color-accent)',
              transparent: 'transparent'
          },
        },
      },
      plugins: [],
}
