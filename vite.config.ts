import path from 'path'
import { defineConfig } from 'vite'
import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'
import tailwindcss from '@tailwindcss/vite'
import fs from 'fs'

const pemKeyPath = path.resolve(__dirname, 'localhost-key.pem')
const pemCertPath = path.resolve(__dirname, 'localhost.pem')
const hasLocalPem = fs.existsSync(pemKeyPath) && fs.existsSync(pemCertPath)

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    babel({ presets: [reactCompilerPreset()] }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: hasLocalPem
    ? {
        https: {
          key: fs.readFileSync(pemKeyPath),
          cert: fs.readFileSync(pemCertPath),
        },
      }
    : {},
})
