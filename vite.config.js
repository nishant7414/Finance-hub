import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules/react')) {
            return 'react-vendor'
          }

          if (id.includes('node_modules/recharts')) {
            return 'recharts-core'
          }

          if (
            id.includes('node_modules/victory-vendor') ||
            id.includes('node_modules/react-smooth') ||
            id.includes('node_modules/recharts-scale') ||
            id.includes('node_modules/lodash') ||
            id.includes('node_modules/clsx') ||
            id.includes('node_modules/eventemitter3') ||
            id.includes('node_modules/tiny-invariant')
          ) {
            return 'recharts-vendor'
          }

          return undefined
        },
      },
    },
  },
})
