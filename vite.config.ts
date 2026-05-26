import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'
import { execSync } from 'child_process'

function gitShortSha(): string {
  // Vercel exposes the commit SHA as an env var; fall back to local git.
  const envSha = process.env.VERCEL_GIT_COMMIT_SHA
  if (envSha) return envSha.slice(0, 7)
  try {
    return execSync('git rev-parse --short HEAD').toString().trim()
  } catch {
    return 'unknown'
  }
}

// Build stamp shown in the app header so we can confirm which deploy is loaded.
const buildStamp = `${gitShortSha()} · ${new Date().toISOString().slice(0, 16).replace('T', ' ')}`

export default defineConfig({
  define: {
    __BUILD_STAMP__: JSON.stringify(buildStamp),
  },
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
