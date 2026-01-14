import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api/logo': {
        target: 'https://img.logo.dev',
        changeOrigin: true,
        rewrite: (path) => {
          // Extract symbol from path like /api/logo/btc
          const symbol = path.replace('/api/logo/', '')
          const apiKey = process.env.VITE_LOGO_DEV_API_KEY || 'pk_EBGfzH1gRem9xxAgLDu30Q'
          return `/crypto/${symbol}?token=${apiKey}`
        },
      },
    },
  },
})
