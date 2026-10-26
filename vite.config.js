import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const raw = process.env.BASE_PATH ?? env.BASE_PATH ?? '/react-dashboard-layout-integration'
  // Normalize to "/segment/" form (leading and trailing slash)
  const base = `/${raw.replace(/^\/+|\/+$/g, '')}/`.replace(/^\/\/$/, '/')

  return {
    base,
    plugins: [react()],
  }
})
