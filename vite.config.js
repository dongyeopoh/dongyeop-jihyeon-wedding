import { defineConfig, loadEnv } from 'vite'
import process from 'node:process'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  if (!env.VITE_NAVERMAPS_KEY_ID) {
    throw new Error('VITE_NAVERMAPS_KEY_ID 가 .env 에 없습니다')
  }

  return {
    plugins: [react()],
    base: "/dongyeop-jihyeon-wedding/",
    server: {
      port: 5173,
      strictPort: true,
      host: true,
      origin: "http://0.0.0.0:5173",
      },
  }
})
