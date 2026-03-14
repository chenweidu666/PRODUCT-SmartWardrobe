import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 8081,
    host: '0.0.0.0'  // 允许所有IP访问
  }
}) 