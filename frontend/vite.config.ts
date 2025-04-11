import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Proxy requests for /uploads to your backend
      '/uploads': {
        target: 'http://localhost:3000', // Your backend URL
        changeOrigin: true,
        secure: false,
      },
   
    },
  },
})
